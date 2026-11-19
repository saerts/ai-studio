// Het conceptontwerp van een roast. Volgt dezelfde status als de roast zelf:
// niet gepubliceerd = niet bereikbaar.
import type { APIRoute } from 'astro';
import { vindRoast, isZichtbaar, conceptVan } from '../../../roasts';

export const GET: APIRoute = async ({ params }) => {
  const roast = vindRoast(params.slug);
  const html = roast && isZichtbaar(roast) ? await conceptVan(roast.slug) : undefined;

  if (!html) {
    return new Response('Niet gevonden', { status: 404 });
  }
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
};
