-- Valfri spegling: en rad per projekt (lätt att se i Table Editor).
-- Kör efter 001_portfolio_projects.sql. Om tabellen saknas används bara JSON-kolumnen som tidigare.

create table if not exists public.portfolio_project_rows (
  slug text primary key,
  payload jsonb not null,
  sort_index int not null default 0,
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_project_rows is 'Portfolio: en rad per projekt (speglar listan i portfolio_projects).';

alter table public.portfolio_project_rows enable row level security;
