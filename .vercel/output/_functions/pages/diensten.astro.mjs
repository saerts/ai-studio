/* empty css                                             */
import { c as createComponent, r as renderComponent, a as renderScript, b as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CFbGmnFU.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout, a as $$Button } from '../chunks/BaseLayout_DtB_0che.mjs';
import { $ as $$Section } from '../chunks/Section_Ci-pej19.mjs';
export { renderers } from '../renderers.mjs';

const $$Diensten = createComponent(($$result, $$props, $$slots) => {
  const seoProps = {
    title: "Onze diensten",
    description: "AI Studio biedt een compleet pakket aan AI-diensten: van AI Scan tot Workflow Automations, Training & Coaching en Pilot & Rollout.",
    canonical: "https://ai-studio44.com/diensten"
  };
  const services = [
    {
      id: "ai-scan",
      title: "AI Scan",
      description: "Een grondige analyse van je huidige processen en identificatie van AI-kansen die direct impact hebben op je bedrijfsresultaten.",
      deliverables: [
        "Procesanalyse en workflow mapping",
        "AI-opportunity assessment",
        "ROI-berekening per use case",
        "Gedetailleerd implementatieplan",
        "Risico-analyse en mitigatiestrategie\xEBn"
      ],
      outcomes: [
        "Duidelijk overzicht van AI-kansen",
        "Prioritering op basis van business impact",
        "Concrete actieplan met tijdslijn",
        "Business case voor investering"
      ]
    },
    {
      id: "workflow-automations",
      title: "Workflow Automations",
      description: "Automatiseer repetitieve taken met slimme AI-oplossingen die naadloos integreren met je bestaande systemen en werkprocessen.",
      deliverables: [
        "Process automation design",
        "AI-model ontwikkeling en training",
        "Systeem integratie en API-koppelingen",
        "Testing en validatie protocols",
        "Performance monitoring dashboard"
      ],
      outcomes: [
        "40-70% tijdsbesparing op repetitieve taken",
        "Verhoogde accuraatheid en consistentie",
        "Schaalbare oplossingen",
        "Realtime performance insights"
      ]
    },
    {
      id: "training-coaching",
      title: "Training & Coaching",
      description: "Breng je team up-to-speed met praktische AI-training en hands-on coaching voor maximale adoptie en effectief gebruik.",
      deliverables: [
        "Teamworkshops en hands-on training",
        "Persoonlijke coaching sessies",
        "Best practices documentation",
        "Change management support",
        "Ongoing support en Q&A sessies"
      ],
      outcomes: [
        "90%+ team adoptie van AI-tools",
        "Verhoogde productiviteit binnen 30 dagen",
        "Zelfstandig gebruik van AI-oplossingen",
        "Cultuurverandering naar AI-first mindset"
      ]
    },
    {
      id: "pilot-rollout",
      title: "Pilot & Rollout",
      description: "Van proof-of-concept tot volledige implementatie \u2014 we begeleiden je door elke fase van je AI-transformatie.",
      deliverables: [
        "Pilot project setup en management",
        "Stapsgewijze rollout strategie",
        "Change management programma",
        "Success metrics en KPI tracking",
        "Post-implementatie optimalisatie"
      ],
      outcomes: [
        "Bewezen ROI binnen 3 maanden",
        "Vlotte organisatie-brede adoptie",
        "Minimale disruption van bestaande processen",
        "Continu optimalisatie en verbetering"
      ]
    }
  ];
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seoProps }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Section", $$Section, { "class": "scroll-animate" }, { "default": ($$result3) => renderTemplate` ${maybeRenderHead()}<div class="text-center"> <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl gradient-text">
Onze diensten
</h1> <p class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
Van strategie tot implementatie — we bieden een compleet pakket aan
        AI-diensten die jouw bedrijf naar het volgende niveau tillen.
</p> </div>  <nav class="mt-12" aria-label="Diensten navigatie"> <div class="flex flex-wrap justify-center gap-4"> ${services.map((service) => renderTemplate`<a${addAttribute(`#${service.id}`, "href")} class="glass-card px-4 py-2 text-sm font-medium text-white/80 transition-all hover:text-primary-400 hover:border-primary-400/30"> ${service.title} </a>`)} </div> </nav> ` })}  ${services.map((service, index) => renderTemplate`${renderComponent($$result2, "Section", $$Section, { "id": service.id, "class": `${index % 2 === 1 ? "bg-dark-800/20" : ""} ${index % 2 === 0 ? "scroll-animate-slide-left" : "scroll-animate-slide-right"}`, "aria-labelledby": `${service.id}-heading` }, { "default": ($$result3) => renderTemplate` <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16"> <div> <h2${addAttribute(`${service.id}-heading`, "id")} class="text-3xl font-bold tracking-tight text-white sm:text-4xl"> ${service.title} </h2> <p class="mt-6 text-lg leading-8 text-zinc-300"> ${service.description} </p> <div class="mt-8"> <h3 class="text-lg font-semibold text-white">Wat je krijgt:</h3> <ul class="mt-4 space-y-3"> ${service.deliverables.map((deliverable) => renderTemplate`<li class="flex items-start"> <svg class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-400" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path> </svg> <span class="text-zinc-300">${deliverable}</span> </li>`)} </ul> </div> </div> <div> <h3 class="text-lg font-semibold text-white">
Meetbare resultaten:
</h3> <ul class="mt-4 space-y-3"> ${service.outcomes.map((outcome) => renderTemplate`<li class="flex items-start"> <svg class="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-primary-400" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path> </svg> <span class="text-zinc-300">${outcome}</span> </li>`)} </ul> <div class="mt-8"> ${renderComponent($$result3, "Button", $$Button, { "href": "/contact", "variant": "primary" }, { "default": ($$result4) => renderTemplate`
Plan een gesprek
` })} </div> </div> </div> ` })}`)} ${renderComponent($$result2, "Section", $$Section, { "class": "py-24 scroll-animate-scale" }, { "default": ($$result3) => renderTemplate` <div class="glass-card p-12 text-center"> <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
Klaar voor je <span class="gradient-text">AI-transformatie?</span> </h2> <p class="mx-auto mt-4 max-w-2xl text-lg text-zinc-300">
Laten we samen bepalen welke diensten het beste bij jouw organisatie
        passen.
</p> <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center"> ${renderComponent($$result3, "Button", $$Button, { "href": "/contact", "variant": "primary", "size": "lg" }, { "default": ($$result4) => renderTemplate`
Start gesprek
` })} </div> </div> ` })} ` })} ${renderScript($$result, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/diensten.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/diensten.astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/diensten.astro";
const $$url = "/diensten";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Diensten,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
