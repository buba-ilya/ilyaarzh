import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    /** Short caption on the tile, uppercase: 'PROJECT 01'. */
    title: z.string(),
    /** Full name, used for <title> and alt text. */
    fullTitle: z.string().optional(),
    /** Ascending order on the home page. */
    order: z.number(),
    /** 16:9 preview. Empty -> the first video's cover, then SOON. */
    thumbnail: z.string().optional(),
    /** Which part of the preview survives the 16:9 crop, e.g. 'center 75%'. */
    thumbnailPosition: z.string().optional(),
    videos: z
      .array(
        z.object({
          url: z.string().optional(),
          cover: z.string().optional(),
          title: z.string().optional(),
          /** Player shape, e.g. '16/9'. Defaults to 16/9 when omitted. */
          ratio: z.string().optional(),
        }),
      )
      .default([]),
    /** Up to 6 stills, 16:9. An empty string renders SOON. */
    stills: z.array(z.string()).default([]),
    /** Keep every still in a single row at all screen sizes (e.g. vertical frames). */
    stillsInRow: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = { projects };
