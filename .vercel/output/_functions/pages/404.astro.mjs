/* empty css                                             */
import { c as createComponent, r as renderComponent, a as renderScript, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Button } from '../chunks/BaseLayout_DtB_0che.mjs';
import { $ as $$Section } from '../chunks/Section_Ci-pej19.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  const seoProps = {
    title: "Pagina niet gevonden",
    description: "De pagina die je zoekt bestaat niet of is verplaatst.",
    canonical: "https://ai-studio44.com/404",
    noindex: true
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seoProps }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Section", $$Section, { "class": "text-center scroll-animate" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-md"> <!-- 404 Animation/Icon --> <div class="mx-auto h-32 w-32 text-primary-400" aria-hidden="true"> <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="h-full w-full"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.928.735-5.344 1.958M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"></path> </svg> </div> <h1 class="mt-8 text-6xl font-bold text-white gradient-text">404</h1> <h2 class="mt-4 text-2xl font-semibold text-white">
Pagina niet gevonden
</h2> <p class="mt-4 text-zinc-300">
Sorry, de pagina die je zoekt bestaat niet of is verplaatst. Misschien
        kunnen onderstaande links je helpen.
</p> <div class="mt-8 space-y-4"> <div class="flex flex-col gap-4 sm:flex-row sm:justify-center"> ${renderComponent($$result3, "Button", $$Button, { "href": "/", "variant": "primary" }, { "default": ($$result4) => renderTemplate` Ga naar home ` })} ${renderComponent($$result3, "Button", $$Button, { "href": "/diensten", "variant": "secondary" }, { "default": ($$result4) => renderTemplate`
Bekijk onze diensten
` })} </div> <div class="flex flex-col gap-4 sm:flex-row sm:justify-center"> ${renderComponent($$result3, "Button", $$Button, { "href": "/news", "variant": "secondary" }, { "default": ($$result4) => renderTemplate` Lees ons nieuws ` })} ${renderComponent($$result3, "Button", $$Button, { "href": "/contact", "variant": "secondary" }, { "default": ($$result4) => renderTemplate` Neem contact op ` })} </div> </div> <!-- Search functionality could be added here --> <div class="mt-12"> <p class="text-sm text-zinc-400">
Heb je een vraag?
<a href="/contact" class="text-primary-400 hover:text-primary-300 transition-colors">
Neem contact met ons op
</a> </p> </div> </div> ` })} ` })} ${renderScript($$result, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/404.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/404.astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
