import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const BodySchema = z.object({
  action: z.enum(["export", "request", "delete"]),
  requestType: z.enum(["access", "correction", "portability", "restriction", "objection", "deletion", "other"]).optional(),
  details: z.string().trim().max(2000).optional().default(""),
  confirmation: z.string().optional(),
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) return json({ error: "Please sign in again." }, 401);

    const url = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !anonKey || !serviceRoleKey) return json({ error: "Account privacy controls are not configured." }, 500);

    const token = authorization.slice(7);
    const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error: authError } = await authClient.auth.getUser(token);
    if (authError || !user) return json({ error: "Your session is invalid or has expired. Please sign in again." }, 401);

    const parsed = BodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const input = parsed.data;

    const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });

    if (input.action === "export") {
      const [profile, messages, mutes, requests] = await Promise.all([
        admin.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        admin.from("chat_messages").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        admin.from("chat_mutes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        admin.from("privacy_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      const queryError = profile.error || messages.error || mutes.error || requests.error;
      if (queryError) throw queryError;

      return json({
        exportedAt: new Date().toISOString(),
        account: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at,
          displayName: user.user_metadata?.display_name ?? null,
        },
        profile: profile.data,
        chatMessages: messages.data ?? [],
        moderationRecords: mutes.data ?? [],
        privacyRequests: requests.data ?? [],
      });
    }

    if (input.action === "request") {
      if (!input.requestType) return json({ error: "Choose a privacy request type." }, 400);
      if (!user.email) return json({ error: "Your account does not have a contact email." }, 400);
      const { data, error } = await admin.from("privacy_requests").insert({
        user_id: user.id,
        contact_email: user.email,
        request_type: input.requestType,
        details: input.details,
      }).select("id, request_type, status, created_at").single();
      if (error) throw error;
      return json({ ok: true, request: data }, 201);
    }

    if (input.confirmation !== "DELETE") return json({ error: "Type DELETE to confirm permanent account deletion." }, 400);

    const deletions = await Promise.all([
      admin.from("chat_messages").delete().eq("user_id", user.id),
      admin.from("chat_mutes").delete().or(`user_id.eq.${user.id},created_by.eq.${user.id}`),
      admin.from("privacy_requests").delete().eq("user_id", user.id),
      admin.from("profiles").delete().eq("id", user.id),
      admin.from("user_roles").delete().eq("user_id", user.id),
    ]);
    const deletionError = deletions.find((result) => result.error)?.error;
    if (deletionError) throw deletionError;

    const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteUserError) throw deleteUserError;
    return json({ ok: true });
  } catch (error) {
    console.error("account-privacy failed", error);
    return json({ error: "We could not complete that account request. Please try again." }, 500);
  }
});
