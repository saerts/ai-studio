/* empty css                                                */
import { c as createComponent, d as createAstro, r as renderComponent, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../../chunks/astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import { $ as $$BlogLayout, a as $$SafeHTML } from '../../chunks/SafeHTML_BBeVZF9T.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const getStaticPaths = async () => {
  const paths = [];
  try {
    const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:4321" : "https://ai-studio44.com";
    const response = await fetch(`${baseUrl}/api/blog`);
    if (response.ok) {
      const data = await response.json();
      const posts = data.posts || [];
      posts.forEach((post) => {
        const blogPost = post;
        paths.push({
          params: { slug: blogPost.slug },
          props: {
            isMCPPost: true,
            // All API posts are MCP posts
            post: {
              id: blogPost.id,
              slug: blogPost.slug,
              data: {
                title: blogPost.data.title,
                description: blogPost.data.description,
                pubDate: new Date(blogPost.data.pubDate),
                updatedDate: new Date(blogPost.data.updatedDate),
                tags: blogPost.data.tags,
                source: blogPost.data.source,
                canonicalUrl: blogPost.data.canonicalUrl,
                cover: blogPost.data.cover,
                coverAlt: blogPost.data.coverAlt,
                coverGenerated: blogPost.data.coverGenerated,
                draft: blogPost.data.draft
              },
              body: blogPost.body
            }
          }
        });
      });
    } else {
      console.warn("Could not fetch articles from API, using fallback");
    }
  } catch (error) {
    console.warn("Error fetching articles for static paths:", error);
  }
  if (paths.length === 0) {
    console.log("No articles found, pages will be rendered on-demand");
  }
  try {
    const { getCollection } = await import('../../chunks/_astro_content_D_RE6j3Y.mjs');
    const staticPosts = await getCollection("blog", ({ data }) => {
      return !data.draft;
    });
    staticPosts.forEach((post) => {
      paths.push({
        params: { slug: post.slug },
        props: {
          isMCPPost: false,
          post
        }
      });
    });
  } catch (error) {
    console.warn("Could not load static posts:", error);
  }
  return paths;
};
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { post, isMCPPost } = Astro2.props;
  let Content = null;
  if (!isMCPPost && post && "render" in post) {
    try {
      const astroPost = post;
      const rendered = await astroPost.render();
      Content = rendered.Content;
    } catch (error) {
      console.error("Failed to render static post content:", error);
    }
  }
  const DynamicContent = Content;
  return renderTemplate`${renderComponent($$result, "BlogLayout", $$BlogLayout, { "post": post, "isMCPPost": isMCPPost, "basePath": "/news" }, { "default": async ($$result2) => renderTemplate`${isMCPPost ? renderTemplate`${maybeRenderHead()}<div class="prose prose-invert prose-lg max-w-none"> ${renderComponent($$result2, "SafeHTML", $$SafeHTML, { "content": post.body || `
          <p>This article was automatically imported from <a href="${post.data.canonicalUrl}" class="text-teal-400 hover:text-teal-300 underline" target="_blank" rel="noopener">${post.data.source}</a>.</p>
          <p>Click the link above to read the full article on the original source.</p>
        `, "class": "text-zinc-300 leading-relaxed space-y-6" })}  <div class="mt-12 p-6 rounded-lg bg-zinc-800/30 border border-zinc-700/50"> <div class="flex items-start gap-4"> <div class="flex-shrink-0"> <svg class="h-6 w-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path> </svg> </div> <div class="flex-1"> <h3 class="font-semibold text-white mb-2">Bron</h3> <p class="text-zinc-400 mb-3">
Dit artikel werd automatisch geïmporteerd uit ${post.data.source}
. Voor de volledige inhoud en eventuele updates, bezoek het
                originele artikel.
</p> <a${addAttribute(String(post.data.canonicalUrl || ""), "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-medium transition-colors">
Lees het volledige artikel
<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path> </svg> </a> </div> </div> </div> </div>` : renderTemplate`<div>${DynamicContent ? renderTemplate`${renderComponent($$result2, "DynamicContent", DynamicContent, {})}` : null}</div>`}` })}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/nieuws/[slug].astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/nieuws/[slug].astro";
const $$url = "/nieuws/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
