create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

-- The first signed-in account to claim becomes super admin; afterwards nobody else can.
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
revoke execute on function public.claim_first_admin() from anon, public;
grant execute on function public.claim_first_admin() to authenticated;

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  team_name text not null,
  leader_name text not null,
  email text not null,
  phone text not null,
  college text not null,
  stage text not null,
  team_size int not null default 1,
  deck_path text,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  notes text
);
grant insert on public.registrations to anon, authenticated;
grant select, update, delete on public.registrations to authenticated;
grant all on public.registrations to service_role;
alter table public.registrations enable row level security;
create policy "Anyone can register" on public.registrations for insert to anon, authenticated
  with check (status = 'pending' and payment_status = 'unpaid' and notes is null);
create policy "Admins read registrations" on public.registrations for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update registrations" on public.registrations for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete registrations" on public.registrations for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  fee int not null default 499,
  deadline timestamptz not null default '2026-10-07T23:59:59+05:30',
  registrations_open boolean not null default true,
  announcement text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "Public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins update settings" on public.site_settings for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));
insert into public.site_settings (id) values (1);

create policy "Anyone can upload decks" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'pitch-decks');
create policy "Admins read decks" on storage.objects for select to authenticated
  using (bucket_id = 'pitch-decks' and public.has_role(auth.uid(), 'admin'));