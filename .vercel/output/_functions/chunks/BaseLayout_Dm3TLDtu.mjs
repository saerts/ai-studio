import { d as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, b as renderTemplate, r as renderComponent, f as renderSlot, a as renderScript, g as renderHead, u as unescapeHTML } from './astro/server_X5whkWjU.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const defaultSEO = {
  title: "AI Studio — Breng AI in je dagelijkse flow",
  description: "AI Studio helpt bedrijven bij het implementeren van AI-oplossingen. Van workflow-automations tot training en coaching.",
  image: "/og-image.jpg",
  canonical: "https://ai-studio44.com",
  type: "website"
};
function getSEOProps(props = {}) {
  const {
    title = defaultSEO.title,
    description = defaultSEO.description,
    canonical = defaultSEO.canonical,
    image = defaultSEO.image,
    noindex = false,
    type = defaultSEO.type
  } = props;
  const fullTitle = title === defaultSEO.title ? title : `${title} — AI Studio`;
  return {
    title: fullTitle,
    description,
    canonical,
    image: image.startsWith("http") ? image : `https://ai-studio44.com${image}`,
    noindex,
    type
  };
}

function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AI Studio",
    url: "https://ai-studio44.com",
    logo: "https://ai-studio44.com/favicon.svg",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@ai-studio44.com"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Antwerpen",
      addressCountry: "BE"
    }
  };
}
function articleSchema(title, description, url, publishedDate, modifiedDate, image) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Organization",
      name: "AI Studio"
    },
    publisher: {
      "@type": "Organization",
      name: "AI Studio",
      logo: {
        "@type": "ImageObject",
        url: "https://ai-studio44.com/favicon.svg"
      }
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url
    },
    ...image
  };
}
function breadcrumbsSchema(segments) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: segments.map((segment, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: segment.name,
      item: `https://ai-studio44.com${segment.url}`
    }))
  };
}

