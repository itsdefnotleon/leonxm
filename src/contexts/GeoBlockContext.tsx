import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { Channel } from "@/lib/channels";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe2 } from "lucide-react";

interface GeoBlockContextType {
  showBlock: (channel: Channel) => void;
}

const GeoBlockContext = createContext<GeoBlockContextType | null>(null);

const countryName = (code: string) => {
  const map: Record<string, string> = { GB: "United Kingdom", SE: "Sweden" };
  return map[code] ?? code;
};

export function GeoBlockProvider({ children }: { children: ReactNode }) {
  const [blocked, setBlocked] = useState<Channel | null>(null);

  const showBlock = useCallback((channel: Channel) => {
    setBlocked(channel);
  }, []);

  const allowed = blocked?.geoRestricted ?? [];

  return (
    <GeoBlockContext.Provider value={{ showBlock }}>
      {children}
      <Dialog open={!!blocked} onOpenChange={(open) => !open && setBlocked(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Globe2 className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">
              {blocked?.name} isn't available in your region
            </DialogTitle>
            <DialogDescription className="text-center">
              Due to licensing, {blocked?.name} can only be streamed from{" "}
              <span className="font-semibold text-foreground">
                {allowed.map(countryName).join(" and ")}
              </span>
              . Sorry about that — plenty of other channels are still free to enjoy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setBlocked(null)} className="rounded-full px-6">
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </GeoBlockContext.Provider>
  );
}

export function useGeoBlock() {
  const ctx = useContext(GeoBlockContext);
  if (!ctx) throw new Error("useGeoBlock must be used within GeoBlockProvider");
  return ctx;
}
