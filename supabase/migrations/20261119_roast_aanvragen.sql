-- Website Roast: aanvragen via het formulier op de site.
-- Toegepast op project fgpoxhkfjuhbpthlxpuw (eu-west-1) op 19 november 2026.

create table if not exists public.roast_aanvragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- wat de aanvrager invult
  website text not null,
  naam text,
  email text not null,
  type text check (type in ('statisch', 'cms', 'webshop', 'weet-niet')),
  bronnen text,
  inspiratie text,
  nota text,
  toestemming text check (toestemming in ('ja', 'nee')),

  -- verificatie van het e-mailadres
  token_hash text unique,
  token_verloopt timestamptz,
  bevestigd_op timestamptz,
  domein_komt_overeen boolean not null default false,

  -- opvolging door Steven
  status text not null default 'onbevestigd' check (
    status in (
      'onbevestigd', 'aanvraag', 'goedgekeurd', 'geweigerd',
      'in-opmaak', 'gepubliceerd', 'verstuurd', 'afgesloten'
    )
  ),
  slug text
);

create index if not exists roast_aanvragen_status_idx
  on public.roast_aanvragen (status, created_at desc);

-- Row Level Security aan, zonder policies: alleen de server (secret key) kan lezen en schrijven.
alter table public.roast_aanvragen enable row level security;
revoke all on table public.roast_aanvragen from anon, authenticated;

comment on table public.roast_aanvragen is
  'Roast-aanvragen van ai-studio44.com. Alleen bereikbaar met de secret key, nooit vanuit de browser.';
