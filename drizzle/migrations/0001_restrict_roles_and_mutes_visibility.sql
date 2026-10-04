DROP POLICY IF EXISTS "Roles are readable by signed in users" ON public.user_roles;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Mutes are readable by signed in users" ON public.chat_mutes;
CREATE POLICY "Users see own mute, moderators see all" ON public.chat_mutes FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_moderator(auth.uid()));