import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function displayNameOf(user: User | null): string {
  if (!user) return "";
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const name =
    (meta?.display_name as string) ||
    (meta?.full_name as string) ||
    (meta?.name as string) ||
    user.email?.split("@")[0] ||
    "Listener";
  return String(name).slice(0, 40);
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
      if (s?.user) {
        // keep a public display name available for chat
        setTimeout(() => {
          supabase
            .from("profiles")
            .upsert({ id: s.user.id, display_name: displayNameOf(s.user) }, { onConflict: "id" })
            .then(() => {});
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}
