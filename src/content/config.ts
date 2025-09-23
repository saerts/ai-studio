import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    source: z.string(),
    canonicalUrl: z.string().url(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverGenerated: z.boolean().default(false),
    coverPrompt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
};