const $$Astro$3 = createAstro("https://ai-studio44.com");
const $$SkipLink = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$SkipLink;
  const { href = "#main-content", text = "Spring naar hoofdinhoud" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="skip-link"> ${text} </a>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/a11y/SkipLink.astro", void 0);

const $$Astro$2 = createAstro("https://ai-studio44.com");
const $$MainNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MainNav;
  const currentPath = Astro2.url.pathname;
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/diensten", label: "Onze diensten" },
    { href: "/nieuws", label: "Nieuws" },
    { href: "/contact", label: "Contact" }
  ];
  return renderTemplate`${maybeRenderHead()}<nav role="navigation" aria-label="Hoofdnavigatie"> <ul class="flex space-x-8"> ${navItems.map(({ href, label }) => renderTemplate`<li> <a${addAttribute(href, "href")}${addAttribute(`text-sm font-medium transition-colors hover:text-primary-400 focus:text-primary-400 ${currentPath === href ? "text-primary-400 gradient-text" : "text-white/80 hover:text-white"}`, "class")}${addAttribute(currentPath === href ? "page" : void 0, "aria-current")}> ${label} </a> </li>`)} </ul> </nav>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/nav/MainNav.astro", void 0);

const $$Astro$1 = createAstro("https://ai-studio44.com");
const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "primary",
    size = "md",
    href,
    type = "button",
    disabled = false,
    class: className = ""
  } = Astro2.props;
  const Tag = href ? "a" : "button";
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary"
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].join(" ");
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "class": classes, "href": href, "type": !href ? type : void 0, "disabled": !href ? disabled : void 0, ...Astro2.props }, { "default": ($$result2) => renderTemplate` ${renderSlot($$result2, $$slots["default"])} ` })}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/ui/Button.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 backdrop-blur-strong border-b border-primary-400/20"> <!-- Advanced Background with Geometric Elements --> <div class="absolute inset-0 bg-dark-900/80"></div> <!-- Animated Grid Background --> <div class="absolute inset-0 opacity-30"> <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(45, 212, 191, 0.15) 1px, transparent 0); background-size: 40px 40px;"></div> </div> <!-- Geometric Accent Lines --> <div class="absolute inset-0 overflow-hidden"> <!-- Top accent line --> <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"></div> <!-- Floating geometric elements --> <div class="absolute top-2 right-20 w-2 h-2 bg-primary-400/40 rotate-45 animate-pulse"></div> <div class="absolute top-4 right-32 w-1 h-8 bg-gradient-to-b from-primary-400/30 to-transparent"></div> <div class="absolute top-1 left-1/3 w-3 h-px bg-cyan-400/50"></div> </div> <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="flex h-20 items-center justify-between"> <!-- Logo with Tech Enhancement --> <div class="flex items-center space-x-3"> <div class="relative"> <!-- Subtle glow around logo --> <div class="absolute inset-0 bg-primary-400/20 blur-md rounded-full scale-150"></div> <a href="/" class="relative flex items-center"> <img src="/logo.svg" alt="AIStudio Logo" class="h-14 w-auto"> </a> </div> <!-- Status indicator --> <div class="hidden lg:flex items-center space-x-2 text-xs text-primary-400/80"> <div class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div> <span class="font-mono">ONLINE</span> </div> </div> <!-- Desktop Navigation with Liquid Glass macOS Style --> <div class="hidden md:block"> <div class="relative"> <!-- Liquid glass background with multiple layers --> <div class="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-2xl border border-white/[0.08]"></div> <div class="absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02] rounded-2xl"></div> <div class="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.05] rounded-2xl"></div> <!-- Inner content with subtle shadow --> <div class="relative px-8 py-3 rounded-2xl"> <!-- Inner glass reflection --> <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div> ${renderComponent($$result, "MainNav", $$MainNav, {})} </div> <!-- Subtle outer glow --> <div class="absolute -inset-px bg-gradient-to-r from-primary-400/10 via-transparent to-cyan-400/10 rounded-2xl blur-sm -z-10"></div> </div> </div> <!-- Right Section with Tech Elements --> <div class="flex items-center space-x-4"> <!-- Status Indicators --> <div class="hidden lg:flex items-center space-x-4 text-xs text-white/60"> <div class="flex items-center space-x-1"> <div class="w-1 h-1 bg-primary-400 rounded-full"></div> <span class="font-mono">AI</span> </div> <div class="flex items-center space-x-1"> <div class="w-1 h-1 bg-cyan-400 rounded-full"></div> <span class="font-mono">READY</span> </div> </div> <!-- CTA Button --> <div class="hidden sm:block"> <div class="relative group"> <!-- Button glow effect --> <div class="absolute -inset-0.5 bg-gradient-to-r from-primary-400 to-cyan-400 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div> ${renderComponent($$result, "Button", $$Button, { "href": "/contact", "variant": "primary", "size": "sm", "class": "relative" }, { "default": ($$result2) => renderTemplate`
Start gesprek
` })} </div> </div> <!-- Mobile menu button with enhanced styling --> <button type="button" class="mobile-menu-button md:hidden relative p-2 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-lg border border-white/10 bg-dark-800/50 backdrop-blur-md" aria-expanded="false" aria-controls="mobile-menu" aria-label="Toggle navigation menu"> <span class="sr-only">Open main menu</span> <!-- Menu icon (hamburger) --> <svg class="menu-icon h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path> </svg> <!-- Close icon (X) --> <svg class="close-icon hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path> </svg> </button> </div> </div> <!-- Mobile menu --> <div class="mobile-menu hidden md:hidden" id="mobile-menu"> <div class="glass-card mt-2 p-4 space-y-2"> <a href="/" class="block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors" data-current-class="bg-primary-400/20 text-primary-400">
Home
</a> <a href="/diensten" class="block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors" data-current-class="bg-primary-400/20 text-primary-400">
Onze diensten
</a> <a href="/nieuws" class="block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors" data-current-class="bg-primary-400/20 text-primary-400">
Nieuws
</a> <a href="/contact" class="block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors" data-current-class="bg-primary-400/20 text-primary-400">
Contact
</a> <!-- Mobile CTA --> <div class="pt-4 sm:hidden"> ${renderComponent($$result, "Button", $$Button, { "href": "/contact", "variant": "primary", "class": "w-full" }, { "default": ($$result2) => renderTemplate`
Start gesprek
` })} </div> </div> </div> </div> </header> ${renderScript($$result, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/nav/Header.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/nav/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="border-t border-white/10 bg-dark-800/80 backdrop-blur-strong"> <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"> <div class="grid grid-cols-1 gap-8 md:grid-cols-3"> <div> <div class="flex items-center"> <img src="/logo.svg" alt="AI Studio Logo" class="h-8 w-auto"> </div> <p class="mt-4 text-sm text-zinc-300">AI-Studio44 — Schilde, BE</p> <p class="mt-2 text-sm text-zinc-300"> <a href="mailto:hi@ai-studio44.com" class="hover:text-primary-400 transition-colors">
hi@ai-studio44.com
</a> </p> </div> <div> <h3 class="text-sm font-semibold text-white">Navigatie</h3> <ul class="mt-4 space-y-2"> <li> <a href="/" class="text-sm text-zinc-300 hover:text-primary-400 transition-colors">
Home
</a> </li> <li> <a href="/diensten" class="text-sm text-zinc-300 hover:text-primary-400 transition-colors">
Onze diensten
</a> </li> <li> <a href="/nieuws" class="text-sm text-zinc-300 hover:text-primary-400 transition-colors">
Nieuws
</a> </li> <li> <a href="/contact" class="text-sm text-zinc-300 hover:text-primary-400 transition-colors">
Contact
</a> </li> </ul> </div> <div> <h3 class="text-sm font-semibold text-white">Juridisch</h3> <ul class="mt-4 space-y-2"> <li> <a href="/privacy" class="text-sm text-zinc-300 hover:text-primary-400 transition-colors">
Privacybeleid
</a> </li> <li> <a href="/terms" class="text-sm text-zinc-300 hover:text-primary-400 transition-colors">
Algemene Voorwaarden
</a> </li> </ul> </div> </div> <div class="mt-8 border-t border-white/10 pt-8"> <p class="text-center text-sm text-zinc-400">
© ${currentYear} AI Studio. Alle rechten voorbehouden.
</p> </div> </div> </footer>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/nav/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://ai-studio44.com");
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const seoProps = getSEOProps(Astro2.props);
  const organizationSchema = orgSchema();
  return renderTemplate(_a || (_a = __template(['<html lang="nl" class="h-full"> <head><meta charset="UTF-8"><meta name="description"', '><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"', "><!-- SEO --><title>", '</title><link rel="canonical"', ">", '<!-- Open Graph / Facebook --><meta property="og:type"', '><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><!-- JSON-LD --><script type="application/ld+json">', "<\/script>", '</head> <body class="min-h-full mt-auto bg-dark-900 text-white"> ', ' <div class="flex min-h-full flex-col"> ', ' <main id="main-content"', "> ", " </main> ", " </div> </body></html>"])), addAttribute(seoProps.description, "content"), addAttribute(Astro2.generator, "content"), seoProps.title, addAttribute(seoProps.canonical, "href"), seoProps.noindex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, addAttribute(seoProps.type, "content"), addAttribute(seoProps.canonical, "content"), addAttribute(seoProps.title, "content"), addAttribute(seoProps.description, "content"), addAttribute(seoProps.image, "content"), addAttribute(seoProps.canonical, "content"), addAttribute(seoProps.title, "content"), addAttribute(seoProps.description, "content"), addAttribute(seoProps.image, "content"), unescapeHTML(JSON.stringify(organizationSchema)), renderHead(), renderComponent($$result, "SkipLink", $$SkipLink, {}), renderComponent($$result, "Header", $$Header, {}), addAttribute(`flex-1 ${Astro2.props.class || ""}`, "class"), renderSlot($$result, $$slots["default"]), renderComponent($$result, "Footer", $$Footer, {}));
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/layout/BaseLayout.astro", void 0);

export { $$BaseLayout as $, $$Button as a, articleSchema as b, breadcrumbsSchema as c };
