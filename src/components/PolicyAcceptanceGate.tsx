import { ReactNode, useEffect, useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PolicyContent } from "@/components/PolicyContent";
import { createPolicyAcceptance, hasCurrentPolicyAcceptance, POLICY_ACCEPTANCE_KEY, POLICY_DATE } from "@/lib/legal-policies";

function readAcceptance() {
  try { return hasCurrentPolicyAcceptance(localStorage.getItem(POLICY_ACCEPTANCE_KEY)); }
  catch { return false; }
}

export function PolicyAcceptanceGate({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(readAcceptance);
  const [checked, setChecked] = useState(false);
  const [reading, setReading] = useState<"privacy" | "terms" | null>(null);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === POLICY_ACCEPTANCE_KEY || event.key === null) {
        setAccepted(readAcceptance());
        setChecked(false);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const accept = () => {
    if (!checked) return;
    try { localStorage.setItem(POLICY_ACCEPTANCE_KEY, createPolicyAcceptance()); }
    catch { /* Allow this visit only when browser storage is unavailable. */ }
    setAccepted(true);
  };

  if (accepted) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlertDialog open>
        <AlertDialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-lg" onEscapeKeyDown={(event) => event.preventDefault()}>
          <AlertDialogHeader>
            <ShieldCheck className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
            <AlertDialogTitle className="text-2xl">{reading ? (reading === "privacy" ? "Privacy Policy" : "Terms of Service") : "leonXM · Updated policies"}</AlertDialogTitle>
            <AlertDialogDescription>
              {reading ? "Review the policy below before accepting." : `Updated ${POLICY_DATE}. Please review and accept both policies to continue.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {reading ? (
            <>
              <PolicyContent policy={reading} />
              <Button variant="outline" onClick={() => setReading(null)}><ArrowLeft className="mr-2 h-4 w-4" />Back to acceptance</Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground leading-relaxed">The policies now cover chat accounts, stored public messages, AI answers and moderator actions. Listening remains free and does not require an account.</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setReading("privacy")}>Read Privacy Policy</Button>
                <Button variant="outline" onClick={() => setReading("terms")}>Read Terms of Service</Button>
              </div>
              <div className="flex items-start gap-3 py-2">
                <Checkbox id="accept-policies" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
                <label htmlFor="accept-policies" className="text-sm leading-relaxed cursor-pointer">I accept the Terms of Service and acknowledge and accept the Privacy Policy dated {POLICY_DATE}.</label>
              </div>
              <Button disabled={!checked} onClick={accept}>Accept and continue</Button>
              <p className="text-xs text-muted-foreground">If you disagree, close this page. Acceptance is saved in this browser when storage is available; new policy versions require acceptance again.</p>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}