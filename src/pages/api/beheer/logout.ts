import type { APIRoute } from 'astro';
import { stopSessie } from '../../../lib/beheer';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  stopSessie(cookies);
  return redirect('/beheer/login?status=uitgelogd', 303);
};
