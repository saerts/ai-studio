/* empty css                                             */
import { c as createComponent, r as renderComponent, a as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Button } from '../chunks/BaseLayout_DtB_0che.mjs';
import { $ as $$Section } from '../chunks/Section_Ci-pej19.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const seoProps = {
    title: "AI Studio \u2014 Breng AI in je dagelijkse flow",
    description: "AI Studio helpt kmo\u2019s en teams om sneller te schalen met praktische AI-oplossingen. Boek vandaag een gratis adviesgesprek en ontdek je quick wins.",
    canonical: "https://ai-studio44.com"
  };
  const services = [
    {
      title: "AI Scan",
      description: "Een grondige analyse van je huidige processen en identificatie van AI-kansen die direct impact hebben.",
      features: [
        "Procesanalyse",
        "AI-opportunity mapping",
        "ROI-berekening",
        "Implementatieplan"
      ]
    },
    {
      title: "Workflow Automations",
      description: "Automatiseer repetitieve taken met slimme AI-oplossingen die perfect aansluiten bij je workflow.",
      features: [
        "Process automation",
        "Integration setup",
        "Testing & validation",
        "Performance monitoring"
      ]
    },
    {
      title: "Training & Coaching",
      description: "Breng je team up-to-speed met praktische AI-training en hands-on coaching voor maximale adoptie.",
      features: [
        "Team workshops",
        "Hands-on training",
        "Best practices",
        "Ongoing support"
      ]
    }
  ];
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "We analyseren je huidige processen en identificeren de beste AI-kansen."
    },
    {
      number: "02",
      title: "Design",
      description: "Samen ontwerpen we de optimale AI-oplossing die perfect bij je organisatie past."
    },
    {
      number: "03",
      title: "Deploy",
      description: "We implementeren en testen de oplossing, en zorgen voor een vlotte rollout."
    }
  ];
  const aiExamples = [
    {
      iconPrimary: "#2dd4bf",
      iconSecondary: "#22d3ee",
      iconPath: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
      title: "Automatisering van repetitieve taken",
      description: "Automatiseer saaie, terugkerende klusjes met generatieve AI, zodat medewerkers zich kunnen richten op interessanter werk.",
      benefits: [
        "Meer tijd voor creatief werk",
        "Minder menselijke fouten",
        "Verhoogde effici\xEBntie"
      ],
      category: "Efficiency"
    },
    {
      iconPrimary: "#e879f9",
      iconSecondary: "#c084fc",
      iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Kant-en-klare AI-sjablonen",
      description: "Lever kant-en-klare AI-sjablonen en voorbeeldprompts voor veelvoorkomende taken, zodat klanten vliegend van start kunnen gaan.",
      benefits: [
        "Snelle implementatie",
        "Direct bruikbare resultaten",
        "Geen denkwerk bij setup"
      ],
      category: "Templates"
    },
    {
      iconPrimary: "#06b6d4",
      iconSecondary: "#0891b2",
      iconPath: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      title: "Virtuele AI-assistent",
      description: "Een virtuele AI-assistent die helpt bij allerlei administratieve werkzaamheden, van e-mails tot agendabeheer.",
      benefits: [
        "Ontlasting van administratie",
        "Niets over het hoofd",
        "Productiever werken"
      ],
      category: "Assistant"
    },
    {
      iconPrimary: "#f59e0b",
      iconSecondary: "#d97706",
      iconPath: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z",
      title: "Generatieve AI voor creativiteit",
      description: "Gebruik generatieve AI om visuele content en ontwerpen te maken zonder grafisch expert.",
      benefits: [
        "Sneller creatief materiaal",
        "Lagere designkosten",
        "Onbeperkte inspiratie"
      ],
      category: "Creative"
    },
    {
      iconPrimary: "#8b5cf6",
      iconSecondary: "#7c3aed",
      iconPath: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      title: "Brainstormen met AI",
      description: "Zet generatieve AI in als creatieve sparringpartner voor nieuwe idee\xEBn en strategie\xEBn.",
      benefits: [
        "Out-of-the-box oplossingen",
        "Breder scala aan idee\xEBn",
        "Weloverwogen beslissingen"
      ],
      category: "Strategy"
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seoProps }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Section", $$Section, { "class": "relative pt-20 min-h-[calc(100vh-5rem)] overflow-hidden" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="absolute inset-0 grid-pattern"></div> <div class="absolute inset-0 overflow-hidden"> <div class="absolute top-20 left-10 w-32 h-32 bg-primary-400/10 rounded-full blur-lg float performance-optimized"></div> <div class="absolute top-40 right-20 w-24 h-24 bg-accent-400/15 rounded-lg blur-md pulse-glow performance-optimized" style="animation-delay: 3s;"></div> <div class="absolute bottom-32 left-1/4 w-16 h-16 bg-primary-300/20 rounded-full blur-sm essential-pulse performance-optimized" style="animation-delay: 6s;"></div> </div> <div class="relative z-10 flex items-center min-h-full" id="intro"> <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> <div class="text-center"> <h1 class="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-shadow-lg">
BRENG <span class="ai-animated-text">AI</span> IN JE
<br> <span class="gradient-text font-bold"> DAGELIJKSE FLOW </span> </h1> <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-300">
Versnel groei met AI die wél rendeert. Wij vertalen jouw processen
            naar concrete automatisaties, training en coaching — snel live en
            meetbaar resultaat. Klaar om te ontdekken wat AI voor jou kan doen?
            Plan een gratis adviesgesprek.
</p> <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"> ${renderComponent($$result3, "Button", $$Button, { "href": "/contact", "variant": "primary", "size": "lg" }, { "default": ($$result4) => renderTemplate`
Plan een gratis adviesgesprek
` })} ${renderComponent($$result3, "Button", $$Button, { "href": "/news", "variant": "secondary", "size": "lg" }, { "default": ($$result4) => renderTemplate`
Ontdek de mogelijkheden
` })} </div> </div> </div> </div>  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce performance-optimized z-20"> <div class="w-6 h-10 border-2 border-primary-400/50 rounded-full relative"> <div class="w-1 h-3 bg-primary-400 rounded-full absolute top-2 left-1/2 -translate-x-1/2 essential-pulse"></div> </div> </div> ` })}  ${renderComponent($$result2, "Section", $$Section, { "id": "services", "aria-labelledby": "services-heading", "class": "py-24 scroll-animate" }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16"> <h2 id="services-heading" class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
Onze kernservices
</h2> <p class="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
Van strategie tot implementatie — we begeleiden je door elke stap van je
        AI-transformatie.
</p> </div> <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"> ${services.map((service) => renderTemplate`<div class="glass-card p-8 group hover:scale-105 transition-all duration-300"> <h3 class="text-xl font-semibold text-white mb-4"> ${service.title} </h3> <p class="text-zinc-300 mb-6 leading-relaxed"> ${service.description} </p> <ul class="space-y-2"> ${service.features.map((feature) => renderTemplate`<li class="flex items-center text-sm text-zinc-400"> <svg class="mr-2 h-4 w-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg> ${feature} </li>`)} </ul> </div>`)} </div> <div class="mt-12 text-center"> ${renderComponent($$result3, "Button", $$Button, { "href": "/diensten", "variant": "primary" }, { "default": ($$result4) => renderTemplate` Bekijk alle diensten ` })} </div> ` })}  ${renderComponent($$result2, "Section", $$Section, { "class": "py-24 relative overflow-hidden scroll-animate-slide-left", "id": "ai-examples", "aria-labelledby": "ai-examples-heading" }, { "default": ($$result3) => renderTemplate`  <div class="absolute inset-0 opacity-20"> <div class="absolute top-10 left-10 w-32 h-32 bg-primary-400/10 rounded-full blur-lg pulse-glow performance-optimized"></div> <div class="absolute bottom-20 right-20 w-24 h-24 bg-cyan-400/15 rounded-lg blur-md performance-optimized" style="animation-delay: 4s;"></div> </div> <div class="relative text-center mb-16"> <h2 id="ai-examples-heading" class="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
AI in de <span class="gradient-text">praktijk</span> </h2> <p class="mx-auto max-w-3xl text-lg text-zinc-300">
Ontdek hoe AI jouw dagelijkse werkzaamheden kan transformeren met
        concrete voorbeelden en toepassingen.
