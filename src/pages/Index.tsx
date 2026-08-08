import { channels } from "@/lib/channels";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { ChannelCard } from "@/components/ChannelCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Radio, Headphones, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FeaturedHero } from "@/components/FeaturedHero";

const Index = () => {
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="LeonXM — Free Online Radio, 24/7"
        description="LeonXM is a free internet radio network with curated stations streaming live around the clock. No subscriptions, no ads, no sign-up."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "LeonXM",
          url: "https://leonxm.lovable.app/",
        }}
      />
      <Header />

      {/* Featured station of the moment */}
      <FeaturedHero />

      <section className="relative">
        {/* Stats strip */}
        <div className="relative border-b border-border/60 bg-card/30 backdrop-blur">
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
