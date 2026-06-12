import { useNowPlaying } from "@/hooks/use-now-playing";
import { Channel } from "@/lib/channels";
import { Play, Pause, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: (channel: Channel) => void;
  onStop: () => void;
}

export function ChannelCard({ channel, isActive, isPlaying, onPlay, onStop }: ChannelCardProps) {
  const nowPlaying = useNowPlaying(channel.nowPlayingApi);
  const songTitle = nowPlaying?.now_playing?.song?.title || "Loading...";
  const artist = nowPlaying?.now_playing?.song?.artist || "";
  const albumArt = nowPlaying?.now_playing?.song?.art;

  const handleClick = () => {
    if (isActive && isPlaying) onStop();
    else onPlay(channel);
  };

  return (
    <div
      className={`group relative rounded-2xl border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isActive
          ? "border-primary/60 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)]"
          : "border-border hover:border-primary/40 hover:shadow-[0_0_40px_-15px_hsl(var(--primary)/0.4)]"
      }`}
    >
      {/* Top art band */}
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        <img
          src={albumArt || channel.logo}
          alt={channel.name}
          className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

        {/* Channel badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary bg-background/70 backdrop-blur px-2.5 py-1 rounded-full border border-primary/30">
            Ch.{channel.id}
          </span>
          {channel.geoRestricted && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-background/70 backdrop-blur px-2 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              {channel.geoRestricted.join("/")}
            </span>
          )}
        </div>

        {/* Live indicator */}
        {isActive && isPlaying && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
            On Air
          </div>
        )}

        {/* Play button */}
        <button
          onClick={handleClick}
          aria-label={isActive && isPlaying ? "Pause" : "Play"}
          className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          {isActive && isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <Link to={`/channel/${channel.id}`} className="block">
          <h3 className="text-foreground font-bold text-lg truncate group-hover:text-primary transition-colors">
            {channel.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2 min-h-[20px]">
          {isActive && isPlaying && (
            <div className="flex items-end gap-0.5 h-4 shrink-0">
              <div className="w-0.5 bg-primary rounded-full eq-bar" />
              <div className="w-0.5 bg-primary rounded-full eq-bar" />
              <div className="w-0.5 bg-primary rounded-full eq-bar" />
            </div>
          )}
          <p className="text-sm text-muted-foreground truncate">
            {artist ? `${artist} — ${songTitle}` : songTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
