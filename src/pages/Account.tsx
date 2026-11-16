import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, FileLock2, Loader2, Pencil, ShieldCheck, Trash2 } from "lucide-react";
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
import {
  ACCOUNT_DELETE_CONFIRMATION,
  DISPLAY_NAME_MAX_LENGTH,
  canConfirmAccountDeletion,
  normalizeDisplayName,
} from "@/lib/account-privacy";

const input = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary";

export default function Account() {
  const navigate = useNavigate();
  const { user, session, loading } = useAuth();
  const [busy, setBusy] = useState<"export" | "correct" | "delete" | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (user) setDisplayName(displayNameOf(user));
  }, [user]);

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

  const correctDisplayName = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedName = normalizeDisplayName(displayName);
    if (!normalizedName) {
      toast.error("Enter a display name between 1 and 40 characters.");
      return;
    }
    setBusy("correct");
    try {
      const { error } = await invoke({ action: "correct", displayName: normalizedName });
      if (error) throw error;
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
      setDisplayName(normalizedName);
      toast.success("Your display name and existing chat messages have been updated.");
    } catch {
      toast.error("Could not correct your display name. Please try again.");
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
      <SEO title="Account & Privacy — LeonXM" description="Download or correct your LeonXM data, or permanently delete your account." path="/account" />
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12 pb-32">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">Your information</p>
        <h1 className="text-4xl font-black tracking-tight text-foreground">Account & privacy</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">Use these self-service controls immediately. Nothing here is sent to a moderator queue.</p>

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
                <h2 id="download-data-title" className="text-xl font-bold text-foreground">Access or move your data</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Download a JSON copy straight away. It contains your account details, profile, chat messages, moderation records and any earlier privacy requests. This covers both access and data-portability requests without waiting for the team.</p>
              <Button onClick={downloadData} disabled={busy !== null} className="mt-5">
                {busy === "export" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {busy === "export" ? "Preparing download…" : "Download my data"}
              </Button>
            </section>

            <section aria-labelledby="correct-data-title" className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Pencil className="w-5 h-5 text-primary" />
                <h2 id="correct-data-title" className="text-xl font-bold text-foreground">Correct your display name</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Save a correction immediately. Your profile, account and existing chat messages will all use the corrected name.</p>
              <form onSubmit={correctDisplayName} className="mt-5 space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Display name
                  <input className={`${input} mt-2`} value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={DISPLAY_NAME_MAX_LENGTH} autoComplete="nickname" />
                </label>
                <Button type="submit" disabled={busy !== null || !normalizeDisplayName(displayName)}>
                  {busy === "correct" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4 h-4" />}
                  {busy === "correct" ? "Correcting…" : "Save corrected name"}
                </Button>
              </form>
            </section>

            <section aria-labelledby="processing-choices-title" className="rounded-2xl border border-border bg-card/60 p-6">
              <div className="flex items-center gap-3 mb-3">
                <FileLock2 className="w-5 h-5 text-primary" />
                <h2 id="processing-choices-title" className="text-xl font-bold text-foreground">Restriction and objection choices</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">LeonXM does not use your account information for advertising or third-party marketing, so there is no advertising profile to switch off. To stop account-based processing, use the permanent deletion control below instead of submitting a request.</p>
            </section>

            <section aria-labelledby="delete-account-title" className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <h2 id="delete-account-title" className="text-xl font-bold text-foreground">Delete your account</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Permanently delete your account, profile, chat messages, moderation records and any earlier privacy requests. This cannot be undone. Browser-only preferences stay on your device until you clear them.</p>
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
