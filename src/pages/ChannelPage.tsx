import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { channels, requestUrls } from "@/lib/channels";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { ShareButtons } from "@/components/ShareButtons";
import { Play, Pause, ArrowLeft, Radio, MapPin, Users, ArrowRight, Mic2 } from "lucide-react";
import { useGeoCountry, isChannelBlocked } from "@/hooks/use-geo-country";
import { useGeoBlock } from "@/contexts/GeoBlockContext";
import { StationNews } from "@/components/StationNews";

const stationNewsSource: Record<number, "ilikeradio" | "swarmradio"> = {
  2: "ilikeradio",
  3: "swarmradio",
};


const channelDescriptions: Record<number, { tagline: string; description: string; genre: string; location: string }> = {
  1: {
    tagline: "The soundtrack to your haul.",
    description:
      "TruckHits Radio is the go-to station for Euro Truck Simulator 2 players. Delivering non-stop hit music to keep you company on long virtual hauls across Europe. From chart-toppers to driving anthems, we've got the perfect playlist for every delivery run.",
    genre: "Hit Music / Driving Anthems",
    location: "The Open Road (ETS2)",
  },
  2: {
    tagline: "Bristol's sound. Your station.",
    description:
      "ilikeRadio is Bristol's very own online radio station, bringing the best music and vibes from the heart of the South West. Celebrating Bristol's rich musical heritage and diverse culture, we're the station that sounds like home.",
    genre: "Mixed / Local Hits",
    location: "Bristol, United Kingdom",
  },
  3: {
    tagline: "Buzz buzz. Powered by chaos.",
    description:
      "Swarm Radio is the official radio station inspired by the AI VTuber Neuro-sama. Expect the unexpected — a chaotic, entertaining mix of music curated for the swarm. If you know, you know. 🐝",
    genre: "Eclectic / VTuber Culture",
    location: "The Swarm (Online)",
  },
  4: {
    tagline: "All chill non-stop.",
    description:
      "Relax is chill music around the clock — laid-back beats, mellow vocals and easy listening. Whether you're working, studying or winding down for the night, Relax keeps the calm going non-stop.",
    genre: "Chill / Lo-fi / Easy Listening",
    location: "Online",
  },
  5: {
    tagline: "Motivational tunes to get you moving!",
    description:
      "LeonXM Workout is an exclusive LeonXM station dedicated to workout tracks. High-energy music built to keep your pace up — whether you're lifting, running, cycling or pushing through that last set, the playlist keeps the momentum going around the clock.",
    genre: "Workout / High Energy",
    location: "Online",
  },
  6: {
    tagline: "Dance away!",
    description:
      "LeonXM Dance is an exclusive LeonXM station built for the dancefloor. Big room anthems, club classics and non-stop beats streaming 24/7 — wherever you are, the party follows.",
    genre: "Dance / Electronic",
    location: "Online",
  },
  8: {
    tagline: "The songs that made people dance during the 90s",
    description:
      "LeonXM 90s is an exclusive LeonXM station dedicated to the decade of neon, cassette tapes and unforgettable hooks. From dancefloor classics to sing-along anthems, it's the songs that made people dance during the 90s — around the clock.",
    genre: "90s / Dance Classics",
    location: "Online",
  },
};



