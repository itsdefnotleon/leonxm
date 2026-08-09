import { Link } from "react-router-dom";
import { Play, Pause, ArrowRight, Mic2 } from "lucide-react";
import { channels, Channel, requestUrls } from "@/lib/channels";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { useTimeTheme, TimeTheme } from "@/hooks/use-time-theme";
import { useAudioPlayerContext } from "@/contexts/AudioPlayerContext";

const featuredByTime: Record<TimeTheme, { id: number; blurb: string }> = {
  dawn: { id: 1, blurb: "TruckBreakfast with Neuro-sama — weekdays 5am-10am" },
  day: { id: 2, blurb: "Your daytime soundtrack" },
  dusk: { id: 3, blurb: "Evening drive companion" },
  night: { id: 4, blurb: "All chill non-stop" },
};

const timeLabels: Record<TimeTheme, string> = {
  dawn: "Featured this morning",
  day: "Featured this afternoon",
  dusk: "Featured this evening",
  night: "Featured tonight",
};

export function FeaturedHero() {
  const theme = useTimeTheme();
  const pick = featuredByTime[theme];
  const channel: Channel = channels.find((c) => c.id === pick.id) ?? channels[0];
  const nowPlaying = useNowPlaying(channel.nowPlayingApi);
  const { currentChannel, isPlaying, play, stop } = useAudioPlayerContext();

  const song = nowPlaying?.now_playing?.song;
  const title = song?.title || "Loading…";
  const artist = song?.artist || "";
  const art = song?.art || channel.logo;

  const isActive = currentChannel?.id === channel.id;
  const live = isActive && isPlaying;

  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Filled album cover backdrop */}
      <div className="absolute inset-0">
        <img
          src={art}
          alt={`${channel.name} album art`}
          className="w-full h-full object-cover scale-110 blur-2xl opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-12 gap-12 items-center">
        {/* Album cover */}
        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="relative aspect-square max-w-[220px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto rounded-3xl overflow-hidden border border-border shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.6)]">
            <img src={art} alt={`${title} cover art`} className="w-full h-full object-cover" />
            {live && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                On Air
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">
            {timeLabels[theme]}
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-foreground">
            {channel.name}
          </h1>
          <p className="mt-3 text-muted-foreground">{pick.blurb}</p>

          <div className="mt-8 rounded-2xl border border-border bg-card/60 backdrop-blur px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-4 shrink-0">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-primary rounded-full eq-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Now playing
              </p>
            </div>
            <p className="mt-2 text-lg font-bold text-foreground truncate">{title}</p>
            {artist && <p className="text-sm text-muted-foreground truncate">{artist}</p>}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => (live ? stop() : play(channel))}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
            >
              {live ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {live ? "Stop" : `Listen to ${channel.name}`}
            </button>
            <Link
              to={`/channel/${channel.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-6 py-3.5 text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
            >
              Go to station <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
