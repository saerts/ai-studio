import { d as createAstro, c as createComponent, r as renderComponent, b as renderTemplate, f as renderSlot, e as addAttribute, m as maybeRenderHead, u as unescapeHTML } from './astro/server_X5whkWjU.mjs';
import 'kleur/colors';
import { b as articleSchema, c as breadcrumbsSchema, $ as $$BaseLayout, a as $$Button } from './BaseLayout_Dm3TLDtu.mjs';
import 'clsx';
import { a as sanitizeHTML } from './security_DM2jXN_m.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://ai-studio44.com");
const $$BlogLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { post, isMCPPost = false, basePath = "/blog" } = Astro2.props;
  const { title, description, pubDate, updatedDate, tags, source, canonicalUrl } = post.data;
  const seoProps = {
    title,
    description,
    canonical: `https://ai-studio44.com${basePath}/${post.slug}`,
    type: "article"
  };
  const schema = articleSchema(
    title,
    description,
    seoProps.canonical,
    pubDate.toISOString(),
    updatedDate?.toISOString()
  );
  const breadcrumbs = breadcrumbsSchema([
    { name: "Home", url: "/" },
    { name: "Nieuws", url: basePath },
    { name: title, url: `${basePath}/${post.slug}` }
  ]);
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("nl-BE", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seoProps }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">', '<\/script> <script type="application/ld+json">', "<\/script> ", '<article class="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"> <!-- Breadcrumbs --> <nav aria-label="Breadcrumb" class="mb-8"> <ol class="flex items-center space-x-2 text-sm text-zinc-400"> <li> <a href="/" class="hover:text-teal-400 transition-colors">Home</a> </li> <li> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"></path> </svg> </li> <li> <a', ' class="hover:text-teal-400 transition-colors">Nieuws</a> </li> <li> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"></path> </svg> </li> <li aria-current="page" class="text-zinc-300"> ', ' </li> </ol> </nav> <header class="mb-8"> <h1 class="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl gradient-text"> ', ' </h1> <div class="flex flex-wrap items-center gap-4 text-sm text-zinc-400"> <div class="flex items-center gap-2"> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path> </svg> <time', "> ", " </time> </div> ", " ", " </div> ", " ", ' </header> <div class="prose prose-lg max-w-none dark:prose-invert"> ', ' </div> <footer class="mt-12 border-t border-zinc-700 pt-8"> <div class="flex flex-col sm:flex-row items-center justify-between gap-4"> ', " ", " </div> </footer> </article> "])), unescapeHTML(JSON.stringify(schema)), unescapeHTML(JSON.stringify(breadcrumbs)), maybeRenderHead(), addAttribute(basePath, "href"), title, title, addAttribute(pubDate.toISOString(), "datetime"), formatDate(pubDate), updatedDate && renderTemplate`<div class="flex items-center gap-2"> <span aria-hidden="true">·</span> <span>
Bijgewerkt op${" "} <time${addAttribute(updatedDate.toISOString(), "datetime")}> ${formatDate(updatedDate)} </time> </span> </div>`, source && renderTemplate`<div class="flex items-center gap-2"> <span aria-hidden="true">·</span> <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path> </svg> <span>${source}</span> </div>`, tags.length > 0 && renderTemplate`<div class="mt-4 flex flex-wrap gap-2"> ${tags.map((tag) => renderTemplate`<span class="inline-flex items-center rounded-full bg-teal-400/20 px-3 py-1 text-xs font-medium text-teal-400"> ${tag} </span>`)} </div>`, isMCPPost && renderTemplate`<div class="mt-4 flex justify-start"> <div class="glass-card px-3 py-1 text-xs text-teal-400 flex items-center gap-2"> <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path> </svg>
Live content van MCP API
</div> </div>`, renderSlot($$result2, $$slots["default"]), canonicalUrl && renderTemplate`${renderComponent($$result2, "Button", $$Button, { "href": canonicalUrl, "variant": "secondary", "size": "sm", "target": "_blank" }, { "default": ($$result3) => renderTemplate`
Lees origineel artikel
` })}`, (() => {
    const backLabel = basePath === "/news" ? "Terug naar nieuws" : "Terug naar blog";
    return renderTemplate`${renderComponent($$result2, "Button", $$Button, { "href": basePath, "variant": "primary", "size": "sm" }, { "default": ($$result3) => renderTemplate`${backLabel}` })}`;
  })()) })}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/layout/BlogLayout.astro", void 0);

const $$Astro = createAstro("https://ai-studio44.com");
const $$SafeHTML = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SafeHTML;
  const { content, class: className = "" } = Astro2.props;
  const sanitizedContent = sanitizeHTML(content || "");
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(className, "class")}>${unescapeHTML(sanitizedContent)}</div>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/SafeHTML.astro", void 0);

export { $$BlogLayout as $, $$SafeHTML as a };
