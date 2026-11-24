// Ontvangt het aanvraagformulier en bewaart de aanvraag in Supabase.
// Met RESEND_API_KEY: status "onbevestigd" en een bevestigingslink per mail.
// Zonder: status "aanvraag", en het formulier meldt de aanvraag zelf via Web3Forms.
import type { APIRoute } from 'astro';
import { checkApiRateLimit } from '../../lib/rate-limit';
import {
  aanvraagSchema,
  bewaarAanvraag,
  nieuwToken,
  roastConfig,
  stuurBevestigingsmail,
} from '../../lib/roast-aanvraag';

export const prerender = false;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const cfg = roastConfig();
  if (!cfg) {
    // Supabase nog niet ingesteld: het formulier valt terug op Web3Forms.
    return json(503, { ok: false, reden: 'niet-geconfigureerd' });
  }

  const limiet = await checkApiRateLimit(request);
  if (!limiet.allowed) {
    return json(429, {
      ok: false,
      bericht: 'Te veel aanvragen na elkaar. Probeer het over een minuut opnieuw.',
    });
  }

  let invoer: Record<string, unknown>;
  try {
    invoer = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, bericht: 'Ongeldige aanvraag.' });
  }

  // Honeypot: bots krijgen een vriendelijk antwoord en er gebeurt niets.
  if (invoer.botcheck) {
    return json(200, { ok: true });
  }

  const resultaat = aanvraagSchema.safeParse(invoer);
  if (!resultaat.success) {
    return json(400, {
      ok: false,
      bericht: resultaat.error.issues[0]?.message ?? 'Kijk je gegevens na.',
    });
  }

  try {
    if (!cfg.resendKey) {
      await bewaarAanvraag(cfg, resultaat.data, null);
      return json(200, { ok: true, verificatie: false });
    }
    const { token, hash } = nieuwToken();
    await bewaarAanvraag(cfg, resultaat.data, hash);
    const link = new URL('/api/roast-bevestig', request.url);
    link.searchParams.set('token', token);
    await stuurBevestigingsmail(cfg, resultaat.data, link.toString());
    return json(200, { ok: true, verificatie: true });
  } catch (fout) {
    console.error('[roast-aanvraag]', fout instanceof Error ? fout.message : fout);
    return json(502, {
      ok: false,
      bericht:
        'Het versturen is niet gelukt. Probeer het opnieuw of mail je URL naar hi@ai-studio44.com.',
    });
  }
};