</p> </div>  <div class="relative"> <!-- Grid Container with Creative Layout --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"> ${aiExamples.map((example, index) => renderTemplate`<div${addAttribute(`glass-card group relative overflow-hidden transition-all duration-300 hover:scale-105 performance-optimized ${index === 0 ? "md:col-span-2 lg:col-span-1 lg:row-span-2" : index === 2 ? "lg:col-span-2" : ""}`, "class")}${addAttribute(`animation-delay: ${index * 120}ms`, "style")}> <div class="absolute top-4 right-4 z-10"> <span class="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-white/10 text-white/70 backdrop-blur-sm border border-white/20"> ${example.category} </span> </div> <div class="p-6 lg:p-8 h-full flex flex-col"> <div class="relative mb-6 flex-shrink-0"> <div class="absolute inset-0 blur-lg rounded-full scale-150 group-hover:scale-165 transition-transform duration-300 opacity-30 performance-optimized"${addAttribute(`background: linear-gradient(135deg, ${example.iconPrimary}, ${example.iconSecondary})`, "style")}></div> <div class="relative w-16 h-16 mx-auto lg:mx-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center backdrop-blur-sm"> <svg class="w-8 h-8 transition-transform duration-200 group-hover:scale-110 will-change-transform" viewBox="0 0 24 24" fill="none"> <defs> <linearGradient${addAttribute(`icon-gradient-${index}`, "id")} x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%"${addAttribute(`stop-color:${example.iconPrimary}`, "style")}></stop> <stop offset="100%"${addAttribute(`stop-color:${example.iconSecondary}`, "style")}></stop> </linearGradient> </defs> <path${addAttribute(`url(#icon-gradient-${index})`, "stroke")} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"${addAttribute(example.iconPath, "d")}></path> </svg> </div> </div> <div class="flex-grow"> <h3 class="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors duration-200"> ${example.title} </h3> <p class="text-zinc-300 mb-6 leading-relaxed text-sm lg:text-base"> ${example.description} </p> </div> <div class="space-y-3 mt-auto"> ${example.benefits.map((benefit) => renderTemplate`<div class="flex items-center group/benefit"> <div class="w-2 h-2 rounded-full mr-3 transition-all duration-200 group-hover/benefit:scale-125 will-change-transform"${addAttribute(`background: linear-gradient(135deg, ${example.iconPrimary}, ${example.iconSecondary})`, "style")}></div> <span class="text-sm text-zinc-400 group-hover/benefit:text-zinc-300 transition-colors duration-200"> ${benefit} </span> </div>`)} </div> <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none performance-optimized"${addAttribute(`background: linear-gradient(135deg, ${example.iconPrimary}20, ${example.iconSecondary}20); border: 1px solid ${example.iconPrimary}30`, "style")}></div> </div> </div>`)} </div> <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-400/10 to-cyan-400/10 rounded-full blur-lg pulse-glow performance-optimized"></div> <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-md performance-optimized" style="animation-delay: 3s;"></div> </div> <div class="mt-16 text-center"> <div class="inline-flex items-center space-x-4 glass-card px-8 py-4"> <div class="flex items-center space-x-2 text-primary-400"> <div class="w-2 h-2 bg-primary-400 rounded-full essential-pulse performance-optimized"></div> <span class="text-sm font-mono">READY TO START</span> </div> ${renderComponent($$result3, "Button", $$Button, { "href": "/contact", "variant": "primary", "size": "sm" }, { "default": ($$result4) => renderTemplate`
Plan je gratis adviesgesprek
` })} </div> </div> ` })}  ${renderComponent($$result2, "Section", $$Section, { "class": "py-24 scroll-animate-slide-right", "id": "how-we-work", "aria-labelledby": "how-we-work-heading" }, { "default": ($$result3) => renderTemplate` <div class="text-center mb-16"> <h2 id="how-we-work-heading" class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
Hoe we werken
</h2> <p class="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
Een duidelijke, stapsgewijze aanpak die resultaten garandeert.
</p> </div> <div class="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"> ${steps.map((step, index) => renderTemplate`<div class="relative text-center"> <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-border mb-6"> <span class="text-xl font-bold gradient-text">${step.number}</span> </div> <h3 class="mt-6 text-xl font-semibold text-white">${step.title}</h3> <p class="mt-4 text-zinc-300">${step.description}</p> ${index < steps.length - 1 && renderTemplate`<div class="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-primary-400/50 to-transparent md:block" aria-hidden="true"></div>`} </div>`)} </div> ` })}  ${renderComponent($$result2, "Section", $$Section, { "class": "py-24 scroll-animate-scale" }, { "default": ($$result3) => renderTemplate` <div class="glass-card p-12 text-center"> <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
Klaar om te <span class="gradient-text">beginnen?</span> </h2> <p class="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
Laten we samen ontdekken hoe AI jouw bedrijf kan transformeren.
</p> <div class="mt-8"> ${renderComponent($$result3, "Button", $$Button, { "href": "/contact", "variant": "primary", "size": "lg" }, { "default": ($$result4) => renderTemplate`
Plan een gratis kennismaking
` })} </div> </div> ` })} ` })} ${renderScript($$result, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/index.astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
