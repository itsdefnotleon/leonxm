GRANT SELECT, INSERT, UPDATE ON public.stations TO authenticated;
CREATE POLICY "Moderators can add stations" ON public.stations FOR INSERT TO authenticated WITH CHECK (public.is_moderator(auth.uid()));
CREATE POLICY "Moderators can update stations" ON public.stations FOR UPDATE TO authenticated USING (public.is_moderator(auth.uid())) WITH CHECK (public.is_moderator(auth.uid()));