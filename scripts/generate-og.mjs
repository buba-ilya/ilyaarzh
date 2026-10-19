// Generates public/og-default.jpg — the 1200x630 picture shown when the home page,
// ABOUT or any page without its own cover is shared in Telegram, Instagram, etc.
// Run with: npm run og
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public', 'og-default.jpg');

// The frame to use, relative to src/assets, and which part survives the crop
// (0 = top edge, 1 = bottom edge).
const source = 'projects/about our love/still-2.jpg';
const focusY = 0;

const W = 1200;
const H = 630;

const input = path.join(root, 'src', 'assets', source);
const { width, height } = await sharp(input).metadata();
const cropH = Math.round((width * H) / W);
const top = Math.round((height - cropH) * focusY);

await sharp(input)
  .extract({ left: 0, top, width, height: cropH })
  .resize(W, H)
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(out);

console.log(`Wrote ${out} from ${source}`);
