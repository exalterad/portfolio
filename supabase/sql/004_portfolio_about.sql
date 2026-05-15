-- Om mig-text (rubrik + stycken). Kör efter 001_portfolio_projects.sql.

create table if not exists public.portfolio_about (
  id text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_about is 'Portfolio: innehåll för Om mig-sektionen (JSON). Rad id = default.';

alter table public.portfolio_about enable row level security;
