import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseVideo, getVideoThumbnail } from './video';

describe('parseVideo — Vimeo', () => {
  it('parses a plain vimeo.com link', () => {
    const r = parseVideo('https://vimeo.com/123456789');
    expect(r).toMatchObject({ provider: 'vimeo', id: '123456789' });
    expect(r!.embedUrl).toBe(
      'https://player.vimeo.com/video/123456789?autoplay=1&title=0&byline=0&portrait=0&dnt=1',
    );
    expect(r!.thumbUrl).toBeUndefined();
  });

  it('parses a private link with a hash', () => {
    const r = parseVideo('https://vimeo.com/123456789/abcdef');
    expect(r).toMatchObject({ provider: 'vimeo', id: '123456789', hash: 'abcdef' });
    expect(r!.embedUrl).toContain('&h=abcdef');
  });

  it('parses a player.vimeo.com link', () => {
    const r = parseVideo('https://player.vimeo.com/video/123456789');
    expect(r).toMatchObject({ provider: 'vimeo', id: '123456789' });
  });

  it('reads the hash from a player.vimeo.com query string', () => {
    const r = parseVideo('https://player.vimeo.com/video/123456789?h=deadbeef');
    expect(r!.hash).toBe('deadbeef');
    expect(r!.embedUrl).toContain('&h=deadbeef');
  });

  it('returns null and warns for a profile link without a numeric id', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(parseVideo('https://vimeo.com/user/somebody')).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('adds loop=1 when requested', () => {
    const r = parseVideo('https://vimeo.com/123456789', { loop: true });
    expect(r!.embedUrl).toContain('loop=1');
  });
});

describe('parseVideo — YouTube', () => {
  const expected = (id: string) =>
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  it('parses youtube.com/watch?v=ID', () => {
    const r = parseVideo('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(r).toMatchObject({ provider: 'youtube', id: 'dQw4w9WgXcQ' });
    expect(r!.embedUrl).toBe(expected('dQw4w9WgXcQ'));
    expect(r!.thumbUrl).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg');
  });

  it('parses watch links with extra query params', () => {
    const r = parseVideo('https://www.youtube.com/watch?list=PL123&v=dQw4w9WgXcQ&t=10s');
    expect(r!.id).toBe('dQw4w9WgXcQ');
  });

  it('parses youtu.be/ID', () => {
    expect(parseVideo('https://youtu.be/dQw4w9WgXcQ')!.id).toBe('dQw4w9WgXcQ');
  });

  it('parses youtube.com/shorts/ID', () => {
    expect(parseVideo('https://www.youtube.com/shorts/dQw4w9WgXcQ')!.id).toBe('dQw4w9WgXcQ');
  });

  it('parses youtube.com/embed/ID', () => {
    expect(parseVideo('https://www.youtube.com/embed/dQw4w9WgXcQ')!.id).toBe('dQw4w9WgXcQ');
  });

  it('adds loop=1 and playlist=ID when looping', () => {
    const r = parseVideo('https://youtu.be/dQw4w9WgXcQ', { loop: true });
    expect(r!.embedUrl).toContain('loop=1');
    expect(r!.embedUrl).toContain('playlist=dQw4w9WgXcQ');
  });

  it('omits autoplay when disabled', () => {
    const r = parseVideo('https://youtu.be/dQw4w9WgXcQ', { autoplay: false });
    expect(r!.embedUrl).not.toContain('autoplay');
  });
});

describe('parseVideo — Kinescope', () => {
  const ID = '5R3xLEV8QHLkcs4ev7hKPK';

  it('parses a watch-page link', () => {
    const r = parseVideo(`https://kinescope.io/${ID}`);
    expect(r).toMatchObject({ provider: 'kinescope', id: ID });
    expect(r!.embedUrl).toBe(`https://kinescope.io/embed/${ID}?autoplay=1&dnt=1`);
  });

  it('parses an embed link', () => {
    const r = parseVideo(`https://kinescope.io/embed/${ID}`);
    expect(r).toMatchObject({ provider: 'kinescope', id: ID });
    expect(r!.embedUrl).toBe(`https://kinescope.io/embed/${ID}?autoplay=1&dnt=1`);
  });

  it('ignores query params on the source link', () => {
    expect(parseVideo(`https://kinescope.io/${ID}?t=30&quality=720`)!.id).toBe(ID);
  });

  it('works without the protocol', () => {
    expect(parseVideo(`kinescope.io/${ID}`)!.id).toBe(ID);
  });

  it('adds loop=1 when requested', () => {
    const r = parseVideo(`https://kinescope.io/${ID}`, { loop: true });
    expect(r!.embedUrl).toBe(`https://kinescope.io/embed/${ID}?autoplay=1&loop=1&dnt=1`);
  });

  it('omits autoplay when disabled', () => {
    const r = parseVideo(`https://kinescope.io/${ID}`, { autoplay: false, loop: true });
    expect(r!.embedUrl).toBe(`https://kinescope.io/embed/${ID}?loop=1&dnt=1`);
  });

  it('exposes no thumbnail — the cover falls back to the placeholder', () => {
    expect(parseVideo(`https://kinescope.io/${ID}`)!.thumbUrl).toBeUndefined();
  });

  it('returns null and warns for a link with no id', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(parseVideo('https://kinescope.io/')).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});

describe('parseVideo — muted autoplay', () => {
  it('uses muted=1 for Vimeo', () => {
    const r = parseVideo('https://vimeo.com/123456789', { muted: true, loop: true });
    expect(r!.embedUrl).toContain('autoplay=1');
    expect(r!.embedUrl).toContain('muted=1');
    expect(r!.embedUrl).toContain('loop=1');
  });

  it('uses mute=1 for YouTube', () => {
    expect(parseVideo('https://youtu.be/dQw4w9WgXcQ', { muted: true })!.embedUrl).toContain(
      'mute=1',
    );
  });

  it('uses muted=1 for Kinescope', () => {
    expect(
      parseVideo('https://kinescope.io/5R3xLEV8QHLkcs4ev7hKPK', { muted: true })!.embedUrl,
    ).toContain('muted=1');
  });

  it('stays unmuted by default', () => {
    expect(parseVideo('https://vimeo.com/123456789')!.embedUrl).not.toContain('muted');
  });
});

describe('getVideoThumbnail', () => {
  it('derives a YouTube cover without a network call', async () => {
    await expect(getVideoThumbnail('https://youtu.be/dQw4w9WgXcQ')).resolves.toBe(
      'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    );
  });

  it('does not query Kinescope at build time', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(
      getVideoThumbnail('https://kinescope.io/5R3xLEV8QHLkcs4ev7hKPK'),
    ).resolves.toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});

describe('parseVideo — empty and unknown input', () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
  });

  it.each([undefined, null, '', '   '])('returns null for %p without warning', (value) => {
    expect(parseVideo(value)).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it('returns null and warns for an unsupported provider', () => {
    expect(parseVideo('https://example.com/video.mp4')).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });
});
