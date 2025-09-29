/* empty css                                             */
import { c as createComponent, d as createAstro, r as renderComponent, a as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DtB_0che.mjs';
import { $ as $$Section } from '../chunks/Section_Ci-pej19.mjs';
import { $ as $$Card } from '../chunks/Card_EY_JFMb7.mjs';
import { f as formatDate } from '../chunks/utils_BQgq2xrV.mjs';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Nieuws = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Nieuws;
  const seoProps = {
    title: "Nieuws",
    description: "Blijf op de hoogte van de laatste ontwikkelingen op het gebied van AI en automatisering.",
    canonical: "https://ai-studio44.com/news"
  };
  let allPosts = [];
  let allTags = [];
  let errorMessage = "";
  try {
    const base = Astro2.site || "http://localhost:4321";
    const baseStr = typeof base === "string" ? base : base.toString();
    const normalizedBase = baseStr.replace("ai-studio44.be", "ai-studio44.com");
    const apiUrl = new URL("/api/blog", normalizedBase);
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    allPosts = (data.posts || []).map((post) => {
      const blogPost = post;
      return {
        ...blogPost,
        data: {
          ...blogPost.data,
          pubDate: new Date(blogPost.data.pubDate),
          updatedDate: new Date(blogPost.data.updatedDate)
        }
      };
    });
    allTags = data.tags || [];
  } catch (error) {
    console.warn(
      "Failed to fetch from MCP API, falling back to static content:",
      error
    );
    try {
      const { getCollection } = await import('../chunks/_astro_content_D_RE6j3Y.mjs');
      const staticPosts = await getCollection("blog", ({ data }) => !data.draft);
      allPosts = staticPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        data: {
          ...post.data,
          // Ensure updatedDate exists as required by BlogPost type
          updatedDate: post.data.updatedDate ?? post.data.pubDate
        },
        body: ""
        // Body would be rendered separately for static posts
      }));
      allTags = [
        ...new Set(staticPosts.flatMap((post) => post.data.tags))
      ].sort();
    } catch (staticError) {
      console.error("Failed to load static content as fallback:", staticError);
      allPosts = [];
      allTags = [];
      errorMessage = "Unable to load blog posts from both MCP API and static content";
    }
  }
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime();
  });
  const postsPerPage = 12;
  const currentPage = 1;
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const paginatedPosts = sortedPosts.slice(0, postsPerPage);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seoProps, "data-astro-cid-qfvzfd2k": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Section", $$Section, { "class": "scroll-animate", "data-astro-cid-qfvzfd2k": true }, { "default": async ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="text-center" data-astro-cid-qfvzfd2k> <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl gradient-text" data-astro-cid-qfvzfd2k>
Nieuws
</h1> <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300" data-astro-cid-qfvzfd2k>
Blijf op de hoogte van de laatste ontwikkelingen op het gebied van AI en
        automatisering. Praktische tips, case studies en inzichten van experts.
