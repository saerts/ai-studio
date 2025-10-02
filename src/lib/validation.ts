import { z } from 'zod';

// Blog API query parameters validation
export const blogQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  tag: z.string().optional(),
  refresh: z.enum(['true', 'false']).optional(),
});

// Blog refresh action validation
export const blogRefreshSchema = z.object({
  action: z.enum(['refresh', 'fetch_and_generate']),
  sinceDays: z.number().min(1).max(90).optional().default(7),
  limit: z.number().min(1).max(100).optional().default(50),
  generateImages: z.boolean().optional().default(false),
  imageStyle: z.string().optional().default('corporate'),
});

// Blog post data validation
export const blogPostDataSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(1000),
  pubDate: z.date(),
  updatedDate: z.date(),
  tags: z.array(z.string()).default([]),
  source: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  cover: z.string().url().optional(),
  coverAlt: z.string().max(200).optional(),
  coverGenerated: z.boolean().optional(),
  draft: z.boolean().default(false),
});

// Blog post validation
export const blogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  data: blogPostDataSchema,
  body: z.string(),
});

// Validation helper functions
export function validateBlogQuery(searchParams: URLSearchParams) {
  const params = Object.fromEntries(searchParams.entries());
  return blogQuerySchema.safeParse(params);
}

export function validateBlogRefresh(body: unknown) {
  return blogRefreshSchema.safeParse(body);
}

export function validateBlogPost(post: unknown) {
  return blogPostSchema.safeParse(post);
}

// Type exports for TypeScript usage
export type BlogQuery = z.infer<typeof blogQuerySchema>;
export type BlogRefresh = z.infer<typeof blogRefreshSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostData = z.infer<typeof blogPostDataSchema>;
