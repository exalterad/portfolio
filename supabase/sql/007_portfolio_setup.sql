-- Setup (dator + perifer). Kör efter 006_portfolio_gaming.sql.

create table if not exists public.portfolio_setup (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_setup is 'Portfolio: innehåll för Setup-sektionen (JSON). Rad id = default.';

alter table public.portfolio_setup enable row level security;
