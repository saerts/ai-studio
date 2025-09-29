import { c as createComponent, d as createAstro, m as maybeRenderHead, e as addAttribute, f as renderSlot, b as renderTemplate } from './astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$Section = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Section;
  const {
    class: className = "",
    id,
    "aria-labelledby": ariaLabelledBy
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`py-12 sm:py-16 lg:py-20 ${className}`, "class")}${addAttribute(id, "id")}${addAttribute(ariaLabelledBy, "aria-labelledby")}> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> ${renderSlot($$result, $$slots["default"])} </div> </section>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/ui/Section.astro", void 0);

export { $$Section as $ };
