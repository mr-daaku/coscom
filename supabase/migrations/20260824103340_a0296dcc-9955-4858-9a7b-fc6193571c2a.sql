CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Super Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_users TO service_role;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access to admin_users"
  ON public.admin_users FOR SELECT TO authenticated USING (false);

INSERT INTO public.admin_users (username, password_hash, role)
VALUES ('BABA-DAAKU', extensions.crypt('BABATILLU-TO-BABADAAKU', extensions.gen_salt('bf', 10)), 'Super Admin');

CREATE OR REPLACE FUNCTION public.verify_admin_login(_username TEXT, _password TEXT)
RETURNS TABLE (username TEXT, role TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT a.username, a.role
  FROM public.admin_users a
  WHERE a.username = _username
    AND a.password_hash = extensions.crypt(_password, a.password_hash);
$$;

REVOKE ALL ON FUNCTION public.verify_admin_login(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_admin_login(TEXT, TEXT) TO anon, authenticated, service_role;