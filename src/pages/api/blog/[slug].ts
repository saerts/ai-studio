import type { APIRoute } from 'astro';

const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:3001';

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

// Import the blog service from the main API endpoint
// In a real application, you'd extract this to a shared service module
async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // For individual posts, we need to use the Astro site URL correctly
    // Todo: get the correct live url
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:4321'
      : 'https://ai-studio.be';

    const response = await fetch(`${baseUrl}/api/blog`);

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    const posts: BlogPost[] = data.posts || [];

    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Failed to fetch post by slug:', error);
    return null;
  }
}

// GET /api/blog/[slug] - Get a single blog post by slug
export const GET: APIRoute = async ({ params, request }) => {
  try {
    const { slug } = params;

    if (!slug) {
      return new Response(JSON.stringify({
        error: 'Slug parameter is required',
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const post = await getPostBySlug(slug);

    if (!post) {
      return new Response(JSON.stringify({
        error: 'Post not found',
        slug,
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({
      post,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=600', // 10 minute cache for individual posts
      },
    });

  } catch (error) {
    console.error(`Error in GET /api/blog/${params.slug}:`, error);

    return new Response(JSON.stringify({
      error: 'Failed to fetch blog post',
      message: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export function getStaticPaths() {
  // For static generation, we'll return an empty array
  // This means all routes will be generated on-demand
  return [];
}
