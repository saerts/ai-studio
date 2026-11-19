/**
 * Eén roast = één map in src/roasts/<slug>/ met roast.ts en (optioneel) concept.html.
 * De status bepaalt wat er online staat. Dit is het "dashboard" zolang er geen database is.
 */
export type RoastStatus =
  | 'aanvraag' // binnengekomen, nog niet beslist
  | 'goedgekeurd' // Steven zei ja, de agents mogen starten
  | 'in-opmaak' // rapport en ontwerp worden gemaakt
  | 'gepubliceerd' // online, link kan verstuurd worden
  | 'verstuurd' // link is naar het bedrijf gestuurd
  | 'afgesloten'; // offline: geweigerd, verlopen of klant geworden

/** dry = Steven koos de site zelf uit; website = aanvraag via het formulier */
export type RoastBron = 'dry' | 'website';

export interface Roast {
  slug: string;
  naam: string;
  url: string;
  status: RoastStatus;
  bron: RoastBron;
  /** Datum van de meting, zoals getoond op de pagina */
  datum: string;
  /** Alleen bij bron "website": wie vroeg het aan */
  aanvrager?: { naam: string; email: string; geverifieerd: boolean };
  aanhef: string;
  kop: [string, string];
  intro: string;
  /** Gemeten met Google Lighthouse (PageSpeed Insights), mobiel */
  scores: { vak: string; score: number; oordeel: string }[];
  inhoud: { vak: string; oordeel: string };
  eerlijk: string;
  opmerkingen: { titel: string; tekst: string }[];
  slot: string;
  beelden: {
    voorAlt: string;
    voorBijschrift: string;
    naAlt: string;
    naBijschrift: string;
  };
  aanbod: string;
}
