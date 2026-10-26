import type { ImageMetadata } from 'astro';

// Local files dropped into src/assets get the full astro:assets treatment.
const assets = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,webp,avif,gif}',
  { eager: true },
);

/** Looks up a content path such as 'projects/slug/still-1.jpg' in src/assets. */
export function resolveAsset(src?: string): ImageMetadata | undefined {
  const trimmed = src?.trim();
  if (!trimmed) return undefined;
  const key = `/src/assets/${trimmed.replace(/^\/?(src\/assets\/)?/, '')}`;
  return assets[key]?.default;
}

/** Every image in src/assets/<folder>/ (subfolders included), as content paths sorted by name. */
export function assetsIn(folder: string): string[] {
  const prefix = `/src/assets/${folder.replace(/^\/|\/$/g, '')}/`;
  return Object.keys(assets)
    .filter((key) => key.startsWith(prefix))
    .map((key) => key.slice('/src/assets/'.length))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Link target for a still. The lightbox intercepts the click, so this only matters
 * for middle-click, "open in new tab" and browsing without JavaScript — but it has to
 * be a real URL, not the raw content path, which would resolve against the page.
 */
export function mediaHref(src?: string): string {
  const trimmed = src?.trim();
  if (!trimmed) return '#';
  return resolveAsset(trimmed)?.src ?? trimmed;
}
