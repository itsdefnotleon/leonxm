DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Chat is publicly readable" ON public.chat_messages;
CREATE POLICY "Visible chat messages are readable" ON public.chat_messages FOR SELECT TO anon, authenticated
USING (
  NOT public.is_chat_muted(station_id, user_id)
  OR auth.uid() = user_id
  OR public.is_moderator(auth.uid())
);
GRANT EXECUTE ON FUNCTION public.is_chat_muted(integer, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_moderator(uuid) TO anon, authenticated;