const ChannelPage = () => {
  const { id } = useParams();
  const channel = channels.find((c) => c.id === Number(id));
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();
  const nowPlaying = useNowPlaying(channel?.nowPlayingApi ?? "");
  const { status: geoStatus, country } = useGeoCountry();
  const { showBlock } = useGeoBlock();
  const blocked = !!channel && isChannelBlocked(channel.geoRestricted, country);

  useEffect(() => {
    if (channel && geoStatus === "ready" && blocked) {
      showBlock(channel);
    }
  }, [channel, geoStatus, blocked, showBlock]);

  if (channel && geoStatus === "ready" && blocked) {
    return <Navigate to="/" replace />;
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Channel not found.</p>
            <Link to="/channels" className="text-primary hover:underline text-sm font-semibold">
              Browse all channels
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const info = channelDescriptions[channel.id];
  const songTitle = nowPlaying?.now_playing?.song?.title || "Loading...";
  const artist = nowPlaying?.now_playing?.song?.artist || "";
  const albumArt = nowPlaying?.now_playing?.song?.art;
  const isThisPlaying = currentChannel?.id === channel.id && isPlaying;

  const handlePlay = () => {
    if (isThisPlaying) stop();
    else play(channel);
  };

  const otherChannels = channels.filter((c) => c.id !== channel.id);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title={`${channel.name} — LeonXM`}
        description={info ? `${info.tagline} ${info.description}` : `Listen to ${channel.name} live on LeonXM — free, 24/7.`}
        path={`/channel/${channel.id}`}
        image={channel.logo}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "RadioStation",
          name: channel.name,
          url: `https://leonxm.lovable.app/channel/${channel.id}`,
          genre: info?.genre,
          areaServed: info?.location,
        }}
      />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[120px]" />
          {albumArt && (
            <img
              src={albumArt}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl scale-110"
            />
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-20">
          <Link
            to="/channels"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            All channels
          </Link>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Artwork */}
            <div className="lg:col-span-5">
              <div className="relative max-w-sm mx-auto lg:mx-0">
                <div className="absolute -inset-6 rounded-3xl bg-primary/20 blur-2xl" />
                <div
                  className={`relative aspect-square rounded-3xl overflow-hidden border border-border bg-card shadow-2xl ${
                    isThisPlaying ? "playing-pulse" : ""
                  }`}
                >
                  <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                  {isThisPlaying && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                      On Air
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-3">
                Channel {channel.id} · LeonXM
              </p>
              <h1 className="text-5xl sm:text-6xl font-black text-foreground tracking-tight leading-[0.95]">
                {channel.name}
              </h1>
              {info && (
                <p className="text-xl text-muted-foreground font-medium mt-4 max-w-xl">{info.tagline}</p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={handlePlay}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
                >
                  {isThisPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 ml-0.5" />
                      Listen Live
                    </>
                  )}
                </button>
                {requestUrls[channel.id] && (
                  <a
                    href={requestUrls[channel.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Mic2 className="w-4 h-4" />
                    Request a song
                  </a>
                )}
                <ShareButtons
                  url={`https://leonxm.lovable.app/channel/${channel.id}`}
                  title={`${channel.name} on LeonXM`}
                  compact
                />
              </div>
              {requestUrls[channel.id] && (
                <p className="mt-3 text-xs text-muted-foreground max-w-xl">
                  Opens the {channel.name} player — press the{" "}
                  <span className="font-semibold text-foreground">Request</span> button there to send your song.
                </p>
              )}


              {info && (
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
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

      {/* Now Playing + About */}
      <section className="max-w-7xl mx-auto w-full px-6 pb-24 grid lg:grid-cols-3 gap-6">
        {/* Now playing card */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Now Playing</h2>
            {isThisPlaying && (
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-4">
                  <div className="w-0.5 bg-primary rounded-full eq-bar" />
                  <div className="w-0.5 bg-primary rounded-full eq-bar" />
                  <div className="w-0.5 bg-primary rounded-full eq-bar" />
                </div>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">Streaming</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-5">
            {albumArt ? (
              <img
                src={albumArt}
                alt="Album art"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-lg shrink-0"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Radio className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-2xl sm:text-3xl font-bold text-foreground truncate">{songTitle}</p>
              {artist && <p className="text-base text-muted-foreground mt-1 truncate">{artist}</p>}
            </div>
          </div>
        </div>

        {/* About */}
        {info && (
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-4">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{info.description}</p>
          </div>
        )}

        {stationNewsSource[channel.id] && (
          <div className="lg:col-span-3">
            <StationNews
              station={stationNewsSource[channel.id]}
              limit={5}
              title={`${channel.name} News`}
            />
          </div>
        )}
      </section>


      {/* Other channels */}
      <section className="max-w-7xl mx-auto w-full px-6 pb-24">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight text-foreground">More on LeonXM</h2>
          <Link
            to="/channels"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            All channels <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {otherChannels.map((c) => (
            <Link
              key={c.id}
              to={`/channel/${c.id}`}
              className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur hover:border-primary/40 transition-all"
            >
              <img src={c.logo} alt={c.name} className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Ch.{c.id}</p>
                <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {c.name}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChannelPage;
