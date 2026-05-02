import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sparkles } from "lucide-react";

export function PremiumPopup() {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("leonxm-premium-dismissed")) return;
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    sessionStorage.setItem("leonxm-premium-dismissed", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-primary/30 bg-card p-8 shadow-2xl">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!revealed ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-primary uppercase tracking-widest">LeonXM Premium™</p>
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2">Upgrade Required</h2>
            <p className="text-muted-foreground mb-6">
              To continue enjoying LeonXM, please subscribe to our brand new premium plan.
            </p>
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-foreground">$9.99</span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>✓ The same exact radio you had before</li>
                <li>✓ Audio in groundbreaking "stereo"</li>
                <li>✓ The play button now works</li>
                <li>✓ Cancel anytime (you can't)</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRevealed(true)}
                className="flex-1 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Subscribe Now
              </button>
              <button
                onClick={() => setRevealed(true)}
                className="rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                No thanks
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🤡</div>
            <h2 className="text-3xl font-black text-foreground mb-2">Just kidding!</h2>
            <p className="text-muted-foreground mb-6">
              LeonXM is still 100% free. No subscriptions, no ads, no sign-up. Enjoy the music. 🎧
            </p>
            <button
              onClick={close}
              className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Phew, take me to the radio
            </button>
          </>
        )}
      </div>
    </div>
  );
}
