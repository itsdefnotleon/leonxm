CREATE TABLE public.privacy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  contact_email text NOT NULL,
  request_type text NOT NULL CHECK (request_type IN ('access', 'correction', 'portability', 'restriction', 'objection', 'deletion', 'other')),
  details text NOT NULL DEFAULT '' CHECK (length(details) <= 2000),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE ON public.privacy_requests TO authenticated;
GRANT ALL ON public.privacy_requests TO service_role;

ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own privacy requests"
ON public.privacy_requests FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.is_moderator(auth.uid()));

CREATE POLICY "Moderators can update privacy requests"
ON public.privacy_requests FOR UPDATE TO authenticated
USING (public.is_moderator(auth.uid()))
WITH CHECK (public.is_moderator(auth.uid()));

CREATE TRIGGER update_privacy_requests_updated_at
BEFORE UPDATE ON public.privacy_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();