</p>  <div class="mt-4 flex justify-center" data-astro-cid-qfvzfd2k> <div class="glass-card px-4 py-2 text-sm" data-astro-cid-qfvzfd2k> ${errorMessage ? renderTemplate`<div class="text-amber-400 flex items-center gap-2" data-astro-cid-qfvzfd2k> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qfvzfd2k> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" data-astro-cid-qfvzfd2k></path> </svg>
Fallback mode (static content)
</div>` : renderTemplate`<div class="text-teal-400 flex items-center gap-2" data-astro-cid-qfvzfd2k> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qfvzfd2k> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-qfvzfd2k></path> </svg>
Live content from MCP API
</div>`} <div class="mt-1 text-xs text-zinc-400" data-astro-cid-qfvzfd2k> ${paginatedPosts.length} artikel${paginatedPosts.length !== 1 ? "en" : ""} geladen
</div> </div> </div>  <div class="mt-4" data-astro-cid-qfvzfd2k> <button id="refresh-posts" class="glass-card px-4 py-2 text-sm font-medium text-white/80 transition-all hover:text-teal-400 hover:border-teal-400/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2" data-astro-cid-qfvzfd2k> <svg class="inline-block h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qfvzfd2k> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-astro-cid-qfvzfd2k></path> </svg>
Vernieuw artikelen
</button> </div> </div> ${allTags.length > 0 && renderTemplate`<div class="mt-12" data-astro-cid-qfvzfd2k> <h2 class="sr-only" data-astro-cid-qfvzfd2k>Filter op tags</h2> <div class="flex flex-wrap justify-center gap-2" data-astro-cid-qfvzfd2k> <button class="filter-tag glass-card px-4 py-2 text-sm font-medium text-white/80 transition-all hover:text-primary-400 hover:border-primary-400/30 data-[active]:bg-primary-400/20 data-[active]:text-primary-400 data-[active]:border-primary-400" data-tag="all" data-active="true" data-astro-cid-qfvzfd2k>
Alle artikelen
</button> ${allTags.map((tag) => renderTemplate`<button class="filter-tag glass-card px-4 py-2 text-sm font-medium text-white/80 transition-all hover:text-primary-400 hover:border-primary-400/30 data-[active]:bg-primary-400/20 data-[active]:text-primary-400 data-[active]:border-primary-400"${addAttribute(tag, "data-tag")} data-astro-cid-qfvzfd2k> ${tag} </button>`)} </div> </div>`} <div class="mt-8" data-astro-cid-qfvzfd2k> <div class="mx-auto max-w-md" data-astro-cid-qfvzfd2k> <label for="search" class="sr-only" data-astro-cid-qfvzfd2k>Zoek artikelen</label> <div class="relative" data-astro-cid-qfvzfd2k> <input type="text" id="search" placeholder="Zoek artikelen..." class="form-input pl-10" data-astro-cid-qfvzfd2k> <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" data-astro-cid-qfvzfd2k> <svg class="h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-qfvzfd2k> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-qfvzfd2k></path> </svg> </div> </div> </div> </div> ` })} ${renderComponent($$result2, "Section", $$Section, { "class": "pt-0 scroll-animate-fade", "data-astro-cid-qfvzfd2k": true }, { "default": async ($$result3) => renderTemplate` <div id="posts-container" data-astro-cid-qfvzfd2k> ${paginatedPosts.length === 0 ? renderTemplate`<div class="text-center py-12" data-astro-cid-qfvzfd2k> <p class="text-zinc-400" data-astro-cid-qfvzfd2k>
Nog geen artikelen beschikbaar. Check binnenkort terug!
</p> </div>` : renderTemplate`<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" data-astro-cid-qfvzfd2k> ${paginatedPosts.map((post) => renderTemplate`<article${addAttribute(post.data.tags.join(","), "data-tags")}${addAttribute(post.data.title.toLowerCase(), "data-title")}${addAttribute(post.data.description.toLowerCase(), "data-description")} data-astro-cid-qfvzfd2k> ${renderComponent($$result3, "Card", $$Card, { "data-astro-cid-qfvzfd2k": true }, { "default": async ($$result4) => renderTemplate` <div class="flex flex-col h-full" data-astro-cid-qfvzfd2k> <div class="flex-1" data-astro-cid-qfvzfd2k> <h2 class="text-xl font-semibold text-white" data-astro-cid-qfvzfd2k> <a${addAttribute(`/news/${post.slug}`, "href")} class="hover:text-primary-400 focus:text-primary-400 transition-colors" data-astro-cid-qfvzfd2k> ${post.data.title} </a> </h2> <p class="mt-3 text-zinc-300 line-clamp-3" data-astro-cid-qfvzfd2k> ${post.data.description} </p> ${post.data.tags.length > 0 && renderTemplate`<div class="mt-4 flex flex-wrap gap-2" data-astro-cid-qfvzfd2k> ${post.data.tags.slice(0, 3).map((tag) => renderTemplate`<span class="inline-flex items-center rounded-full bg-primary-400/20 px-2.5 py-0.5 text-xs font-medium text-primary-400" data-astro-cid-qfvzfd2k> ${tag} </span>`)} ${post.data.tags.length > 3 && renderTemplate`<span class="inline-flex items-center rounded-full bg-zinc-600/30 px-2.5 py-0.5 text-xs font-medium text-zinc-400" data-astro-cid-qfvzfd2k>
+${post.data.tags.length - 3} </span>`} </div>`} </div> <div class="mt-6 flex items-center justify-between" data-astro-cid-qfvzfd2k> <div class="flex items-center text-sm text-zinc-400" data-astro-cid-qfvzfd2k> <time${addAttribute(post.data.pubDate.toISOString(), "datetime")} data-astro-cid-qfvzfd2k> ${formatDate(post.data.pubDate)} </time> <span class="mx-2" data-astro-cid-qfvzfd2k>·</span> <span data-astro-cid-qfvzfd2k>${post.data.source}</span> </div> </div> </div> ` })} </article>`)} </div>`} <div id="no-results" class="hidden text-center py-12" data-astro-cid-qfvzfd2k> <p class="text-zinc-400" data-astro-cid-qfvzfd2k>
Geen artikelen gevonden. Probeer een andere zoekopdracht of filter.
</p> </div> </div> ${totalPages > 1 && renderTemplate`<div class="mt-12 flex justify-center" data-astro-cid-qfvzfd2k> <nav aria-label="Paginering" data-astro-cid-qfvzfd2k> <div class="flex space-x-2" data-astro-cid-qfvzfd2k> ${Array.from({ length: totalPages }, (_, i) => i + 1).map(
    (page) => renderTemplate`<a${addAttribute(page === 1 ? "/news" : `/news/page/${page}`, "href")}${addAttribute(`px-4 py-2 rounded-md text-sm font-medium transition-all ${page === currentPage ? "bg-primary-400 text-black" : "glass-card text-white/80 hover:text-primary-400 hover:border-primary-400/30"}`, "class")}${addAttribute(page === currentPage ? "page" : void 0, "aria-current")} data-astro-cid-qfvzfd2k> ${page} </a>`
  )} </div> </nav> </div>`}` })} ` })} ${renderScript($$result, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/nieuws.astro?astro&type=script&index=0&lang.ts")} `;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/nieuws.astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/nieuws.astro";
const $$url = "/nieuws";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Nieuws,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
