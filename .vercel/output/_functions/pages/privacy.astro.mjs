/* empty css                                             */
import { c as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_X5whkWjU.mjs';
import 'kleur/colors';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_Dm3TLDtu.mjs';
export { renderers } from '../renderers.mjs';

const $$Privacy = createComponent(($$result, $$props, $$slots) => {
  const seoProps = {
    title: "Privacybeleid | AI Studio",
    description: "Lees het privacybeleid van AI Studio: welke gegevens we verzamelen, waarom, hoelang we die bewaren en welke rechten je hebt.",
    canonical: "https://ai-studio44.com/privacy",
    type: "article"
  };
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { ...seoProps }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="mx-auto max-w-4xl px-6 py-24 sm:py-32"> <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Privacybeleid</h1> <p class="mt-4 text-zinc-300 leading-relaxed">
Laatst bijgewerkt: 28 september 2025
</p> <div class="prose prose-invert prose-lg mt-10 text-zinc-300 leading-relaxed [&_a]:text-primary-400 [&_a:hover]:text-primary-300 [&>h2]:mt-12 [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:tracking-tight [&_p]:my-4 [&_ul]:my-4 [&_li]:my-1"> <p>
Bij AI Studio hechten we veel belang aan je privacy. In dit
        privacybeleid leggen we uit welke persoonsgegevens we verzamelen, waarom
        we dat doen en hoe we ze beveiligen. We verwerken je gegevens conform de
        Algemene Verordening Gegevensbescherming (AVG/GDPR).
</p> <h2>1. Verwerkingsverantwoordelijke</h2> <p>
AI-Studio44 — Schilde, BE. Voor vragen over dit beleid kan je ons
        bereiken via
<a href="mailto:hi@ai-studio44.com">hi@ai-studio44.com</a>.
</p> <h2>2. Welke gegevens verzamelen we?</h2> <ul> <li>
Contactgegevens zoals naam, e-mailadres en telefoonnummer wanneer je
          een formulier invult of ons mailt.
</li> <li>
Gebruiksgegevens zoals bezochte pagina’s, tijdstippen en
          apparaat-informatie (via cookies/analytics).
</li> <li>Communicatie-inhoud wanneer je ons een bericht stuurt.</li> </ul> <h2>3. Waarom verwerken we je gegevens?</h2> <ul> <li>Om je vraag te beantwoorden en onze diensten te leveren.</li> <li>Om onze website te verbeteren en prestaties te analyseren.</li> <li>
Om je op de hoogte te houden van relevante updates (alleen met
          toestemming).
</li> </ul> <h2>4. Rechtsgrond</h2> <p>
We verwerken jouw gegevens op basis van legitiem belang, uitvoering van
        een overeenkomst of jouw expliciete toestemming.
</p> <h2>5. Bewaartermijnen</h2> <p>
We bewaren persoonsgegevens niet langer dan noodzakelijk voor het doel
        waarvoor ze zijn verzameld, tenzij een langere bewaartermijn wettelijk
        verplicht is.
</p> <h2>6. Delen met derden</h2> <p>
We delen je gegevens niet met derden, behalve met betrouwbare verwerkers
        die ons helpen onze diensten te leveren (zoals hosting en analytics), en
        enkel wanneer dat noodzakelijk is en onder een verwerkersovereenkomst.
</p> <h2>7. Cookies</h2> <p>
Onze website kan gebruik maken van functionele en analytische cookies.
        Waar wettelijk vereist, vragen we vooraf om toestemming.
</p> <h2>8. Jouw rechten</h2> <ul> <li>Recht op inzage, correctie en verwijdering</li> <li>Recht op beperking of bezwaar tegen verwerking</li> <li>Recht op gegevensoverdraagbaarheid</li> <li>Recht om toestemming in te trekken</li> </ul> <p>
Om één van deze rechten uit te oefenen, mail naar <a href="mailto:hi@ai-studio44.com">hi@ai-studio44.com</a>.
</p> <h2>9. Beveiliging</h2> <p>
We nemen passende technische en organisatorische maatregelen om je
        gegevens te beschermen tegen verlies of onrechtmatige verwerking.
</p> <h2>10. Wijzigingen</h2> <p>
We kunnen dit beleid van tijd tot tijd wijzigen. De meest recente versie
        staat altijd op deze pagina.
</p> </div> </section> ` })}`;
}, "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/privacy.astro", void 0);

const $$file = "/Users/saerts/Sites/WEBMASTER/sa_LIVE/sa73/AI-Studio/ai-studio/src/pages/privacy.astro";
const $$url = "/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
