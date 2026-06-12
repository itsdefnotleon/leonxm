import { channels } from "@/lib/channels";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { ChannelCard } from "@/components/ChannelCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Radio, Headphones, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero: asymmetric editorial split */}
      <section className="relative overflow-hidden">
        {/* Ambient gradient drift */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: oversized headline */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 backdrop-blur px-3 py-1.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Streaming Live · {channels.length} Channels
              </span>
            </div>

            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95] tracking-tight text-foreground">
              Tune in to the
              <span className="block bg-gradient-to-r from-primary via-indigo-400 to-primary bg-clip-text text-transparent">
                after&#8209;hours.
              </span>
            </h1>

            <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
              LeonXM is a free internet radio network — three handpicked stations broadcasting around the clock. No subscriptions, no ads, no sign-up.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to={`/channel/${channels[0].id}`}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
              >
                Start Listening
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/channels"
                className="inline-flex items-center gap-2 border border-border bg-card/60 backdrop-blur px-6 py-3.5 rounded-full font-semibold text-sm text-foreground hover:bg-card transition-colors"
              >
                Browse all channels
              </Link>
            </div>
          </div>

          {/* Right: on-air dial visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-2xl" />
              <div className="relative w-full h-full rounded-full border border-border bg-card/60 backdrop-blur-xl flex items-center justify-center overflow-hidden">
                {/* concentric rings */}
                <div className="absolute inset-6 rounded-full border border-border/60" />
                <div className="absolute inset-14 rounded-full border border-border/40" />
                <div className="absolute inset-24 rounded-full border border-primary/20" />
                {/* tick marks */}
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-3 h-2 w-px bg-muted-foreground/30 origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${i * 10}deg)`, transformOrigin: "50% calc(100% - 12px + 0px)" }}
                  />
                ))}
                {/* center */}
                <div className="relative z-10 text-center px-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">On Air</p>
                  <p className="mt-2 text-6xl font-black text-foreground leading-none">24/7</p>
                  <p className="mt-2 text-xs text-muted-foreground">LeonXM Network</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Live · No ads · Free</p>
                  <div className="mt-4 flex items-end justify-center gap-1 h-6">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 bg-primary rounded-full eq-bar"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
                {/* glow pointer */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-8 bg-primary rounded-full shadow-[0_0_20px_hsl(var(--primary))]" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-y border-border/60 bg-card/30 backdrop-blur">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 divide-x divide-border/60">
            {[
              { icon: Radio, label: `${channels.length} Channels`, sub: "Curated" },
              { icon: Headphones, label: "HD Audio", sub: "Crystal clear" },
              { icon: Zap, label: "24/7 Live", sub: "Always on" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-3 px-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground leading-tight">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured channels */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-2">Featured</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Tonight's lineup</h2>
            <p className="text-muted-foreground mt-2">Three stations. One dial. Press play.</p>
          </div>
          <Link
            to="/channels"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isActive={currentChannel?.id === channel.id}
              isPlaying={currentChannel?.id === channel.id && isPlaying}
              onPlay={play}
              onStop={stop}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
