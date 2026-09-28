create table public.sponsor_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.sponsor_categories to anon, authenticated;
grant insert, update, delete on public.sponsor_categories to authenticated;
grant all on public.sponsor_categories to service_role;
alter table public.sponsor_categories enable row level security;
create policy "Public read visible categories" on public.sponsor_categories for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "Admins manage categories" on public.sponsor_categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.sponsor_categories(id) on delete set null,
  name text not null,
  logo_url text,
  website_url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  featured boolean not null default false,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.sponsors to anon, authenticated;
grant insert, update, delete on public.sponsors to authenticated;
grant all on public.sponsors to service_role;
alter table public.sponsors enable row level security;
create policy "Public read visible sponsors" on public.sponsors for select to anon, authenticated using (visible or public.has_role(auth.uid(),'admin'));
create policy "Admins manage sponsors" on public.sponsors for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.track_sponsor_click(_id uuid) returns void
language sql security definer set search_path = public as $$
  update public.sponsors set clicks = clicks + 1 where id = _id and visible;
$$;
grant execute on function public.track_sponsor_click(uuid) to anon, authenticated;

insert into public.sponsor_categories (name, sort_order) values
('Title Sponsors',1),('Powered By',2),('Education Partners',3),('Startup Partners',4),('Community Partners',5),('Media Partners',6);