import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileLock2, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth, displayNameOf } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  ACCOUNT_DELETE_CONFIRMATION,
  PRIVACY_REQUEST_TYPES,
  canConfirmAccountDeletion,
  type PrivacyRequestType,
} from "@/lib/account-privacy";

type PrivacyRequestRow = Database["public"]["Tables"]["privacy_requests"]["Row"];

const input = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary";

export default function Account() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, session, loading } = useAuth();
  const [busy, setBusy] = useState<"export" | "request" | "delete" | null>(null);
  const [requestType, setRequestType] = useState<PrivacyRequestType>("access");
  const [details, setDetails] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const requests = useQuery({
    queryKey: ["privacy-requests", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("privacy_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PrivacyRequestRow[];
    },
  });

  const invoke = async (body: Record<string, unknown>) => {
    if (!session) throw new Error("Please sign in again.");
    return supabase.functions.invoke("account-privacy", {
      body,
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
  };

  const downloadData = async () => {
    setBusy("export");
    try {
      const { data, error } = await invoke({ action: "export" });
      if (error) throw error;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `leonxm-account-data-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Your account data has been downloaded.");
    } catch {
      toast.error("Could not download your data. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const submitRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("request");
    try {
      const { error } = await invoke({ action: "request", requestType, details });
      if (error) throw error;
      setDetails("");
      await queryClient.invalidateQueries({ queryKey: ["privacy-requests", user?.id] });
      toast.success("Your privacy request has been submitted.");
    } catch {
      toast.error("Could not submit your request. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  const deleteAccount = async () => {
    if (!canConfirmAccountDeletion(deleteConfirmation)) return;
    setBusy("delete");
    try {
      const { error } = await invoke({ action: "delete", confirmation: deleteConfirmation });
      if (error) throw error;
      await supabase.auth.signOut({ scope: "local" }).catch(() => {});
      setDeleteOpen(false);
      toast.success("Your LeonXM account and account-linked data have been deleted.");
      navigate("/", { replace: true });
    } catch {
      toast.error("Could not delete your account. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Account & Privacy — LeonXM" description="Download your LeonXM data, submit a privacy request or delete your account." path="/account" />
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 pb-32">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">Your information</p>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Account & privacy</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">Manage your LeonXM account and the information linked to it.</p>

        {loading ? (
          <div className="mt-12 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin" /> Loading your account…</div>
        ) : !user ? (
          <section className="mt-8 rounded-2xl border border-border bg-card/60 p-6">
            <h2 className="text-xl font-bold text-foreground">Sign in to manage your data</h2>
            <p className="mt-2 text-sm text-muted-foreground">Listening never requires an account. If you joined live chat, sign in to access these controls.</p>
            <Button asChild className="mt-5"><Link to="/auth">Sign in</Link></Button>
          </section>
        ) : (
          <div className="mt-8 space-y-6">
            <section className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{displayNameOf(user)}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-2">Account created {user.created_at ? new Date(user.created_at).toLocaleDateString() : "recently"}</p>
                </div>
              </div>
            </section>

            <section aria-labelledby="download-data-title" className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Download className="w-5 h-5 text-primary" />
                <h2 id="download-data-title" className="text-xl font-bold text-foreground">Download your data</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Get a JSON file containing your account details, profile, chat messages, moderation records and privacy requests.</p>
              <Button onClick={downloadData} disabled={busy !== null} className="mt-5">
                {busy === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {busy === "export" ? "Preparing download…" : "Download my data"}
              </Button>
            </section>

            <section aria-labelledby="privacy-request-title" className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileLock2 className="w-5 h-5 text-primary" />
                <h2 id="privacy-request-title" className="text-xl font-bold text-foreground">Make a privacy request</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Ask us about access, correction, portability, restriction, objection or deletion. Your account email is attached so the team can respond.</p>
              <form onSubmit={submitRequest} className="mt-5 space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Request type
                  <select className={`${input} mt-2`} value={requestType} onChange={(event) => setRequestType(event.target.value as PrivacyRequestType)}>
                    {PRIVACY_REQUEST_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-medium text-foreground">
                  Details <span className="font-normal text-muted-foreground">(optional)</span>
                  <textarea className={`${input} mt-2 min-h-28 resize-y`} value={details} onChange={(event) => setDetails(event.target.value)} maxLength={2000} placeholder="Tell us what you need help with. Do not include your password." />
                </label>
                <Button type="submit" disabled={busy !== null}>
                  {busy === "request" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {busy === "request" ? "Submitting…" : "Submit privacy request"}
                </Button>
              </form>

              {requests.data && requests.data.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <h3 className="text-sm font-bold text-foreground mb-3">Your requests</h3>
                  <div className="space-y-2">
                    {requests.data.map((request) => (
                      <div key={request.id} className="rounded-xl border border-border bg-background/50 p-3 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-foreground">{PRIVACY_REQUEST_TYPES.find((type) => type.value === request.request_type)?.label ?? request.request_type}</span>
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold capitalize text-primary">{request.status.replace("_", " ")}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Submitted {new Date(request.created_at).toLocaleString()}</p>
                        {request.details && <p className="text-muted-foreground mt-2 whitespace-pre-wrap break-words">{request.details}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section aria-labelledby="delete-account-title" className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <h2 id="delete-account-title" className="text-xl font-bold text-foreground">Delete your account</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Permanently delete your account, profile, chat messages, moderation records and privacy requests. This cannot be undone. Browser-only preferences stay on your device until you clear them.</p>
              <AlertDialog open={deleteOpen} onOpenChange={(open) => { setDeleteOpen(open); if (!open) setDeleteConfirmation(""); }}>
                <AlertDialogTrigger asChild><Button variant="destructive" className="mt-5" disabled={busy !== null}>Delete my account</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Permanently delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>This immediately removes your LeonXM account and account-linked data. You cannot undo this action.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <label className="block text-sm font-medium text-foreground">
                    Type {ACCOUNT_DELETE_CONFIRMATION} to confirm
                    <input autoFocus className={`${input} mt-2`} value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} autoComplete="off" />
                  </label>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={busy === "delete"}>Keep my account</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={!canConfirmAccountDeletion(deleteConfirmation) || busy === "delete"}
                      onClick={(event) => { event.preventDefault(); void deleteAccount(); }}
                    >
                      {busy === "delete" ? "Deleting…" : "Delete permanently"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
