import { channels } from "@/lib/channels";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { ChannelCard } from "@/components/ChannelCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Sparkles } from "lucide-react";

export default function Originals() {
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();
  const originals = channels.filter((c) => c.original);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="LeonXM Originals — Exclusive Stations"
        description="LeonXM Original Stations: exclusive channels made by LeonXM, including LeonXM Workout and LeonXM Dance. Free 24/7 streaming, no signup."
        path="/originals"
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 pb-32">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            LeonXM Originals
          </span>
          <h1 className="mt-4 text-4xl font-bold text-foreground tracking-tight">Original Stations</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Stations made by us, exclusive to LeonXM, and available nowhere else. Workout, Dance,
            and HipHop kick off the collection — more originals are coming soon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {originals.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isActive={currentChannel?.id === channel.id}
              isPlaying={currentChannel?.id === channel.id && isPlaying}
              onPlay={play}
              onStop={stop}
            />
          ))}

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
            <Sparkles className="w-6 h-6 text-primary mb-3" />
            <p className="font-semibold text-foreground">More originals coming soon</p>
            <p className="text-sm text-muted-foreground mt-1">
              New LeonXM exclusive stations are in the works.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
