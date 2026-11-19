import type { Roast } from '../types';

const roast: Roast = {
  slug: 'quite-frankly',
  naam: 'Quite Frankly',
  url: 'quitefrankly.be',
  status: 'gepubliceerd',
  bron: 'dry',
  datum: '19 november 2026',
  aanhef: 'Quite Frankly, we moeten praten.',
  kop: ['24.600 mensen volgen je op Instagram.', 'Je website weet van niets.'],
  intro:
    'Jullie pastrami is bekroond, de zaak staat in de gidsen en op Instagram loopt het storm. En dan komt iemand op je website terecht. Daar staat een logo, een gevelfoto en een uurrooster dat niet meer klopt.',
  scores: [
    { vak: 'Snelheid', score: 89, oordeel: 'goed' },
    { vak: 'Toegankelijkheid', score: 88, oordeel: 'goed' },
    { vak: 'Best practices', score: 96, oordeel: 'prima' },
    { vak: 'Vindbaarheid', score: 83, oordeel: 'kan beter' },
  ],
  inhoud: { vak: 'Inhoud', oordeel: 'ontbreekt' },
  eerlijk:
    'Eerlijk is eerlijk: technisch zit je goed. Maar een pagina waar bijna niets op staat, laadt altijd snel.',
  opmerkingen: [
    {
      titel: 'Je uurrooster klopt niet meer.',
      tekst:
        'Je website zegt dat je op maandag gesloten bent. Op Instagram staat sinds 2 november dat je 7 op 7 open bent. Wie je website gelooft, blijft op maandag thuis.',
    },
    {
      titel: 'Er staat geen enkel broodje op.',
      tekst:
        'Geen menu, geen pastrami, geen triple decker. Wie niet op Instagram zit, weet niet wat je verkoopt.',
    },
    {
      titel: 'Je website kent je Instagram niet.',
      tekst:
        'Daar staan 152 posts en volgen 24.600 mensen je. Op je website staat er niet eens een link naar.',
    },
    {
      titel: 'Niet gebouwd voor de gsm.',
      tekst:
        'De pagina heeft één vaste breedte en wordt gewoon verkleind. En je klant zoekt je net op straat, op zijn gsm.',
    },
    {
      titel: 'Google krijgt niets om te tonen.',
      tekst:
        'Geen beschrijving, geen hoofdtitel. Google kiest dan zelf wat er onder je naam verschijnt.',
    },
  ],
  slot: 'Een zaak van dit niveau verdient een website van dit niveau.',
  beelden: {
    voorAlt:
      'De huidige website van Quite Frankly: een gevelfoto en een uurrooster met maandag gesloten',
    voorBijschrift: 'Een foto en een uurrooster.',
    naAlt:
      'Het nieuwe ontwerp voor Quite Frankly, met de titel Sandwiches en een foto van de pastrami',
    naBijschrift: 'Jullie zaak, zoals ze is.',
  },
  aanbod:
    "Dit ontwerp is een voorstel. Als het je aanstaat, bouwen we het af met jullie volledige menu en jullie prijzen. Je kan daarna zelf je uren, je specials en je foto's aanpassen. Zonder ons te bellen.",
};

export default roast;
