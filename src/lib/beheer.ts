/**
 * Beheer van roast-aanvragen: inloggen met een link via Supabase Auth, sessie in een
 * ondertekende cookie, en lezen en wijzigen van de tabel. Alleen op de server.
 *
 * Wie mag inloggen staat in ROAST_ADMIN_EMAILS (door komma's gescheiden).
 * Staat die variabele er niet, dan is het beheer uitgeschakeld.
 */
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { roastConfig, type AanvraagRij, type RoastConfig } from './roast-aanvraag';

export const SESSIE_COOKIE = 'roast_beheer';
export const PKCE_COOKIE = 'roast_pkce';
const SESSIE_DAGEN = 7;

export const AANVRAAG_STATUSSEN = [
  'onbevestigd',
  'aanvraag',
  'goedgekeurd',
  'geweigerd',
  'in-opmaak',
  'gepubliceerd',
  'verstuurd',
  'afgesloten',
] as const;
export type AanvraagStatus = (typeof AANVRAAG_STATUSSEN)[number];

export interface BeheerRij extends AanvraagRij {
  bevestigd_op: string | null;
  slug: string | null;
}

function env(naam: string): string | undefined {
  const waarde =
    (import.meta.env as Record<string, string | undefined>)[naam] ??
    (typeof process !== 'undefined' ? process.env[naam] : undefined);
  return waarde && waarde.trim() !== '' ? waarde.trim() : undefined;
}

export function beheerders(): string[] {
  return (env('ROAST_ADMIN_EMAILS') ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isBeheerder(email: string | null | undefined): boolean {
  return !!email && beheerders().includes(email.trim().toLowerCase());
}

/** Supabase ingesteld en minstens één beheerder: dan staat het beheer aan. */
export function beheerConfig(): RoastConfig | null {
  const cfg = roastConfig();
  return cfg && beheerders().length > 0 ? cfg : null;
}

// ---- sessie -------------------------------------------------------------

function b64url(buf: Buffer): string {
  return buf.toString('base64url');
}

function sleutel(cfg: RoastConfig): Buffer {
  // Afgeleid van de geheime Supabase-sleutel, zodat er geen extra variabele nodig is.
  return createHmac('sha256', cfg.supabaseKey).update('roast-beheer-sessie-v1').digest();
}

function teken(cfg: RoastConfig, inhoud: string): string {
  return b64url(createHmac('sha256', sleutel(cfg)).update(inhoud).digest());
}

export function startSessie(cfg: RoastConfig, cookies: AstroCookies, email: string): void {
  const verloopt = Date.now() + SESSIE_DAGEN * 24 * 60 * 60 * 1000;
  const inhoud = b64url(Buffer.from(JSON.stringify({ e: email.toLowerCase(), x: verloopt })));
  cookies.set(SESSIE_COOKIE, `${inhoud}.${teken(cfg, inhoud)}`, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSIE_DAGEN * 24 * 60 * 60,
  });
}

export function stopSessie(cookies: AstroCookies): void {
  cookies.delete(SESSIE_COOKIE, { path: '/' });
}

/** Geeft het e-mailadres van de ingelogde beheerder, of null. */
export function leesSessie(cfg: RoastConfig, cookies: AstroCookies): string | null {
  const ruw = cookies.get(SESSIE_COOKIE)?.value;
  if (!ruw) return null;
  const [inhoud, handtekening] = ruw.split('.');
  if (!inhoud || !handtekening) return null;
  const verwacht = Buffer.from(teken(cfg, inhoud));
  const gekregen = Buffer.from(handtekening);
  if (verwacht.length !== gekregen.length || !timingSafeEqual(verwacht, gekregen)) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(inhoud, 'base64url').toString('utf8')) as {
      e?: string;
      x?: number;
    };
    if (!data.e || !data.x || data.x < Date.now()) return null;
    // Wie uit ROAST_ADMIN_EMAILS verdwijnt, verliest meteen zijn toegang.
    return isBeheerder(data.e) ? data.e : null;
  } catch {
    return null;
  }
}

// ---- inloggen met een link (Supabase Auth, PKCE) ---------------------------

export function nieuwePkce(): { verifier: string; challenge: string } {
  const verifier = b64url(randomBytes(48));
  const challenge = b64url(createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

function authHeaders(cfg: RoastConfig): Record<string, string> {
  return {
    apikey: cfg.supabaseKey,
    authorization: `Bearer ${cfg.supabaseKey}`,
    'content-type': 'application/json',
  };
}

export async function stuurInloglink(
  cfg: RoastConfig,
  email: string,
  challenge: string,
  terugNaar: string
): Promise<void> {
  const url = new URL(`${cfg.supabaseUrl}/auth/v1/otp`);
  url.searchParams.set('redirect_to', terugNaar);
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(cfg),
    body: JSON.stringify({
      email,
      create_user: true,
      code_challenge: challenge,
      code_challenge_method: 's256',
    }),
  });
  if (!res.ok) {
    throw new Error(`Supabase Auth otp mislukt (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
}

/** Wisselt de code uit de inloglink in en geeft het bevestigde e-mailadres terug. */
export async function wisselCode(
  cfg: RoastConfig,
  code: string,
  verifier: string
): Promise<string | null> {
  const res = await fetch(`${cfg.supabaseUrl}/auth/v1/token?grant_type=pkce`, {
    method: 'POST',
    headers: authHeaders(cfg),
    body: JSON.stringify({ auth_code: code, code_verifier: verifier }),
  });
  if (!res.ok) {
    throw new Error(`Supabase Auth token mislukt (${res.status}): ${(await res.text()).slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    user?: { email?: string; email_confirmed_at?: string | null };
  };
  const email = data.user?.email;
  return email && data.user?.email_confirmed_at ? email.toLowerCase() : null;
}

// ---- de tabel ---------------------------------------------------------------

function dbHeaders(cfg: RoastConfig): Record<string, string> {
  return authHeaders(cfg);
}

export async function lijstAanvragen(cfg: RoastConfig): Promise<BeheerRij[]> {
  const query = new URLSearchParams({
    select:
      'id,created_at,website,naam,email,type,bronnen,inspiratie,nota,toestemming,domein_komt_overeen,status,bevestigd_op,slug',
    order: 'created_at.desc',
    limit: '200',
  });
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/roast_aanvragen?${query}`, {
    headers: dbHeaders(cfg),
  });
  if (!res.ok) throw new Error(`Supabase lezen mislukt (${res.status})`);
  return (await res.json()) as BeheerRij[];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(waarde: unknown): waarde is string {
  return typeof waarde === 'string' && UUID.test(waarde);
}

export function isStatus(waarde: unknown): waarde is AanvraagStatus {
  return (
    typeof waarde === 'string' && (AANVRAAG_STATUSSEN as readonly string[]).includes(waarde)
  );
}

export async function zetStatus(
  cfg: RoastConfig,
  id: string,
  status: AanvraagStatus
): Promise<void> {
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/roast_aanvragen?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...dbHeaders(cfg), prefer: 'return=minimal' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Supabase status wijzigen mislukt (${res.status})`);
}

export async function verwijderAanvraag(cfg: RoastConfig, id: string): Promise<void> {
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/roast_aanvragen?id=eq.${id}`, {
    method: 'DELETE',
    headers: { ...dbHeaders(cfg), prefer: 'return=minimal' },
  });
  if (!res.ok) throw new Error(`Supabase verwijderen mislukt (${res.status})`);
}
