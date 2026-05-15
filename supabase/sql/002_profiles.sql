-- Profiler + roller (kopplas till Supabase Auth).
-- Kör i SQL Editor efter att Auth är aktiverat i projektet.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Användarprofiler; roll styr admin-rättigheter på sajten.';

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Ny användare → rad med roll user (sätts av trigger nedan).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Om Postgres klagar på "procedure", prova i stället:
--   execute function public.handle_new_user();
