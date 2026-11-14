import { useState } from "react";
import { ArrowRight, BellRing } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { latestServiceUpdate } from "@/lib/articles";

const DISMISSED_UPDATE_KEY = "leonxm-dismissed-service-update";

function wasDismissed(id: string) {
  try {
    return localStorage.getItem(DISMISSED_UPDATE_KEY) === id;
  } catch {
    return false;
  }
}

export function ServiceUpdateNotice() {
  const update = latestServiceUpdate;
  const [open, setOpen] = useState(() => update ? !wasDismissed(update.id) : false);

  if (!update) return null;

  const articlePath = `/news#${update.id}`;
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_UPDATE_KEY, update.id);
    } catch {
      // The notice can still be dismissed for this visit without browser storage.
    }
    setOpen(false);
  };

  return (
    <>
      <section aria-labelledby="service-update-title" className="border-y border-border/60 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-[180px_1fr_auto] md:items-center">
          <img src={update.image} alt="" className="w-full md:w-[180px] rounded-xl border border-border" />
          <div>
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">
              <BellRing className="w-4 h-4" /> Latest service update
            </p>
            <h2 id="service-update-title" className="text-2xl font-bold tracking-tight text-foreground">{update.title}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-3xl leading-relaxed">{update.summary}</p>
            <p className="text-xs text-muted-foreground mt-2">{update.date}</p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link to={articlePath}>Read update <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>

      <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) dismiss(); }}>
        <DialogContent className="max-w-xl overflow-hidden p-0">
          <img src={update.image} alt="Hello Zyphonic, Goodbye Typical Nerds LIVE!" className="w-full border-b border-border" />
          <DialogHeader className="px-6 pt-2">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              <BellRing className="w-4 h-4" /> Latest service update
            </p>
            <DialogTitle className="text-2xl leading-tight">{update.title}</DialogTitle>
            <DialogDescription className="leading-relaxed">{update.summary}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="px-6 pb-6">
            <Button variant="ghost" onClick={dismiss}>Dismiss</Button>
            <Button asChild>
              <Link to={articlePath} onClick={dismiss}>Read full update <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
