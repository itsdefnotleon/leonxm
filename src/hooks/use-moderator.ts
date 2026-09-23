import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

/** True when the signed-in user is a station moderator or admin. */
export function useModerator() {
  const { user } = useAuth();
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setIsModerator(false);
      return;
    }

    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (cancelled) return;
        const roles = (data ?? []).map((r) => r.role as string);
        setIsModerator(roles.includes("moderator") || roles.includes("admin"));
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return isModerator;
}
