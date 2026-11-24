/**
 * Roast-aanvragen: validatie, opslag in Supabase en mails via Resend.
 * Supabase alleen volstaat om aanvragen te bewaren. Met RESEND_API_KEY erbij komt de e-mailverificatie.
 * Alleen op de server. De sleutels komen uit omgevingsvariabelen en bereiken de browser nooit.
 */
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';

const leegNaarNiets = (v: unknown) =>
  typeof v === 'string' && v.trim() === '' ? undefined : v;

const tekst = (max: number) =>
  z.preprocess(leegNaarNiets, z.string().trim().max(max).optional());

export const aanvraagSchema = z.object({
  website: z
    .string()
    .trim()
    .min(4, 'Vul het adres van je website in.')
    .max(300)
    .transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`))
    .pipe(z.string().url('Dat lijkt geen geldig webadres.')),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Vul een geldig e-mailadres in.')
    .max(200),
  name: tekst(120),
  type: z.preprocess(
    leegNaarNiets,
    z.enum(['statisch', 'cms', 'webshop', 'weet-niet']).optional()
  ),
  bronnen: tekst(3000),
  inspiratie: tekst(3000),
  nota: tekst(3000),
  toestemming: z.preprocess(leegNaarNiets, z.enum(['ja', 'nee']).optional()),
});

export type Aanvraag = z.infer<typeof aanvraagSchema>;

export interface AanvraagRij {
  id: string;
  created_at: string;
  website: string;
  naam: string | null;
  email: string;
  type: string | null;
  bronnen: string | null;
  inspiratie: string | null;
  nota: string | null;
  toestemming: string | null;
  domein_komt_overeen: boolean;
  status: string;
}

function env(naam: string): string | undefined {
  const waarde =
    (import.meta.env as Record<string, string | undefined>)[naam] ??
    (typeof process !== 'undefined' ? process.env[naam] : undefined);
  return waarde && waarde.trim() !== '' ? waarde.trim() : undefined;
}

export interface RoastConfig {
  supabaseUrl: string;
  supabaseKey: string;
  /** Ontbreekt deze, dan worden aanvragen bewaard zonder e-mailverificatie. */
  resendKey?: string | undefined;
  mailVan: string;
  meldingNaar: string;
}

/** Geeft null zolang Supabase niet ingesteld is. Het formulier valt dan terug op Web3Forms. */
export function roastConfig(): RoastConfig | null {
  const supabaseUrl = env('SUPABASE_URL');
  // De Vercel-integratie van Supabase zet SUPABASE_SECRET_KEY of, bij oudere projecten, SUPABASE_SERVICE_ROLE_KEY.
  const supabaseKey =
    env('SUPABASE_SECRET_KEY') ?? env('SUPABASE_SERVICE_ROLE_KEY');
  const resendKey = env('RESEND_API_KEY');
  if (!supabaseUrl || !supabaseKey) return null;
  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ''),
    supabaseKey,
    resendKey,
    mailVan: env('ROAST_MAIL_FROM') ?? 'AI-Studio44 <hi@ai-studio44.com>',
    meldingNaar: env('ROAST_NOTIFY_TO') ?? 'hi@ai-studio44.com',
  };
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function nieuwToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('hex');
  return { token, hash: hashToken(token) };
}

/** Hoort het e-mailadres bij hetzelfde domein als de website? Een hint voor Steven, geen blokkade. */
export function domeinKomtOvereen(email: string, website: string): boolean {
  try {
    const host = new URL(website).hostname.replace(/^www\./, '').toLowerCase();
    const mail = email.split('@')[1]?.toLowerCase() ?? '';
    if (!mail) return false;
    return mail === host || mail.endsWith(`.${host}`) || host.endsWith(`.${mail}`);
  } catch {
    return false;
  }
}

function supabaseHeaders(cfg: RoastConfig): Record<string, string> {
  return {
    apikey: cfg.supabaseKey,
    authorization: `Bearer ${cfg.supabaseKey}`,
    'content-type': 'application/json',
  };
}

export async function bewaarAanvraag(
  cfg: RoastConfig,
  aanvraag: Aanvraag,
  /** null = geen verificatie mogelijk, de aanvraag telt meteen */
  tokenHash: string | null
): Promise<void> {
  const verloopt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/roast_aanvragen`, {
    method: 'POST',
    headers: { ...supabaseHeaders(cfg), prefer: 'return=minimal' },
    body: JSON.stringify({
      website: aanvraag.website,
      naam: aanvraag.name ?? null,
      email: aanvraag.email,
      type: aanvraag.type ?? null,
      bronnen: aanvraag.bronnen ?? null,
      inspiratie: aanvraag.inspiratie ?? null,
      nota: aanvraag.nota ?? null,
      toestemming: aanvraag.toestemming ?? null,
      token_hash: tokenHash,
      token_verloopt: tokenHash ? verloopt : null,
      status: tokenHash ? 'onbevestigd' : 'aanvraag',
      domein_komt_overeen: domeinKomtOvereen(aanvraag.email, aanvraag.website),
    }),
  });
  if (!res.ok) {
    throw new Error(`Supabase insert mislukt (${res.status})`);
  }
}

