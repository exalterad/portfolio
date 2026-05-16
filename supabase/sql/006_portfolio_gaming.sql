-- Gaming (layout, manuella spel, Steam-inställningar). Kör efter 005_portfolio_experience.sql.

create table if not exists public.portfolio_gaming (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_gaming is 'Portfolio: Gaming-sektion (layout + spel som JSON). Rad id = default.';

alter table public.portfolio_gaming enable row level security;
