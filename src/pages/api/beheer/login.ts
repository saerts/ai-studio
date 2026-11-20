// Vraagt een inloglink aan. Het antwoord is altijd hetzelfde, zodat niemand kan
// afleiden welke adressen beheerder zijn.
import type { APIRoute } from 'astro';
import { checkApiRateLimit } from '../../../lib/rate-limit';
import {
  PKCE_COOKIE,
  beheerConfig,
  isBeheerder,
  nieuwePkce,
  stuurInloglink,
} from '../../../lib/beheer';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  const cfg = beheerConfig();
  if (!cfg) return redirect('/beheer/login?status=uit', 303);

  const limiet = await checkApiRateLimit(request);
  if (!limiet.allowed) return redirect('/beheer/login?status=wacht', 303);

  const formulier = await request.formData();
  const email = String(formulier.get('email') ?? '').trim().toLowerCase();

  if (isBeheerder(email)) {
    try {
      const { verifier, challenge } = nieuwePkce();
      cookies.set(PKCE_COOKIE, verifier, {
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        path: '/api/beheer',
        maxAge: 15 * 60,
      });
      await stuurInloglink(cfg, email, challenge, new URL('/api/beheer/callback', url).toString());
    } catch (fout) {
      console.error('[beheer/login]', fout instanceof Error ? fout.message : fout);
      return redirect('/beheer/login?status=fout', 303);
    }
  }
  return redirect('/beheer/login?status=verstuurd', 303);
};
