import { c as createComponent, d as createAstro, m as maybeRenderHead, e as addAttribute, f as renderSlot, b as renderTemplate } from './astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro();
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Card;
  const { class: className = "" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`glass-card p-6 ${className}`, "class")}> ${renderSlot($$result, $$slots["default"])} </div>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/ui/Card.astro", void 0);

export { $$Card as $ };
