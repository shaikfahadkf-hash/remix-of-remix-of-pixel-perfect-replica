revoke execute on function public.has_role(uuid, app_role) from anon, public;
grant execute on function public.has_role(uuid, app_role) to authenticated;