/** Zet een onbevestigde aanvraag op "aanvraag". Geeft de rij terug, of null bij een ongeldige of verlopen link. */
export async function bevestigAanvraag(
  cfg: RoastConfig,
  token: string
): Promise<AanvraagRij | null> {
  const nu = new Date().toISOString();
  const query = new URLSearchParams({
    token_hash: `eq.${hashToken(token)}`,
    status: 'eq.onbevestigd',
    token_verloopt: `gt.${nu}`,
  });
  const res = await fetch(`${cfg.supabaseUrl}/rest/v1/roast_aanvragen?${query}`, {
    method: 'PATCH',
    headers: { ...supabaseHeaders(cfg), prefer: 'return=representation' },
    body: JSON.stringify({ status: 'aanvraag', bevestigd_op: nu, token_hash: null }),
  });
  if (!res.ok) {
    throw new Error(`Supabase update mislukt (${res.status})`);
  }
  const rijen = (await res.json()) as AanvraagRij[];
  return rijen[0] ?? null;
}

function esc(waarde: string | null | undefined): string {
  return (waarde ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function stuurMail(
  cfg: RoastConfig,
  mail: {
    naar: string;
    onderwerp: string;
    html: string;
    tekst: string;
    antwoordNaar?: string;
  }
): Promise<void> {
  if (!cfg.resendKey) {
    throw new Error('RESEND_API_KEY ontbreekt');
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${cfg.resendKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: cfg.mailVan,
      to: [mail.naar],
      subject: mail.onderwerp,
      html: mail.html,
      text: mail.tekst,
      ...(mail.antwoordNaar ? { reply_to: mail.antwoordNaar } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend mislukt (${res.status})`);
  }
}

export async function stuurBevestigingsmail(
  cfg: RoastConfig,
  aanvraag: Aanvraag,
  link: string
): Promise<void> {
  const aanhef = aanvraag.name ? `Dag ${aanvraag.name},` : 'Dag,';
  await stuurMail(cfg, {
    naar: aanvraag.email,
    onderwerp: 'Bevestig je roast-aanvraag',
    tekst: `${aanhef}\n\nJe vroeg een roast aan voor ${aanvraag.website}. Bevestig je aanvraag via deze link:\n${link}\n\nDe link blijft 7 dagen geldig. Heb je dit niet aangevraagd? Dan hoef je niets te doen.\n\nAI-Studio44`,
    html: `<p>${esc(aanhef)}</p>
<p>Je vroeg een roast aan voor <strong>${esc(aanvraag.website)}</strong>. Bevestig je aanvraag met de knop hieronder.</p>
<p><a href="${esc(link)}" style="display:inline-block;background:#E4002B;color:#ffffff;padding:14px 22px;font-weight:700;text-decoration:none">Bevestig mijn aanvraag</a></p>
<p style="color:#555555;font-size:14px">De link blijft 7 dagen geldig. Heb je dit niet aangevraagd? Dan hoef je niets te doen.</p>
<p>AI-Studio44</p>`,
  });
}

export async function stuurMeldingNaarSteven(
  cfg: RoastConfig,
  rij: AanvraagRij
): Promise<void> {
  const regels: [string, string | null][] = [
    ['Website', rij.website],
    ['Naam', rij.naam],
    ['E-mail', rij.email],
    ['Domein komt overeen', rij.domein_komt_overeen ? 'ja' : 'NEE, kijk dit na'],
    ['Type', rij.type],
    ['Bronnen', rij.bronnen],
    ['Inspiratie', rij.inspiratie],
    ['Nota', rij.nota],
    ['Resultaat tonen', rij.toestemming],
  ];
  await stuurMail(cfg, {
    naar: cfg.meldingNaar,
    antwoordNaar: rij.email,
    onderwerp: `Roast-aanvraag: ${rij.website}`,
    tekst: regels.map(([k, v]) => `${k}: ${v ?? '-'}`).join('\n'),
    html: `<p>Nieuwe bevestigde roast-aanvraag.</p><table cellpadding="6" style="border-collapse:collapse">${regels
      .map(
        ([k, v]) =>
          `<tr><td style="border-bottom:1px solid #dddddd;font-weight:700;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #dddddd;white-space:pre-wrap">${esc(v ?? '-')}</td></tr>`
      )
      .join('')}</table>`,
  });
}
