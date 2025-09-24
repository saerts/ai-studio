import type { APIRoute } from 'astro';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001';

interface MCPArticle {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  content: string;
  source: string;
  guid?: string;
  slug: string;
  tags: string[];
  summary: string;
  cover?: string;
  coverAlt?: string;
  coverGenerated?: boolean;
}

interface BlogPost {
  id: string;
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate: Date;
    tags: string[];
    source: string;
    canonicalUrl: string;
    cover?: string;
    coverAlt?: string;
    coverGenerated?: boolean;
    draft: boolean;
  };
  body: string;
}

class MCPBlogService {
  private cachedPosts: BlogPost[] | null = null;
  private lastFetch: number = 0;
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes cache

  private async fetchFromMCP(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${MCP_SERVER_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`MCP server responded with ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error(`Failed to fetch from MCP server ${url}:`, error);
      throw error;
    }
  }

  private convertMCPToBlogPost(mcpData: any): BlogPost[] {
    // Extract articles from MCP response
    const articles: MCPArticle[] = mcpData.articles || [];

    return articles.map((article, index) => ({
      id: article.guid || `${article.slug}-${index}`,
      slug: article.slug,
      data: {
        title: article.title,
        description: article.summary || article.description,
        pubDate: new Date(article.pubDate),
        updatedDate: new Date(article.pubDate),
        tags: article.tags,
        source: article.source,
        canonicalUrl: article.link,
        cover: article.cover,
        coverAlt: article.coverAlt,
        coverGenerated: article.coverGenerated,
        draft: false,
      },
      body: article.content || '',
    }));
  }

  async getPosts(forceRefresh: boolean = false): Promise<BlogPost[]> {
    const now = Date.now();

    // Return cached posts if they're still fresh and not forcing refresh
    if (!forceRefresh && this.cachedPosts && (now - this.lastFetch) < this.cacheTimeout) {
      return this.cachedPosts;
    }

    try {
      // Check if MCP server is available
      const healthCheck = await this.fetchFromMCP('/health');
      const healthData = await healthCheck.json();

      if (!healthData.mcp_connected) {
        throw new Error('MCP server is not connected to MCP backend');
      }

      // Fetch fresh articles from RSS feeds
      const fetchResponse = await this.fetchFromMCP('/api/articles/fetch', {
        method: 'POST',
        body: JSON.stringify({
          sinceDays: 30, // Get articles from last 30 days
          limit: 50,     // Limit to 50 articles
        }),
      });

      const fetchResult = await fetchResponse.json();
      console.log('MCP fetch result:', fetchResult);

      // Get the stored articles from the MCP server
      const articlesResponse = await this.fetchFromMCP('/api/articles?limit=50');
      const articlesData = await articlesResponse.json();

      if (articlesData.articles && articlesData.articles.length > 0) {
        // Convert stored articles to blog post format
        const storedArticles: MCPArticle[] = articlesData.articles.map((article: any) => ({
          title: article.title,
          description: article.description,
          link: article.link,
          pubDate: new Date(article.pubDate),
          content: article.content,
          source: article.source,
          slug: article.slug,
          tags: article.tags,
          summary: article.summary,
          cover: article.cover,
          coverAlt: article.coverAlt,
          coverGenerated: article.coverGenerated,
          guid: article.id,
        }));

        this.cachedPosts = this.convertMCPToBlogPost({ articles: storedArticles });
      } else {
        // Fallback to empty array if no articles found
        this.cachedPosts = [];
      }

      this.lastFetch = now;
      return this.cachedPosts;

    } catch (error) {
      console.error('Failed to fetch from MCP server:', error);

      // Return empty array if no cached posts and MCP server is unavailable
      if (!this.cachedPosts) {
        return [];
      }

      // Return cached posts if MCP server is unavailable but we have cached data
      return this.cachedPosts;
    }
  }

  async getPost(slug: string): Promise<BlogPost | null> {
    const posts = await this.getPosts();
    return posts.find(post => post.slug === slug) || null;
  }

  async getTags(): Promise<string[]> {
    const posts = await this.getPosts();
    const tagSet = new Set<string>();

    posts.forEach(post => {
      post.data.tags.forEach(tag => tagSet.add(tag));
    });

    return Array.from(tagSet).sort();
  }
}

const blogService = new MCPBlogService();

// Helper function to extract query parameters from headers (workaround for dev server)
function extractFromHeaders(headers: Headers, param: string): string | null {
  // This is a placeholder - in a real scenario you might implement more sophisticated parsing
  return null;
}

// GET /api/blog - List all blog posts
export const GET: APIRoute = async ({ url, request }) => {
  try {
    const searchParams = url.searchParams;
    const forceRefresh = searchParams.get('refresh') === 'true';
    const tag = searchParams.get('tag');

    // Parse query parameters with fallback for dev server issue
    let limit = 50;
    let offset = 0;

    // Try multiple methods to get query parameters
    const limitParam = searchParams.get('limit') || extractFromHeaders(request.headers, 'limit');
    const offsetParam = searchParams.get('offset') || extractFromHeaders(request.headers, 'offset');

    if (limitParam) limit = Math.max(1, Math.min(100, parseInt(limitParam))); // Limit between 1-100
    if (offsetParam) offset = Math.max(0, parseInt(offsetParam)); // Offset >= 0

    let posts = await blogService.getPosts(forceRefresh);

    // Filter by tag if specified
    if (tag && tag !== 'all') {
      posts = posts.filter(post => post.data.tags.includes(tag));
    }

    // Sort by publication date (newest first)
    posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

    // Apply pagination
    const paginatedPosts = posts.slice(offset, offset + limit);

    // Get unique tags for filtering
    const allTags = await blogService.getTags();

    // Ensure dates are properly serialized
    const serializedPosts = paginatedPosts.map(post => ({
      ...post,
      data: {
        ...post.data,
        pubDate: post.data.pubDate.toISOString(),
        updatedDate: post.data.updatedDate.toISOString(),
      }
    }));

    return new Response(JSON.stringify({
      posts: serializedPosts,
      tags: allTags,
      total: posts.length,
      offset,
      limit,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // 5 minute cache
      },
    });
  } catch (error) {
    console.error('Error in GET /api/blog:', error);

    return new Response(JSON.stringify({
      error: 'Failed to fetch blog posts',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

// POST /api/blog/refresh - Force refresh blog posts from MCP server
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action;

    if (action === 'refresh') {
      const posts = await blogService.getPosts(true);

      return new Response(JSON.stringify({
        message: 'Blog posts refreshed successfully',
        count: posts.length,
        posts,
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (action === 'fetch_and_generate') {
      // This would trigger the full MCP workflow
      try {
        const mcpResponse = await fetch(`${MCP_SERVER_URL}/api/articles/fetch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sinceDays: body.sinceDays || 7,
            limit: body.limit || 50,
          }),
        });

        if (!mcpResponse.ok) {
          throw new Error('Failed to fetch articles from MCP');
        }

        // Generate images if requested
        if (body.generateImages) {
          const imageResponse = await fetch(`${MCP_SERVER_URL}/api/images/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              style: body.imageStyle || 'corporate',
              regenerate: false,
            }),
          });

          if (!imageResponse.ok) {
            console.warn('Image generation failed, continuing without images');
          }
        }

        const posts = await blogService.getPosts(true);

        return new Response(JSON.stringify({
          message: 'Articles fetched and processed successfully',
          count: posts.length,
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        });

      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Failed to fetch and generate articles',
          message: error instanceof Error ? error.message : 'Unknown error',
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    }

    return new Response(JSON.stringify({
      error: 'Invalid action',
      availableActions: ['refresh', 'fetch_and_generate'],
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in POST /api/blog:', error);

    return new Response(JSON.stringify({
      error: 'Failed to process blog request',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};