import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sparkles, Check } from "lucide-react";

const perks: { perk: string; quote: string; author: string }[] = [
  { perk: "The play button now works", quote: "I clicked it and music came out. Life-changing.", author: "Dave, 34" },
  { perk: "Audio in groundbreaking 'stereo'", quote: "Both ears? At the same time?? Witchcraft.", author: "Linda, audiophile" },
  { perk: "Access to the same exact radio you had before", quote: "It's identical, but now I'm paying. Worth it.", author: "Mark, financial advisor" },
  { perk: "A pause button (premium edition)", quote: "Pauses just like the free one but feels more expensive.", author: "Susan" },
  { perk: "Volume slider with 100 different levels", quote: "I counted. There really are 100.", author: "Tom, mathematician" },
  { perk: "Exclusive access to channel numbers 1, 2, and 3", quote: "Numbers 1 through 3?! Insane.", author: "Beth" },
  { perk: "The privilege of being a paying customer", quote: "I feel seen. I feel valued. I feel $9.99 lighter.", author: "Greg" },
  { perk: "Songs play in chronological order from start to finish", quote: "Beginning, middle, then end. Wow.", author: "Karen" },
  { perk: "Bug fixes (we may or may not fix any bugs)", quote: "I have no way of verifying this and that's part of the magic.", author: "Phil" },
  { perk: "Our undying gratitude", quote: "I can feel the gratitude radiating through my speakers.", author: "Maria" },
  { perk: "A refresh button (just press F5, but premium)", quote: "F5 hits different when you've paid for it.", author: "Carlos" },
  { perk: "Channels load in HD (it's the same as before)", quote: "Looks the same. Sounds the same. Costs more. Beautiful.", author: "Janet" },
  { perk: "First in line for features that will never ship", quote: "I've been first in line for 6 months. Couldn't be happier.", author: "Doug" },
  { perk: "A monthly invoice (some say this is a perk)", quote: "I love getting emails about money I've already lost.", author: "Brenda" },
  { perk: "The right to tell people you have LeonXM Premium™", quote: "Nobody asked, but I told them anyway.", author: "Steve" },
];

const Premium = () => {
  const [flipping, setFlipping] = useState(false);

  const handleSubscribe = () => {
    setFlipping(true);
    setTimeout(() => {
      window.location.href = "https://en.wikipedia.org/wiki/Cheese";
    }, 2200);
  };

  if (flipping) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center" style={{ perspective: "1200px" }}>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGRdlqLwTrNwMRpi8X2IiJrfrljUt8CPZHSQ&s"
          alt=""
          className="max-h-[80vh] max-w-[80vw] object-contain"
          style={{
            animation: "flipMan 2s ease-in-out forwards",
            transformStyle: "preserve-3d",
            backfaceVisibility: "visible",
          }}
        />
        <style>{`
          @keyframes flipMan {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(180deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">LeonXM Premium™</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight mb-4">
            Unlock everything<span className="text-primary">.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For just <span className="font-bold text-foreground">$9.99/month</span>, you get an unprecedented list of premium perks. Read what real (totally not made up) subscribers have to say.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {perks.map((p, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="mt-1 w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{p.perk}</h3>
              </div>
              <blockquote className="ml-9 border-l-2 border-primary/30 pl-4 text-muted-foreground italic">
                "{p.quote}"
                <footer className="mt-1 not-italic text-xs text-muted-foreground/70">— {p.author}</footer>
              </blockquote>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-6xl font-black text-foreground">$9.99</span>
            <span className="text-muted-foreground">/ month</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Cancel anytime (you can't)</p>
          <button
            onClick={handleSubscribe}
            className="rounded-full bg-primary px-10 py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Subscribe Now
          </button>
          <div className="mt-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              No thanks, take me back
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Premium;
