import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import blazeProof from "@/assets/blazexm-proof.webp";

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
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Coming from BlazeXM? Here's the truth.
          </DialogTitle>
          <DialogDescription className="sr-only">
            Information about BlazeXM and why LeonXM is a better choice
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              BlazeXM has <strong className="text-foreground">falsely claimed</strong> to have permission
              from SiriusXM to copy their branding. They don't. It's a straight-up lie, and they've
              been repeating it to make themselves look legitimate when they're anything but.
            </p>
            <p>
              The owner, Blaze, is known for constantly stirring up drama and picking fights with
              other creators in the community. Instead of building something worthwhile, they spend
              their time starting beef, being annoying, and dragging everyone into pointless conflicts.
              It's exhausting, immature, and completely unprofessional.
            </p>
            <p>
              Their service itself isn't much better either — unreliable streams, sloppy branding ripped
              straight from SiriusXM, and zero originality. It's a knockoff pretending to be the real thing.
            </p>
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                Don't just take our word for it — here's proof:
              </p>
              <p>
                When asked for proof of SiriusXM's permission, Blaze couldn't provide any. His excuse?
                "Because ur not a blazeXM staff." That's not a reason — that's a cover-up. He also
                claimed to know the bosses at iHeart & Audacy Radio Group and stole Y100's branding
                from iHeart, again claiming he had permission. He didn't.
              </p>
              <img
                src={blazeProof}
                alt="Discord screenshot showing Blaze claiming SiriusXM gave permission but refusing to provide proof"
                className="rounded-lg border border-border w-full"
              />
            </div>
            <p className="text-foreground font-medium">
              LeonXM is different. We built this from the ground up with original branding, quality stations,
              reliable streams, and a community that's actually worth being part of. No drama, no lies,
              no stolen branding — just great radio. Welcome to the real deal.
            </p>
          </div>
        </ScrollArea>
        <Button onClick={() => setOpen(false)} className="w-full mt-2">
          Start Listening on LeonXM
        </Button>
      </DialogContent>
    </Dialog>
  );
}
