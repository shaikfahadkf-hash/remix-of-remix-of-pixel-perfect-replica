CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- users (profiles)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text, full_name text, phone text, designation text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own or admin read profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE TRIGGER profiles_upd BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.profiles (id, email) SELECT id, email FROM auth.users ON CONFLICT DO NOTHING;

-- generic content tables
CREATE TABLE public.event_tracks (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, description text, icon text, image_url text, sort_order int NOT NULL DEFAULT 0, visible boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.mentors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, designation text, organization text, bio text, image_url text, linkedin_url text, sort_order int NOT NULL DEFAULT 0, visible boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.judges (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, designation text, organization text, bio text, image_url text, linkedin_url text, sort_order int NOT NULL DEFAULT 0, visible boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.winners (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), team_name text NOT NULL, position text, prize text, startup_idea text, image_url text, year int NOT NULL DEFAULT 2026, sort_order int NOT NULL DEFAULT 0, visible boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.gallery (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text, caption text, image_url text NOT NULL, sort_order int NOT NULL DEFAULT 0, visible boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.website_content (key text PRIMARY KEY, value text NOT NULL DEFAULT '', label text, updated_at timestamptz NOT NULL DEFAULT now());

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['event_tracks','mentors','judges','winners','gallery','website_content'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Admins manage" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(),''admin'')) WITH CHECK (public.has_role(auth.uid(),''admin''))', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t || '_upd', t);
  END LOOP;
END $$;
CREATE POLICY "Public read" ON public.website_content FOR SELECT TO anon, authenticated USING (true);
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['event_tracks','mentors','judges','winners','gallery'] LOOP
    EXECUTE format('CREATE POLICY "Public read visible" ON public.%I FOR SELECT TO anon, authenticated USING (visible OR public.has_role(auth.uid(),''admin''))', t);
  END LOOP;
END $$;

INSERT INTO public.website_content (key, label, value) VALUES
 ('hero_tagline','Hero tagline','Nationwide Startup & Innovation Pitch Competition'),
 ('about_text','About section text','SUKHF Pitch Arena 2026 brings together student founders and early-stage startups from across India to pitch their ideas to industry experts, investors and mentors in Hyderabad.'),
 ('contact_email','Contact email','info@sukhf.org'),
 ('contact_phone','Contact phone',''),
 ('venue','Venue','Hyderabad, Telangana')
ON CONFLICT DO NOTHING;

-- super admin: super admins also hold 'admin' so existing admin rules apply
INSERT INTO public.user_roles (user_id, role) SELECT user_id, 'super_admin' FROM public.user_roles WHERE role='admin' ON CONFLICT DO NOTHING;
CREATE POLICY "Super admins add roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Super admins remove roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'super_admin') AND user_id <> auth.uid());
GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE OR REPLACE FUNCTION public.list_admins() RETURNS TABLE(user_id uuid, email text, roles text[])
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.user_id, u.email::text, array_agg(r.role::text ORDER BY r.role::text)
  FROM public.user_roles r JOIN auth.users u ON u.id = r.user_id
  WHERE public.has_role(auth.uid(),'super_admin')
  GROUP BY r.user_id, u.email $$;

CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text, _super boolean)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid; BEGIN
  IF NOT public.has_role(auth.uid(),'super_admin') THEN RAISE EXCEPTION 'Only a super admin can do this'; END IF;
  SELECT id INTO uid FROM auth.users WHERE lower(email) = lower(trim(_email));
  IF uid IS NULL THEN RETURN 'not_found'; END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (uid,'admin') ON CONFLICT DO NOTHING;
  IF _super THEN INSERT INTO public.user_roles(user_id, role) VALUES (uid,'super_admin') ON CONFLICT DO NOTHING; END IF;
  RETURN 'ok';
END $$;
REVOKE EXECUTE ON FUNCTION public.list_admins() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.grant_admin_by_email(text, boolean) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text, boolean) TO authenticated;

ALTER TABLE public.admin_activity_log REPLICA IDENTITY FULL;