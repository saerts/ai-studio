/* empty css                                             */
import { d as createAstro, c as createComponent, m as maybeRenderHead, e as addAttribute, r as renderComponent, b as renderTemplate, a as renderScript } from '../chunks/astro/server_X5whkWjU.mjs';
import 'kleur/colors';
import { a as $$Button, $ as $$BaseLayout } from '../chunks/BaseLayout_Dm3TLDtu.mjs';
/* empty css                                             */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://ai-studio44.com");
const $$AIConsultationCTA = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AIConsultationCTA;
  const {
    title = "Klaar om AI te omarmen?",
    subtitle = "Laten we samen ontdekken hoe AI jouw organisatie naar een hoger niveau kan tillen.",
    primaryButtonText = "Plan een strategiegesprek",
    primaryButtonHref = "/contact",
    showCalendar = false,
    class: className = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section${addAttribute(`cta-section relative overflow-hidden px-6 sm:px-8 lg:px-12 ${className}`, "class")} data-astro-cid-5hlwqsyj> <div class="cta-gradient-bg absolute inset-0" data-astro-cid-5hlwqsyj></div> <div class="relative max-w-6xl mx-auto py-24 sm:py-32 lg:py-40" data-astro-cid-5hlwqsyj> <div class="text-center space-y-12" data-astro-cid-5hlwqsyj> <!-- Decorative Elements --> <div class="flex justify-center" data-astro-cid-5hlwqsyj> <div class="relative" data-astro-cid-5hlwqsyj> <div class="absolute -inset-4 bg-teal-500/20 blur-xl rounded-full animate-pulse" data-astro-cid-5hlwqsyj></div> <div class="relative bg-gradient-to-br from-teal-400 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform" data-astro-cid-5hlwqsyj> <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-astro-cid-5hlwqsyj> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-5hlwqsyj></path> </svg> </div> </div> </div> <!-- Content --> <div class="space-y-6 pt-6 pb-6" data-astro-cid-5hlwqsyj> <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white" data-astro-cid-5hlwqsyj> ${title} </h2> <p class="text-xl text-gray-300 max-w-2xl mx-auto" data-astro-cid-5hlwqsyj> ${subtitle} </p> </div> <!-- Features List --> <div class="flex flex-wrap justify-center gap-6 text-sm text-gray-400 pt-6 pb-6 mt-8" data-astro-cid-5hlwqsyj> <div class="flex items-center gap-2" data-astro-cid-5hlwqsyj> <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5hlwqsyj> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-5hlwqsyj></path> </svg> <span data-astro-cid-5hlwqsyj>Gratis intake</span> </div> <div class="flex items-center gap-2" data-astro-cid-5hlwqsyj> <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5hlwqsyj> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-5hlwqsyj></path> </svg> <span data-astro-cid-5hlwqsyj>ROI-garantie</span> </div> <div class="flex items-center gap-2" data-astro-cid-5hlwqsyj> <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5hlwqsyj> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-5hlwqsyj></path> </svg> <span data-astro-cid-5hlwqsyj>Bewezen methodologie</span> </div> <div class="flex items-center gap-2" data-astro-cid-5hlwqsyj> <svg class="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5hlwqsyj> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-astro-cid-5hlwqsyj></path> </svg> <span data-astro-cid-5hlwqsyj>100+ succesvolle implementaties</span> </div> </div> <!-- CTAs --> <div class="flex flex-col sm:flex-row gap-6 justify-center mt-12" data-astro-cid-5hlwqsyj> ${renderComponent($$result, "Button", $$Button, { "href": primaryButtonHref, "variant": "primary", "size": "lg", "data-astro-cid-5hlwqsyj": true }, { "default": ($$result2) => renderTemplate` <span data-astro-cid-5hlwqsyj>${primaryButtonText}</span> <svg class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5hlwqsyj> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-5hlwqsyj></path> </svg> ` })} </div> <!-- Optional Calendar Widget --> ${showCalendar && renderTemplate`<div class="mt-16 max-w-2xl mx-auto" data-astro-cid-5hlwqsyj> <div class="bg-dark-700/50 backdrop-blur-sm rounded-xl p-10 border border-dark-600" data-astro-cid-5hlwqsyj> <h3 class="text-lg font-semibold text-white mb-6" data-astro-cid-5hlwqsyj>
Direct een afspraak inplannen
</h3> <div class="calendar-widget bg-dark-800 rounded-lg p-6 min-h-[350px] flex items-center justify-center" data-astro-cid-5hlwqsyj>  <p class="text-gray-500 text-sm" data-astro-cid-5hlwqsyj>
Kalender widget wordt hier geladen...
</p> </div> </div> </div>`} </div> </div>  </section>`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/components/AIConsultationCTA.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AiVoorBedrijven = createComponent(($$result, $$props, $$slots) => {
  const seo = {
    title: "De Stille Revolutie waar uw Bedrijf aan Voorbijgaat - AI voor KMO's",
    description: "Terwijl ChatGPT miljoenen gebruikers telt, worstelen Belgische kmo's nog met de vraag wat AI voor hen kan betekenen. Ontdek concrete voorbeelden en praktische stappen.",
    image: "/images/ai-voor-bedrijven.png",
    type: "article"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seo, "data-astro-cid-yjfxgzkf": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div class="reading-progress" id="readingProgress" data-astro-cid-yjfxgzkf></div>  <section class="hero-section" data-astro-cid-yjfxgzkf> <div class="hero-overlay" data-astro-cid-yjfxgzkf></div> <!-- Hero Background Image --> <div class="absolute inset-0 opacity-20" data-astro-cid-yjfxgzkf> <img src="/images/ai-voor-bedrijven-bg.png" alt="Futuristic AI cityscape with digital networks" class="w-full h-full object-cover object-center" loading="eager" data-astro-cid-yjfxgzkf> </div> <div class="hero-content w-full" data-astro-cid-yjfxgzkf> <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20" data-astro-cid-yjfxgzkf> <div class="text-center space-y-8 fade-in" data-astro-cid-yjfxgzkf> <!-- Hero Badge --> <div class="inline-flex items-center px-4 py-2 rounded-full text-sm text-teal-300 hero-badge" data-astro-cid-yjfxgzkf> <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-yjfxgzkf> <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" data-astro-cid-yjfxgzkf></path> </svg>
De stille revolutie is begonnen
</div> <!-- Hero Title --> <h1 class="hero-title text-white mt-6" data-astro-cid-yjfxgzkf> <span class="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent" data-astro-cid-yjfxgzkf>
De Stille Revolutie
</span><br data-astro-cid-yjfxgzkf>
waar uw Bedrijf aan Voorbijgaat
</h1> <!-- Hero Subtitle --> <p class="hero-subtitle max-w-4xl mx-auto mt-6" data-astro-cid-yjfxgzkf>
Terwijl ChatGPT miljoenen gebruikers telt, worstelen Belgische kmo's
            nog met de vraag wat AI voor hen kan betekenen. Een gemiste kans,
            want juist kleinere organisaties kunnen met beperkte middelen grote
            sprongen maken.
</p> <!-- Hero CTA --> <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8 mt-8" data-astro-cid-yjfxgzkf> `, " ", ` </div> </div> </div> </div> </section>  <section class="content-section" id="intro" data-astro-cid-yjfxgzkf> <div class="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12" data-astro-cid-yjfxgzkf> <div class="space-y-8 fade-in" data-astro-cid-yjfxgzkf> <p class="article-text text-xl leading-relaxed" data-astro-cid-yjfxgzkf>
Het contrast is opvallend. Waar technologiereuzen miljarden investeren
          in artifici\xEBle intelligentie en consumenten massaal AI-tools omarmen,
          blijft de Belgische kmo-sector opvallend stil. Recent onderzoek toont
          aan dat slechts <strong class="text-teal-400" data-astro-cid-yjfxgzkf>15% van de kleine en middelgrote ondernemingen in Belgi\xEB</strong> actief AI-toepassingen gebruikt.
</p> <div class="quote-box" data-astro-cid-yjfxgzkf> <blockquote class="text-lg italic text-teal-300 mb-4" data-astro-cid-yjfxgzkf>
"We hebben geen IT-afdeling. AI, dat is toch voor de Googles van
            deze wereld?"
</blockquote> <cite class="text-sm text-zinc-400" data-astro-cid-yjfxgzkf>
\u2014 Vaak gehoorde reactie van KMO-eigenaren
</cite> </div> <p class="article-text" data-astro-cid-yjfxgzkf>
Niets is minder waar. Juist voor organisaties met beperkte resources
          kan AI het verschil maken tussen overleven en floreren in een steeds
          competitievere markt.
</p> </div> </div> </section>  <section class="stats-section py-20" data-astro-cid-yjfxgzkf> <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" data-astro-cid-yjfxgzkf> <h2 class="section-title text-center text-white fade-in" data-astro-cid-yjfxgzkf>
De Praktijk: AI als Stille Kracht
</h2> <div class="grid md:grid-cols-2 gap-8 mb-24" data-astro-cid-yjfxgzkf> <div class="success-story scale-in" data-astro-cid-yjfxgzkf> <div class="flex items-start space-x-4 mb-4" data-astro-cid-yjfxgzkf> <div class="flex-shrink-0 w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center" data-astro-cid-yjfxgzkf> <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-astro-cid-yjfxgzkf></path> </svg> </div> <div data-astro-cid-yjfxgzkf> <h3 class="text-xl font-semibold text-white mb-2" data-astro-cid-yjfxgzkf>
Antwerpse Boekhouder
</h3> <p class="text-sm text-teal-300" data-astro-cid-yjfxgzkf>3 medewerkers</p> </div> </div> <p class="text-zinc-300 leading-relaxed mb-4" data-astro-cid-yjfxgzkf>
Met slechts drie medewerkers verwerkt het kantoor nu <strong class="text-teal-400" data-astro-cid-yjfxgzkf>40% meer dossiers</strong>
dan een jaar geleden. Een AI-assistent categoriseert automatisch facturen,
            bereidt btw-aangiftes voor en signaleert afwijkingen.
</p> <div class="flex items-center text-sm text-zinc-400" data-astro-cid-yjfxgzkf> <span class="text-teal-400 font-semibold mr-2" data-astro-cid-yjfxgzkf>Investering:</span>
Minder dan een halftijdse kracht
</div> </div> <div class="success-story scale-in" data-astro-cid-yjfxgzkf> <div class="flex items-start space-x-4 mb-4" data-astro-cid-yjfxgzkf> <div class="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center" data-astro-cid-yjfxgzkf> <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" data-astro-cid-yjfxgzkf></path> </svg> </div> <div data-astro-cid-yjfxgzkf> <h3 class="text-xl font-semibold text-white mb-2" data-astro-cid-yjfxgzkf>
Gentse Webshop
</h3> <p class="text-sm text-cyan-300" data-astro-cid-yjfxgzkf>Designmeubelen</p> </div> </div> <p class="text-zinc-300 leading-relaxed mb-4" data-astro-cid-yjfxgzkf>
AI schrijft productbeschrijvingen in vier talen, beantwoordt
            klantvragen en optimaliseert voorraad. Resultaat: <strong class="text-cyan-400" data-astro-cid-yjfxgzkf>verdrievoudiging internationale verkoop</strong> in acht maanden.
</p> <div class="flex items-center text-sm text-zinc-400" data-astro-cid-yjfxgzkf> <span class="text-cyan-400 font-semibold mr-2" data-astro-cid-yjfxgzkf>Investering:</span>
Minder dan \u20AC200 per maand
</div> </div> </div> <!-- Key Statistics --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-astro-cid-yjfxgzkf> <div class="stat-card fade-in" data-astro-cid-yjfxgzkf> <div class="stat-number" data-target="40" data-astro-cid-yjfxgzkf>0</div> <p class="text-lg text-teal-300 mt-2" data-astro-cid-yjfxgzkf>% meer</p> <p class="text-zinc-400 mt-2" data-astro-cid-yjfxgzkf>dossiers verwerkt</p> </div> <div class="stat-card fade-in" data-astro-cid-yjfxgzkf> <div class="stat-number" data-target="3" data-astro-cid-yjfxgzkf>0</div> <p class="text-lg text-cyan-300 mt-2" data-astro-cid-yjfxgzkf>x meer</p> <p class="text-zinc-400 mt-2" data-astro-cid-yjfxgzkf>internationale verkoop</p> </div> <div class="stat-card fade-in" data-astro-cid-yjfxgzkf> <div class="stat-number" data-target="15" data-astro-cid-yjfxgzkf>0</div> <p class="text-lg text-teal-300 mt-2" data-astro-cid-yjfxgzkf>%</p> <p class="text-zinc-400 mt-2" data-astro-cid-yjfxgzkf>van KMO's gebruikt AI</p> </div> </div> </div> </section>  <section class="content-section applications-section relative overflow-hidden" id="applications" data-astro-cid-yjfxgzkf> <!-- Background Elements --> <div class="absolute inset-0 opacity-20" data-astro-cid-yjfxgzkf> <div class="absolute top-10 left-10 w-32 h-32 bg-teal-400/10 rounded-full blur-xl animate-pulse" data-astro-cid-yjfxgzkf></div> <div class="absolute bottom-20 right-20 w-24 h-24 bg-cyan-400/15 rounded-lg blur-lg" style="animation-delay: 3s;" data-astro-cid-yjfxgzkf></div> </div> <div class="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" data-astro-cid-yjfxgzkf> <div class="relative text-center mb-16 fade-in" data-astro-cid-yjfxgzkf> <h2 class="section-title text-white mb-4" data-astro-cid-yjfxgzkf>
Waar AI Vandaag al het <span class="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent" data-astro-cid-yjfxgzkf>Verschil</span> Maakt
</h2> <p class="section-subtitle max-w-3xl mx-auto" data-astro-cid-yjfxgzkf>
Concrete toepassingen die nu al resultaat opleveren voor kleine en
          middelgrote bedrijven
</p> </div> <!-- Clean Text Blocks Layout --> <div class="relative max-w-3xl mx-auto space-y-8" data-astro-cid-yjfxgzkf> <!-- Customer Communication --> <div class="fade-in" data-astro-cid-yjfxgzkf> <div class="grid md:grid-cols-3 gap-6 items-start" data-astro-cid-yjfxgzkf> <div class="md:col-span-2" data-astro-cid-yjfxgzkf> <div class="flex items-center mb-3" data-astro-cid-yjfxgzkf> <div class="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center mr-3" data-astro-cid-yjfxgzkf> <svg class="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-bold text-white" data-astro-cid-yjfxgzkf>
Klantencommunicatie zonder Grenzen
</h3> </div> <p class="text-zinc-300 text-sm leading-relaxed" data-astro-cid-yjfxgzkf>
Een Brusselse startup gebruikt AI om offertes op te stellen,
                technische vragen te beantwoorden en onderhandelingen voor te
                bereiden. De AI analyseert eerdere gesprekken en leert de
                tone-of-voice van het bedrijf.
</p> </div> <div class="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 text-center" data-astro-cid-yjfxgzkf> <div class="text-teal-400 text-2xl font-bold mb-1" data-astro-cid-yjfxgzkf>3u</div> <div class="text-teal-300 text-xs font-medium" data-astro-cid-yjfxgzkf>
tijdswinst per dag
</div> </div> </div> </div> <!-- Marketing --> <div class="fade-in" data-astro-cid-yjfxgzkf> <div class="grid md:grid-cols-3 gap-6 items-start" data-astro-cid-yjfxgzkf> <div class="md:col-span-2" data-astro-cid-yjfxgzkf> <div class="flex items-center mb-3" data-astro-cid-yjfxgzkf> <div class="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mr-3" data-astro-cid-yjfxgzkf> <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-bold text-white" data-astro-cid-yjfxgzkf>
Marketing met de Kracht van een Bureau
</h3> </div> <p class="text-zinc-300 text-sm leading-relaxed" data-astro-cid-yjfxgzkf>
AI genereert social media content, schrijft nieuwsbrieven,
                optimaliseert Google Ads en analyseert welke boodschappen
                aanslaan. Een Leuvense bakkerij verdubbelde haar online
                bestellingen.
</p> </div> <div class="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-center" data-astro-cid-yjfxgzkf> <div class="text-cyan-400 text-2xl font-bold mb-1" data-astro-cid-yjfxgzkf>2x</div> <div class="text-cyan-300 text-xs font-medium" data-astro-cid-yjfxgzkf>
meer bestellingen
</div> </div> </div> </div> <!-- Administration --> <div class="fade-in" data-astro-cid-yjfxgzkf> <div class="grid md:grid-cols-3 gap-6 items-start" data-astro-cid-yjfxgzkf> <div class="md:col-span-2" data-astro-cid-yjfxgzkf> <div class="flex items-center mb-3" data-astro-cid-yjfxgzkf> <div class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3" data-astro-cid-yjfxgzkf> <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-bold text-white" data-astro-cid-yjfxgzkf>
Administratie die Zichzelf Doet
</h3> </div> <p class="text-zinc-300 text-sm leading-relaxed" data-astro-cid-yjfxgzkf>
AI scant documenten, stelt contracten op en categoriseert
                automatisch. Een Mechelse vastgoedmakelaar besteedt nu meer tijd
                aan klanten in plaats van paperwork.
</p> </div> <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center" data-astro-cid-yjfxgzkf> <div class="text-green-400 text-2xl font-bold mb-1" data-astro-cid-yjfxgzkf>70%</div> <div class="text-green-300 text-xs font-medium" data-astro-cid-yjfxgzkf>
minder admin tijd
</div> </div> </div> </div> <!-- Innovation --> <div class="fade-in" data-astro-cid-yjfxgzkf> <div class="grid md:grid-cols-3 gap-6 items-start" data-astro-cid-yjfxgzkf> <div class="md:col-span-2" data-astro-cid-yjfxgzkf> <div class="flex items-center mb-3" data-astro-cid-yjfxgzkf> <div class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3" data-astro-cid-yjfxgzkf> <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-bold text-white" data-astro-cid-yjfxgzkf>
Innovatie binnen Handbereik
</h3> </div> <p class="text-zinc-300 text-sm leading-relaxed" data-astro-cid-yjfxgzkf>
Een Limburgse producent voorspelt productiefouten voordat ze
                optreden. AI analyseert machinedata en waarschuwt operators
                preventief.
</p> </div> <div class="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center" data-astro-cid-yjfxgzkf> <div class="text-purple-400 text-lg font-bold mb-1" data-astro-cid-yjfxgzkf>\u20AC50k</div> <div class="text-purple-300 text-xs font-medium" data-astro-cid-yjfxgzkf>
besparing per jaar
</div> </div> </div> </div> </div> <!-- Decorative background elements --> <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-2xl animate-pulse" data-astro-cid-yjfxgzkf></div> <div class="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-xl" style="animation-delay: 2s;" data-astro-cid-yjfxgzkf></div> </div> <!-- CTA at bottom --> <div class="mt-16 text-center" data-astro-cid-yjfxgzkf> <div class="inline-flex items-center space-x-4 glass-card px-8 py-4" data-astro-cid-yjfxgzkf> <div class="flex items-center space-x-2 text-teal-400" data-astro-cid-yjfxgzkf> <div class="w-2 h-2 bg-teal-400 rounded-full animate-pulse" data-astro-cid-yjfxgzkf></div> <span class="text-sm font-mono" data-astro-cid-yjfxgzkf>READY FOR AI</span> </div> `, ' </div> </div> </section>  <section class="content-section" data-astro-cid-yjfxgzkf> <div class="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12" data-astro-cid-yjfxgzkf> <div class="space-y-8 fade-in" data-astro-cid-yjfxgzkf> <h2 class="section-title text-white text-center mb-12" data-astro-cid-yjfxgzkf>\nDe Drempels zijn Lager dan u Denkt\n</h2> <p class="article-text" data-astro-cid-yjfxgzkf>\nDe technologische revolutie van vandaag verschilt fundamenteel van die\n          van gisteren. Waar bedrijven vroeger IT-specialisten moesten inhuren\n          voor basale automatisering, zijn AI-tools nu ontworpen voor gebruikers\n          zonder technische achtergrond.\n</p> <div class="grid md:grid-cols-3 gap-6 my-12" data-astro-cid-yjfxgzkf> <div class="application-card text-center" data-astro-cid-yjfxgzkf> <div class="w-16 h-16 mx-auto mb-4 bg-teal-500/20 rounded-lg flex items-center justify-center" data-astro-cid-yjfxgzkf> <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-semibold text-white mb-2" data-astro-cid-yjfxgzkf>ChatGPT</h3> <p class="text-zinc-400 text-sm" data-astro-cid-yjfxgzkf>Begrijpt gewone spreektaal</p> </div> <div class="application-card text-center" data-astro-cid-yjfxgzkf> <div class="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-lg flex items-center justify-center" data-astro-cid-yjfxgzkf> <svg class="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-semibold text-white mb-2" data-astro-cid-yjfxgzkf>Claude</h3> <p class="text-zinc-400 text-sm" data-astro-cid-yjfxgzkf>Analyseert complete documenten</p> </div> <div class="application-card text-center" data-astro-cid-yjfxgzkf> <div class="w-16 h-16 mx-auto mb-4 bg-teal-500/20 rounded-lg flex items-center justify-center" data-astro-cid-yjfxgzkf> <svg class="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-yjfxgzkf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" data-astro-cid-yjfxgzkf></path> </svg> </div> <h3 class="text-lg font-semibold text-white mb-2" data-astro-cid-yjfxgzkf>Perplexity</h3> <p class="text-zinc-400 text-sm" data-astro-cid-yjfxgzkf>Doorzoekt internet met precisie</p> </div> </div> <div class="quote-box bg-green-500/10 border-green-500" data-astro-cid-yjfxgzkf> <h4 class="text-lg font-semibold text-green-400 mb-2" data-astro-cid-yjfxgzkf>\nDe Kostprijs?\n</h4> <p class="text-zinc-300" data-astro-cid-yjfxgzkf>\nVoor minder dan wat een bedrijf uitgeeft aan koffie voor de\n            werknemers, heeft u toegang tot AI-capaciteit die vijf jaar geleden\n            miljoenen zou kosten. De meeste tools bieden gratis versies om mee\n            te starten, betaalde plannen beginnen vanaf \u20AC20 per maand.\n</p> </div> </div> </div> </section>  <section class="stats-section py-20" data-astro-cid-yjfxgzkf> <div class="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12" data-astro-cid-yjfxgzkf> <div class="space-y-8 fade-in text-center" data-astro-cid-yjfxgzkf> <h2 class="section-title text-white mb-12 mt-12" data-astro-cid-yjfxgzkf>Uw Eerste Stappen</h2> <p class="article-text text-xl" data-astro-cid-yjfxgzkf>\nBegin klein. Kies \xE9\xE9n proces dat tijd vreet maar weinig waarde\n          toevoegt. Experimenteer met een gratis AI-tool. Meet het verschil. Pas\n          aan. Schaal op.\n</p> <div class="grid md:grid-cols-3 gap-6 mt-12" data-astro-cid-yjfxgzkf> <div class="application-card" data-astro-cid-yjfxgzkf> <h4 class="text-lg font-semibold text-teal-400 mb-2" data-astro-cid-yjfxgzkf>\nE-mail Categorisering\n</h4> <p class="text-zinc-400 text-sm" data-astro-cid-yjfxgzkf>AI die uw inbox organiseert</p> </div> <div class="application-card" data-astro-cid-yjfxgzkf> <h4 class="text-lg font-semibold text-cyan-400 mb-2" data-astro-cid-yjfxgzkf>\nBasis Chatbot\n</h4> <p class="text-zinc-400 text-sm" data-astro-cid-yjfxgzkf>Beantwoordt veelgestelde vragen</p> </div> <div class="application-card" data-astro-cid-yjfxgzkf> <h4 class="text-lg font-semibold text-teal-400 mb-2" data-astro-cid-yjfxgzkf>\nMeeting Samenvattingen\n</h4> <p class="text-zinc-400 text-sm" data-astro-cid-yjfxgzkf>\nAutomatische notities van vergaderingen\n</p> </div> </div> <div class="quote-box bg-blue-500/10 border-blue-500" data-astro-cid-yjfxgzkf> <p class="text-blue-300 text-lg" data-astro-cid-yjfxgzkf>\nDe transformatie van uw bedrijf hoeft geen big bang te zijn. Het kan\n            beginnen met \xE9\xE9n kleine, slimme stap.\n</p> </div> </div> </div> </section>  <section class="content-section" data-astro-cid-yjfxgzkf> <div class="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12" data-astro-cid-yjfxgzkf> <div class="space-y-8 fade-in text-center" data-astro-cid-yjfxgzkf> <h2 class="section-title text-white mb-12" data-astro-cid-yjfxgzkf>De Toekomst is Nu</h2> <p class="article-text text-xl leading-relaxed mt-6" data-astro-cid-yjfxgzkf>\nDe digitale kloof van morgen loopt niet tussen bedrijven m\xE9t en zonder\n          computers, maar tussen organisaties die AI omarmen en die dat niet\n          doen.\n</p> <p class="article-text text-2xl font-semibold text-teal-400" data-astro-cid-yjfxgzkf>\nDe keuze is aan u: meebewegen met de golf of erdoor overspoeld worden.\n</p> </div> </div> </section>  ', `  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "De Stille Revolutie waar uw Bedrijf aan Voorbijgaat - AI voor KMO's",
      "description": "Terwijl ChatGPT miljoenen gebruikers telt, worstelen Belgische kmo's nog met de vraag wat AI voor hen kan betekenen. Ontdek concrete voorbeelden en praktische stappen.",
      "author": {
        "@type": "Organization",
        "name": "AI Studio"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Studio",
        "logo": {
          "@type": "ImageObject",
          "url": "https://aistudio.nl/logo.png"
        }
      },
      "datePublished": "2024-01-15",
      "dateModified": "2024-01-15",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://aistudio.nl/ai-voor-bedrijven"
      }
    }
  <\/script> `, " "])), maybeRenderHead(), renderComponent($$result2, "Button", $$Button, { "href": "#intro", "variant": "primary", "size": "lg", "data-astro-cid-yjfxgzkf": true }, { "default": ($$result3) => renderTemplate`
Start uw AI Journey
` }), renderComponent($$result2, "Button", $$Button, { "href": "#leestijd", "variant": "secondary", "size": "lg", "data-astro-cid-yjfxgzkf": true }, { "default": ($$result3) => renderTemplate` <span id="readTime" data-astro-cid-yjfxgzkf>12 min leestijd</span> ` }), renderComponent($$result2, "Button", $$Button, { "href": "/contact", "variant": "primary", "size": "sm", "data-astro-cid-yjfxgzkf": true }, { "default": ($$result3) => renderTemplate`
Start uw AI-transformatie
` }), renderComponent($$result2, "AIConsultationCTA", $$AIConsultationCTA, { "title": "Klaar om de Sprong te Wagen?", "subtitle": "Voor bedrijven die de sprong willen wagen maar niet weten waar te beginnen, organiseren wij vrijblijvende gesprekken. Geen verkooppraatjes, wel concrete voorbeelden en praktische roadmaps.", "primaryButtonText": "Plan een vrijblijvend gesprek", "primaryButtonHref": "/contact", "data-astro-cid-yjfxgzkf": true }), renderScript($$result2, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/ai-voor-bedrijven.astro?astro&type=script&index=0&lang.ts")) })}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/ai-voor-bedrijven.astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/ai-voor-bedrijven.astro";
const $$url = "/ai-voor-bedrijven";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiVoorBedrijven,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
