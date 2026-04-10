import { useParams, Link } from "react-router-dom";
import { channels } from "@/lib/channels";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Play, Pause, ArrowLeft, Radio, MapPin, Users } from "lucide-react";

const channelDescriptions: Record<number, { tagline: string; description: string; genre: string; location: string }> = {
  1: {
    tagline: "The soundtrack to your haul.",
    description: "TruckHits Radio is the go-to station for Euro Truck Simulator 2 players. Delivering non-stop hit music to keep you company on long virtual hauls across Europe. From chart-toppers to driving anthems, we've got the perfect playlist for every delivery run.",
    genre: "Hit Music / Driving Anthems",
    location: "The Open Road (ETS2)",
  },
  2: {
    tagline: "Bristol's sound. Your station.",
    description: "ilikeRadio is Bristol's very own online radio station, bringing the best music and vibes from the heart of the South West. Celebrating Bristol's rich musical heritage and diverse culture, we're the station that sounds like home.",
    genre: "Mixed / Local Hits",
    location: "Bristol, United Kingdom",
  },
  3: {
    tagline: "Buzz buzz. Powered by chaos.",
    description: "Swarm Radio is the official radio station inspired by the AI VTuber Neuro-sama. Expect the unexpected — a chaotic, entertaining mix of music curated for the swarm. If you know, you know. 🐝",
    genre: "Eclectic / VTuber Culture",
    location: "The Swarm (Online)",
  },
};

const ChannelPage = () => {
  const { id } = useParams();
  const channel = channels.find((c) => c.id === Number(id));
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Channel not found.</p>
      </div>
    );
  }

  const info = channelDescriptions[channel.id];
  const nowPlaying = useNowPlaying(channel.nowPlayingApi);
  const songTitle = nowPlaying?.now_playing?.song?.title || "Loading...";
  const artist = nowPlaying?.now_playing?.song?.artist || "";
  const albumArt = nowPlaying?.now_playing?.song?.art;
  const isThisPlaying = currentChannel?.id === channel.id && isPlaying;

  const handlePlay = () => {
    if (isThisPlaying) {
      stop();
    } else {
      play(channel);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero area */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-primary/3 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-16 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Channels
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Channel art */}
            <div className="relative shrink-0">
              <img
                src={channel.logo}
                alt={channel.name}
                className={`w-48 h-48 rounded-xl object-cover shadow-2xl ${isThisPlaying ? "playing-pulse" : ""}`}
              />
              {isThisPlaying && (
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  LIVE
                </div>
              )}
            </div>

            {/* Channel info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
                Channel {channel.id}
              </p>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-3">
                {channel.name}
              </h1>
              {info && (
                <p className="text-xl text-muted-foreground font-medium mb-6">{info.tagline}</p>
              )}

              {/* Play button */}
              <button
                onClick={handlePlay}
                className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-bold text-base hover:bg-primary/90 transition-colors mb-8"
              >
                {isThisPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 ml-0.5" />
                    Listen Live
                  </>
                )}
              </button>

              {/* Meta info */}
              {info && (
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-primary" />
                    <span>{info.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{info.location}</span>
                  </div>
                  {channel.geoRestricted && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Available in {channel.geoRestricted.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Now Playing section */}
      <section className="max-w-7xl mx-auto px-4 pb-32">
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground mb-6">Now Playing</h2>
          <div className="flex items-center gap-6">
            {albumArt ? (
              <img
                src={albumArt}
                alt="Album art"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-muted flex items-center justify-center">
                <Radio className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">{songTitle}</p>
              {artist && (
                <p className="text-lg text-muted-foreground mt-1 truncate">{artist}</p>
              )}
              {isThisPlaying && (
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-end gap-0.5 h-4">
                    <div className="w-0.5 bg-primary rounded-full eq-bar" />
                    <div className="w-0.5 bg-primary rounded-full eq-bar" />
                    <div className="w-0.5 bg-primary rounded-full eq-bar" />
                  </div>
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">Streaming Live</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About section */}
        {info && (
          <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-foreground mb-4">About {channel.name}</h2>
            <p className="text-muted-foreground leading-relaxed">{info.description}</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ChannelPage;
