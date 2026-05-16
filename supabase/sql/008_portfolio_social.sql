-- Socialt (rubriker + kanaler). Kör efter 007_portfolio_setup.sql.

create table if not exists public.portfolio_social (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_social is 'Portfolio: innehåll för Socialt-sektionen (JSON). Rad id = default.';

alter table public.portfolio_social enable row level security;
