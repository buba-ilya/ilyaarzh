export type VideoProvider = 'vimeo' | 'youtube' | 'kinescope';

export interface ParsedVideo {
  provider: VideoProvider;
  id: string;
  hash?: string;
  embedUrl: string;
  thumbUrl?: string;
}

export interface ParseVideoOptions {
  /** Start playback as soon as the iframe is inserted (it is inserted on click). */
  autoplay?: boolean;
  /** Loop the video — used for the showreel on ABOUT. */
  loop?: boolean;
  /** Start without sound. Browsers only allow autoplay without a click when muted. */
  muted?: boolean;
}

const YOUTUBE_RE =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

// Watch page (kinescope.io/ID) and embed link (kinescope.io/embed/ID). The docs do not
// pin the id's length or alphabet, so this stays deliberately loose.
const KINESCOPE_RE = /kinescope\.io\/(?:embed\/)?([A-Za-z0-9]{6,})/;

const VIMEO_PLAYER_RE = /player\.vimeo\.com\/video\/(\d+)/;
const VIMEO_DIRECT_RE =
  /vimeo\.com\/(?:channels\/[\w-]+\/|groups\/[\w-]+\/videos\/|album\/\d+\/video\/)?(\d+)(?:\/([A-Za-z0-9]+))?/;

function hashFromQuery(url: string): string | undefined {
  const m = url.match(/[?&]h=([A-Za-z0-9]+)/);
  return m ? m[1] : undefined;
}

export function parseVideo(
  url?: string | null,
  options: ParseVideoOptions = {},
): ParsedVideo | null {
  if (!url) return null;
  const raw = url.trim();
  if (!raw) return null;

  const { autoplay = true, loop = false, muted = false } = options;

  const yt = raw.match(YOUTUBE_RE);
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    params.set('rel', '0');
    params.set('modestbranding', '1');
    params.set('playsinline', '1');
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', id);
    }
    return {
      provider: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`,
      thumbUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    };
  }

  if (/vimeo\.com/.test(raw)) {
    const player = raw.match(VIMEO_PLAYER_RE);
    const direct = player ? null : raw.match(VIMEO_DIRECT_RE);
    const id = player?.[1] ?? direct?.[1];

    if (!id) {
      console.warn(
        `[video] Vimeo link "${raw}" has no numeric video id. Use a link like https://vimeo.com/123456789 (optionally with a privacy hash).`,
      );
      return null;
    }

    const hash = direct?.[2] ?? hashFromQuery(raw);
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    params.set('title', '0');
    params.set('byline', '0');
    params.set('portrait', '0');
    params.set('dnt', '1');
    if (loop) params.set('loop', '1');
    if (hash) params.set('h', hash);

    return {
      provider: 'vimeo',
      id,
      ...(hash ? { hash } : {}),
      embedUrl: `https://player.vimeo.com/video/${id}?${params.toString()}`,
    };
  }

  const kinescope = raw.match(KINESCOPE_RE);
  if (kinescope) {
    const id = kinescope[1];
    const params = new URLSearchParams();
    if (autoplay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (loop) params.set('loop', '1');
    params.set('dnt', '1');
    return {
      provider: 'kinescope',
      id,
      embedUrl: `https://kinescope.io/embed/${id}?${params.toString()}`,
    };
  }

  console.warn(
    `[video] Unrecognised video link: "${raw}". Supported providers: Vimeo, YouTube, Kinescope.`,
  );
  return null;
}

// Shared by the tile, the cover and the og:image within one build. The dev server keeps
// this module alive between requests, so entries expire — otherwise a cover changed on
// Vimeo would never show up until the server is restarted.
const THUMBNAIL_TTL_MS = 60_000;
const thumbnailCache = new Map<string, { value: string | null; at: number }>();

async function ogImageFromVimeoPage(pageUrl: string): Promise<string | null> {
  const response = await fetch(pageUrl, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
    },
  });
  if (!response.ok) return null;

  const html = await response.text();
  const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
  return match ? match[1].replace(/&amp;/g, '&') : null;
}

/**
 * Cover image derived from the video link itself.
 * YouTube exposes a predictable URL; Vimeo needs one oEmbed call at build time.
 * Returns null when the link is empty, unrecognised, or Vimeo is unreachable —
 * the caller then falls back to the SOON placeholder.
 */
export async function getVideoThumbnail(url?: string | null): Promise<string | null> {
  const parsed = parseVideo(url, { autoplay: false });
  if (!parsed) return null;
  // Only Vimeo needs a lookup; YouTube has a predictable URL and Kinescope is left
  // to the placeholder rather than queried at build time.
  if (parsed.provider !== 'vimeo') return parsed.thumbUrl ?? null;

  const key = `vimeo:${parsed.id}`;
  const cached = thumbnailCache.get(key);
  if (cached && Date.now() - cached.at < THUMBNAIL_TTL_MS) return cached.value;

  const pageUrl = parsed.hash
    ? `https://vimeo.com/${parsed.id}/${parsed.hash}`
    : `https://vimeo.com/${parsed.id}`;

  let thumbnail: string | null = null;
  try {
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(pageUrl)}&width=1280`,
    );
    if (response.ok) {
      const data = (await response.json()) as { thumbnail_url?: string };
      thumbnail = data.thumbnail_url ?? null;
    } else {
      // oEmbed answers 403 for videos whose embedding is restricted, but the public
      // video page still carries an og:image. Fall back to that.
      thumbnail = await ogImageFromVimeoPage(pageUrl);
    }
  } catch {
    console.warn(`[video] Could not reach Vimeo for a cover of ${pageUrl}; using the placeholder.`);
  }

  thumbnailCache.set(key, { value: thumbnail, at: Date.now() });
  return thumbnail;
}
