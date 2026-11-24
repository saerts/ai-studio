// De bevestigingslink uit de mail. Zet de aanvraag op "aanvraag" en meldt ze aan Steven.
import type { APIRoute } from 'astro';
import {
  bevestigAanvraag,
  roastConfig,
  stuurMeldingNaarSteven,
} from '../../lib/roast-aanvraag';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const cfg = roastConfig();
  const token = url.searchParams.get('token') ?? '';
  if (!cfg || !/^[a-f0-9]{64}$/.test(token)) {
    return redirect('/aanvraag-bevestigd?status=ongeldig', 303);
  }

  try {
    const rij = await bevestigAanvraag(cfg, token);
    if (!rij) {
      return redirect('/aanvraag-bevestigd?status=ongeldig', 303);
    }
    try {
      await stuurMeldingNaarSteven(cfg, rij);
    } catch (fout) {
      // De aanvraag staat bevestigd in de tabel, ook als de melding mislukt.
      console.error('[roast-bevestig] melding', fout instanceof Error ? fout.message : fout);
    }
    return redirect('/aanvraag-bevestigd', 303);
  } catch (fout) {
    console.error('[roast-bevestig]', fout instanceof Error ? fout.message : fout);
    return redirect('/aanvraag-bevestigd?status=fout', 303);
  }
};
