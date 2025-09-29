import type { APIRoute } from 'astro';
import { sanitizeHTML, sanitizeText, sanitizeURL } from '../../lib/security.js';
import {
  checkApiRateLimit,
  checkRefreshRateLimit,
  checkMCPRateLimit,
  createRateLimitResponse,
} from '../../lib/rate-limit.js';
import {
  validateBlogQuery,
  validateBlogRefresh,
  validateMCPArticle,
  type BlogPost,
  type MCPArticle,
} from '../../lib/validation.js';
import {
  createErrorResponse,
  withTimeout,
  withRetry,
  extractErrorDetails,
} from '../../lib/error-handling.js';
import type { FetchOptions, MCPDataResponse } from '../../types/api.js';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001';

// Types are now imported from validation module

// Simple fetch with timeout to avoid hanging when MCP is down
async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {},
  timeoutMs = 2000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...options, signal: controller.signal });
    return resp as Response;
  } finally {
    clearTimeout(id);
  }
}

let __lastMcpWarn = 0;

class MCPBlogService {
  private mcpAvailable: boolean = false;
  private lastHealthCheck: number = 0;
  private cachedPosts: BlogPost[] | null = null;
  private lastFetch: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes cache

  private async checkHealth(force = false): Promise<boolean> {
    const now = Date.now();
    if (!force && this.lastHealthCheck && now - this.lastHealthCheck < 30000) {
      return this.mcpAvailable;
    }

    // If pointing to localhost in a non-development environment, assume unavailable
    if (
      MCP_SERVER_URL.includes('localhost') &&
      process.env.NODE_ENV !== 'development'
    ) {
      this.mcpAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }

    try {
      const res = await this.fetchFromMCP('/health');
      const data = await res.json();
      this.mcpAvailable = Boolean(data && data.status === 'ok');
      this.lastHealthCheck = now;
      return this.mcpAvailable;
    } catch {
      this.mcpAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  public getServiceStatus() {
    return {
      mcpAvailable: this.mcpAvailable,
      lastFetch: this.lastFetch,
      lastHealthCheck: this.lastHealthCheck,
      mcpServerUrl: MCP_SERVER_URL,
    };
  }

  private async fetchFromMCP(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    const url = `${MCP_SERVER_URL}${endpoint}`;

    try {
      const response = await fetchWithTimeout(
        url,
        {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        },
        2000
      );

      if (!response.ok) {
        throw new Error(
          `MCP server responded with ${response.status}: ${response.statusText}`
        );
      }

      return response as Response;
    } catch (error) {
      // Network or timeout errors should not spam logs
      const now = Date.now();
      if (now - __lastMcpWarn > 60_000) {
        __lastMcpWarn = now;
        console.debug(`MCP request failed (suppressed): ${url}`);
      }
      throw error as Error;
    }
  }

  private convertMCPToBlogPost(mcpData: MCPDataResponse): BlogPost[] {
    // Extract articles from MCP response
    const articles: unknown[] = mcpData.articles || [];

    return articles
      .map((article, index): BlogPost | null => {
        // Narrow unknown to object shape safely
        const base: Record<string, any> =
          typeof article === 'object' && article !== null ? (article as Record<string, any>) : {};

        // Validate the MCP article structure
        const validation = validateMCPArticle({
          ...base,
          id: base.id || base.guid || `${base.slug || 'article'}-${index}`,
        });

        if (!validation.success) {
          console.warn(
            'Invalid MCP article structure:',
            validation.error.errors
          );
          // Skip invalid articles
          return null;
        }

        const validatedArticle = validation.data;

        // Sanitize all content before processing
        const sanitizedTitle = sanitizeText(validatedArticle.title);
        const sanitizedDescription = sanitizeText(
          validatedArticle.summary || validatedArticle.description
        );
        const sanitizedContent = sanitizeHTML(validatedArticle.content);
        const sanitizedSource = sanitizeText(validatedArticle.source);
        const sanitizedCanonicalUrl = sanitizeURL(validatedArticle.link);
        const sanitizedCover = validatedArticle.cover
          ? sanitizeURL(validatedArticle.cover)
          : undefined;
        const sanitizedCoverAlt = validatedArticle.coverAlt
          ? sanitizeText(validatedArticle.coverAlt)
          : undefined;
        const sanitizedTags = validatedArticle.tags
          .map((tag) => sanitizeText(tag))
          .filter((tag) => tag.length > 0);

        return {
          id: validatedArticle.id,
          slug: validatedArticle.slug,
          data: {
            title: sanitizedTitle,
            description: sanitizedDescription,
            pubDate: new Date(validatedArticle.pubDate),
            updatedDate: new Date(validatedArticle.pubDate),
            tags: sanitizedTags,
            source: sanitizedSource,
            canonicalUrl: sanitizedCanonicalUrl || validatedArticle.link,
            ...(sanitizedCover ? { cover: sanitizedCover } : {}),
            ...(sanitizedCoverAlt ? { coverAlt: sanitizedCoverAlt } : {}),
            ...(validatedArticle.coverGenerated !== undefined
              ? { coverGenerated: validatedArticle.coverGenerated }
              : {}),
            draft: false,
          },
          body: sanitizedContent,
        };
      })
      .filter((post): post is BlogPost => post !== null);
  }

  async getPosts(forceRefresh: boolean = false): Promise<BlogPost[]> {
    const now = Date.now();

    // Return cached posts if they're still fresh and not forcing refresh
    if (
      !forceRefresh &&
      this.cachedPosts &&
      now - this.lastFetch < this.cacheTimeout
    ) {
      return this.cachedPosts;
    }

    try {
      // Check if MCP server is available with timeout
      const healthy = await Promise.race([
        this.checkHealth(true),
        new Promise<boolean>((_, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), 5000)
        ),
      ]);

      if (!healthy) {
        console.warn('MCP server not healthy, returning cached posts');
        return this.cachedPosts || [];
      }

      // Fetch fresh articles from RSS feeds with proper error handling
      let fetchResult: unknown;
      try {
        const fetchResponse = await Promise.race([
          this.fetchFromMCP('/api/articles/fetch', {
            method: 'POST',
            body: JSON.stringify({
              sinceDays: 30, // Get articles from last 30 days
              limit: 50, // Limit to 50 articles
            }),
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Fetch timeout')), 10000)
          ),
        ]);
        fetchResult = await fetchResponse.json();
        console.log('MCP fetch result:', fetchResult);
      } catch (fetchError) {
        console.warn(
          'Failed to fetch new articles, using existing cache:',
          fetchError
        );
      }

      // Get the stored articles from the MCP server
      const articlesResponse = await Promise.race([
        this.fetchFromMCP('/api/articles?limit=50'),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Articles fetch timeout')), 5000)
        ),
      ]);
      const articlesData = await articlesResponse.json();

      if (articlesData.articles && articlesData.articles.length > 0) {
        // Convert stored articles to blog post format
        const storedArticles: MCPArticle[] = articlesData.articles.map(
          (article: unknown) => {
            const articleData = article as Record<string, unknown>;
            return {
              id: (articleData.id as string) || (articleData.guid as string),
              title: articleData.title as string,
              description: articleData.description as string,
              link: articleData.link as string,
              pubDate: new Date(articleData.pubDate as string),
              content: articleData.content as string,
              source: articleData.source as string,
              slug: articleData.slug as string,
              tags: (articleData.tags as string[]) || [],
              summary: (articleData.summary as string) || '',
              cover: articleData.cover as string | undefined,
              coverAlt: articleData.coverAlt as string | undefined,
              coverGenerated: articleData.coverGenerated as boolean | undefined,
              guid: articleData.id as string,
            };
          }
        );

        this.cachedPosts = this.convertMCPToBlogPost({
          articles: storedArticles,
        });
      } else {
        // Fallback to empty array if no articles found
        this.cachedPosts = [];
      }

      this.lastFetch = now;
      return this.cachedPosts;
    } catch (error) {
      console.error('Failed to fetch from MCP server:', error);

      // Log specific error details for debugging
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }

      // Return empty array if no cached posts and MCP server is unavailable
      if (!this.cachedPosts) {
        console.warn('No cached posts available, returning empty array');
        return [];
      }

      // Return cached posts if MCP server is unavailable but we have cached data
      console.log(
        `Returning ${this.cachedPosts.length} cached posts due to MCP server error`
      );
      return this.cachedPosts;
    }
  }

