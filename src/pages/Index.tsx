import { channels } from "@/lib/channels";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { ChannelCard } from "@/components/ChannelCard";
import { PlayerBar } from "@/components/PlayerBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Radio, Headphones, Zap } from "lucide-react";

const Index = () => {
  const { currentChannel, isPlaying, volume, play, stop, togglePlayPause, changeVolume } = useAudioPlayer();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-7xl font-black text-foreground tracking-tight leading-none mb-6">
              Listen<span className="text-primary">.</span><br />
              Anytime<span className="text-primary">.</span><br />
              Free<span className="text-primary">.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Curated radio channels streaming 24/7. No subscriptions, no ads, no sign-up required.
            </p>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                <span>{channels.length} Channels</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-primary" />
                <span>HD Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>24/7 Live</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Channels */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">All Channels</h2>
          <p className="text-muted-foreground text-sm mt-1">Select a channel to start listening</p>
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
      </section>

      {/* Player */}
      <PlayerBar
        channel={currentChannel}
        isPlaying={isPlaying}
        volume={volume}
        onTogglePlayPause={togglePlayPause}
        onStop={stop}
        onVolumeChange={changeVolume}
      />
      <Footer />
    </div>
  );
};

export default Index;
