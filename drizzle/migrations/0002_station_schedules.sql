ALTER TABLE public.stations ADD COLUMN IF NOT EXISTS schedule_api text;
CREATE TABLE public.station_shows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id integer NOT NULL,
  title text NOT NULL,
  host text,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.station_shows TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.station_shows TO authenticated;
GRANT ALL ON public.station_shows TO service_role;
ALTER TABLE public.station_shows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shows are publicly readable" ON public.station_shows FOR SELECT USING (true);
CREATE POLICY "Moderators add shows" ON public.station_shows FOR INSERT TO authenticated WITH CHECK (public.is_moderator(auth.uid()));
CREATE POLICY "Moderators edit shows" ON public.station_shows FOR UPDATE TO authenticated USING (public.is_moderator(auth.uid())) WITH CHECK (public.is_moderator(auth.uid()));
CREATE POLICY "Moderators remove shows" ON public.station_shows FOR DELETE TO authenticated USING (public.is_moderator(auth.uid()));