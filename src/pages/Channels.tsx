import { channels } from "@/lib/channels";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { ChannelCard } from "@/components/ChannelCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

export default function Channels() {
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="All Channels — LeonXM"
        description="Browse every LeonXM channel — TruckHits Radio, ilikeRadio, Swarm Radio and more. Free 24/7 streaming, no signup."
        path="/channels"
      />
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-12 pb-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Channels</h1>
          <p className="text-muted-foreground text-sm mt-1">Browse all available channels</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </main>
      <Footer />
    </div>
  );
}
