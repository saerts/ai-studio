/**
 * Type definitions for API requests and responses
 */

// HTTP Request options
export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

// API Response interfaces
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface BlogApiResponse {
  posts: unknown[];
  tags: string[];
  total: number;
  offset: number;
  limit: number;
  serviceStatus?: {
    mcpAvailable: boolean;
    lastFetch: number;
    lastHealthCheck: number;
    mcpServerUrl: string;
  };
}

// Static path generation
export interface StaticPath {
  params: { slug: string };
  props: {
    isStaticPost: boolean;
    post: unknown;
  };
}

// Astro content types
export interface AstroContent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(): Promise<{ Content: any }>;
}

export interface AstroCollectionEntry {
  id: string;
  slug: string;
  data: Record<string, unknown>;
  body?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: () => Promise<{ Content: any }>;
}

// Rate limiter result
export interface RateLimiterResult {
  totalHits?: number;
  totalTime?: number;
  remainingPoints?: number;
  msBeforeNext?: number;
}
