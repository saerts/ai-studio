// Wijzigt de status van een aanvraag, of verwijdert ze. Alleen voor een ingelogde beheerder.
import type { APIRoute } from 'astro';
import {
  beheerConfig,
  isStatus,
  isUuid,
  leesSessie,
  verwijderAanvraag,
  zetStatus,
} from '../../../lib/beheer';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  const cfg = beheerConfig();
  if (!cfg || !leesSessie(cfg, cookies)) {
    return redirect('/beheer/login', 303);
  }
  // Alleen formulieren van onze eigen site.
  if (request.headers.get('origin') !== url.origin) {
    return new Response('Verboden', { status: 403 });
  }

  const formulier = await request.formData();
  const id = formulier.get('id');
  const actie = formulier.get('actie');
  if (!isUuid(id)) return redirect('/beheer?melding=fout', 303);

  try {
    if (actie === 'verwijder') {
      if (formulier.get('zeker') !== 'ja') return redirect('/beheer?melding=niet-zeker', 303);
      await verwijderAanvraag(cfg, id);
      return redirect('/beheer?melding=verwijderd', 303);
    }
    const status = formulier.get('status');
    if (!isStatus(status)) return redirect('/beheer?melding=fout', 303);
    await zetStatus(cfg, id, status);
    return redirect('/beheer?melding=bewaard', 303);
  } catch (fout) {
    console.error('[beheer/status]', fout instanceof Error ? fout.message : fout);
    return redirect('/beheer?melding=fout', 303);
  }
};
