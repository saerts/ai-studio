import type { Roast, RoastStatus } from './types';

const modules = import.meta.glob<{ default: Roast }>('./*/roast.ts', {
  eager: true,
});
const concepten = import.meta.glob<string>('./*/concept.html', {
  query: '?raw',
  import: 'default',
});

/** Statussen waarbij de roast publiek bereikbaar is */
const LIVE: RoastStatus[] = ['gepubliceerd', 'verstuurd'];

export function alleRoasts(): Roast[] {
  return Object.values(modules)
    .map((m) => m.default)
    .sort((a, b) => a.naam.localeCompare(b.naam));
}

export function vindRoast(slug: string | undefined): Roast | undefined {
  return alleRoasts().find((r) => r.slug === slug);
}

export function isLive(roast: Roast): boolean {
  return LIVE.includes(roast.status);
}

/** In ontwikkeling zie je alles, online alleen wat live is */
export function isZichtbaar(roast: Roast): boolean {
  return isLive(roast) || import.meta.env.DEV;
}

export async function conceptVan(slug: string): Promise<string | undefined> {
  const laad = concepten[`./${slug}/concept.html`];
  return laad ? laad() : undefined;
}