  async getPost(slug: string): Promise<BlogPost | null> {
    const posts = await this.getPosts();
    return posts.find((post) => post.slug === slug) || null;
  }

  async getTags(): Promise<string[]> {
    const posts = await this.getPosts();
    const tagSet = new Set<string>();

    posts.forEach((post) => {
      post.data.tags.forEach((tag) => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }
}

const blogService = new MCPBlogService();

// Disable prerendering for this API route to allow access to request headers
export const prerender = false;

// Helper function to extract query parameters from headers (workaround for dev server)
function extractFromHeaders(headers: Headers, param: string): string | null {
  // This is a placeholder - in a real scenario you might implement more sophisticated parsing
  return null;
}

// GET /api/blog - List all blog posts
export const GET: APIRoute = async ({ url, request }) => {
  try {
    // Check rate limit first
    const rateLimitCheck = await checkApiRateLimit(request);
    if (!rateLimitCheck.allowed && rateLimitCheck.resetTime) {
      return createRateLimitResponse(rateLimitCheck.resetTime);
    }

    // Validate query parameters
    const queryValidation = validateBlogQuery(url.searchParams);
    if (!queryValidation.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid query parameters',
          details: queryValidation.error.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { limit, offset, tag, refresh } = queryValidation.data;
    const forceRefresh = refresh === 'true';

    let posts = await blogService.getPosts(forceRefresh);

    // Filter by tag if specified
    if (tag && tag !== 'all') {
      posts = posts.filter((post) => post.data.tags.includes(tag));
    }

    // Sort by publication date (newest first)
    posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

    // Apply pagination
    const paginatedPosts = posts.slice(offset, offset + limit);

    // Get unique tags for filtering
    const allTags = await blogService.getTags();

    // Ensure dates are properly serialized
    const serializedPosts = paginatedPosts.map((post) => ({
      ...post,
      data: {
        ...post.data,
        pubDate: post.data.pubDate.toISOString(),
        updatedDate: post.data.updatedDate.toISOString(),
      },
    }));

    return new Response(
      JSON.stringify({
        posts: serializedPosts,
        tags: allTags,
        total: posts.length,
        offset,
        limit,
        serviceStatus: blogService.getServiceStatus(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // 5 minute cache
        },
      }
    );
  } catch (error) {
    console.error('Error in GET /api/blog:', extractErrorDetails(error));
    return createErrorResponse(error, 500);
  }
};

// POST /api/blog/refresh - Force refresh blog posts from MCP server
export const POST: APIRoute = async ({ request }) => {
  try {
    // Check rate limit for refresh operations
    const rateLimitCheck = await checkRefreshRateLimit(request);
    if (!rateLimitCheck.allowed && rateLimitCheck.resetTime) {
      return createRateLimitResponse(rateLimitCheck.resetTime);
    }

    // Parse and validate request body
    const body = await request.json().catch(() => ({}));
    const validation = validateBlogRefresh(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid request body',
          details: validation.error.errors,
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const {
      action,
      sinceDays,
      limit: requestLimit,
      generateImages,
      imageStyle,
    } = validation.data;

    if (action === 'refresh') {
      const posts = await blogService.getPosts(true);

      return new Response(
        JSON.stringify({
          message: 'Blog posts refreshed successfully',
          count: posts.length,
          posts,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (action === 'fetch_and_generate') {
      // Check additional rate limit for MCP operations
      const mcpRateLimitCheck = await checkMCPRateLimit(request);
      if (!mcpRateLimitCheck.allowed && mcpRateLimitCheck.resetTime) {
        return createRateLimitResponse(mcpRateLimitCheck.resetTime);
      }

      // Trigger the full MCP workflow if available
      try {
        const healthy =
          (await blogService['checkHealth']?.call(blogService, true)) ?? false;
        if (!healthy) {
          return new Response(
            JSON.stringify({
              error: 'MCP server unavailable',
              message: `Cannot refresh articles because MCP server at ${MCP_SERVER_URL} is not reachable.`,
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        const mcpResponse = await fetchWithTimeout(
          `${MCP_SERVER_URL}/api/articles/fetch`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sinceDays,
              limit: requestLimit,
            }),
          },
          3000
        );

        if (!mcpResponse.ok) {
          throw new Error('Failed to fetch articles from MCP');
        }

        // Generate images if requested
        if (generateImages) {
          const imageResponse = await fetchWithTimeout(
            `${MCP_SERVER_URL}/api/images/generate`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                style: imageStyle,
                regenerate: false,
              }),
            },
            3000
          );

          if (!imageResponse.ok) {
            console.warn('Image generation failed, continuing without images');
          }
        }

        const posts = await blogService.getPosts(true);

        return new Response(
          JSON.stringify({
            message: 'Articles fetched and processed successfully',
            count: posts.length,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Failed to fetch and generate articles',
            message: error instanceof Error ? error.message : 'Unknown error',
          }),
          {
            status: 503,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: 'Invalid action',
        availableActions: ['refresh', 'fetch_and_generate'],
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in POST /api/blog:', extractErrorDetails(error));
    return createErrorResponse(error, 500);
  }
};
