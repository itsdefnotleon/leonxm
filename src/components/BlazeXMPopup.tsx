import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BlazeXMPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer && referrer.includes("blazexm.com")) {
      setOpen(true);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Coming from BlazeXM? Here's the truth.
          </DialogTitle>
          <DialogDescription className="sr-only">
            Information about BlazeXM and why LeonXM is a better choice
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            BlazeXM has <strong className="text-foreground">falsely claimed</strong> to have permission
            from SiriusXM to copy their branding. They don't. It's a lie.
          </p>
          <p>
            On top of that, the owner constantly starts drama and stirs up unnecessary conflict
            in the community. It's exhausting and unprofessional.
          </p>
          <p className="text-foreground font-medium">
            LeonXM is different. We focus on what matters — great stations, reliable streams,
            and zero drama. Welcome to the real deal.
          </p>
        </div>
        <Button onClick={() => setOpen(false)} className="w-full mt-2">
          Start Listening on LeonXM
        </Button>
      </DialogContent>
    </Dialog>
  );
}
