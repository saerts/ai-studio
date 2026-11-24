// Waar de inloglink uitkomt. Wisselt de code in en start de sessie.
import type { APIRoute } from 'astro';
import {
  PKCE_COOKIE,
  beheerConfig,
  isBeheerder,
  startSessie,
  wisselCode,
} from '../../../lib/beheer';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const cfg = beheerConfig();
  const code = url.searchParams.get('code');
  const verifier = cookies.get(PKCE_COOKIE)?.value;
  cookies.delete(PKCE_COOKIE, { path: '/api/beheer' });

  if (!cfg || !code || !verifier) {
    return redirect('/beheer/login?status=ongeldig', 303);
  }
  try {
    const email = await wisselCode(cfg, code, verifier);
    if (!isBeheerder(email)) {
      return redirect('/beheer/login?status=ongeldig', 303);
    }
    startSessie(cfg, cookies, email as string);
    return redirect('/beheer', 303);
  } catch (fout) {
    console.error('[beheer/callback]', fout instanceof Error ? fout.message : fout);
    return redirect('/beheer/login?status=ongeldig', 303);
  }
};
