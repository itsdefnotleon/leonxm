
-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roles are readable by signed in users"
  ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_moderator(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'moderator') OR public.has_role(_user_id, 'admin')
$$;

-- Pinned messages
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pinned_at timestamptz;

-- Mutes
CREATE TABLE IF NOT EXISTS public.chat_mutes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id integer NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  muted_until timestamptz NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (station_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_mutes TO authenticated;
GRANT ALL ON public.chat_mutes TO service_role;
ALTER TABLE public.chat_mutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mutes are readable by signed in users"
  ON public.chat_mutes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Moderators can mute"
  ON public.chat_mutes FOR INSERT TO authenticated
  WITH CHECK (public.is_moderator(auth.uid()) AND created_by = auth.uid());
CREATE POLICY "Moderators can update mutes"
  ON public.chat_mutes FOR UPDATE TO authenticated
  USING (public.is_moderator(auth.uid())) WITH CHECK (public.is_moderator(auth.uid()));
CREATE POLICY "Moderators can unmute"
  ON public.chat_mutes FOR DELETE TO authenticated
  USING (public.is_moderator(auth.uid()));

CREATE TRIGGER update_chat_mutes_updated_at
  BEFORE UPDATE ON public.chat_mutes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_chat_muted(_station_id integer, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_mutes
    WHERE station_id = _station_id AND user_id = _user_id AND muted_until > now()
  )
$$;

-- Chat policies
DROP POLICY IF EXISTS "Signed in users can post" ON public.chat_messages;
CREATE POLICY "Signed in users can post"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND length(btrim(content)) BETWEEN 1 AND 500
    AND NOT public.is_chat_muted(station_id, auth.uid())
  );

CREATE POLICY "Moderators can delete any message"
  ON public.chat_messages FOR DELETE TO authenticated
  USING (public.is_moderator(auth.uid()));

CREATE POLICY "Moderators can pin messages"
  ON public.chat_messages FOR UPDATE TO authenticated
  USING (public.is_moderator(auth.uid())) WITH CHECK (public.is_moderator(auth.uid()));
