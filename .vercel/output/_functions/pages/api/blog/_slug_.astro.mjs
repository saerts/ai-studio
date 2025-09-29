export { renderers } from '../../../renderers.mjs';

process.env.MCP_SERVER_URL || "http://localhost:3001";
async function getPostBySlug(slug) {
  try {
    const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:4321" : "https://ai-studio44.com";
    const response = await fetch(`${baseUrl}/api/blog`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const data = await response.json();
    const posts = data.posts || [];
    return posts.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.error("Failed to fetch post by slug:", error);
    return null;
  }
}
const GET = async ({ params, request }) => {
  try {
    const { slug } = params;
    if (!slug) {
      return new Response(
        JSON.stringify({
          error: "Slug parameter is required"
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    const post = await getPostBySlug(slug);
    if (!post) {
      return new Response(
        JSON.stringify({
          error: "Post not found",
          slug
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
    return new Response(
      JSON.stringify({
        post
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=600"
          // 10 minute cache for individual posts
        }
      }
    );
  } catch (error) {
    console.error(`Error in GET /api/blog/${params.slug}:`, error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch blog post",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
function getStaticPaths() {
  return [];
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  getStaticPaths
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
