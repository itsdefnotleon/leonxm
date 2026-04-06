import { useNowPlaying } from "@/hooks/use-now-playing";
import { Channel } from "@/lib/channels";
import { Play, Pause, Lock, ChevronRight } from "lucide-react";
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
    if (isActive && isPlaying) {
      onStop();
    } else {
      onPlay(channel);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative w-full text-left rounded-lg border transition-all duration-300 overflow-hidden ${
        isActive
          ? "border-primary/50 bg-primary/10 playing-pulse"
          : "border-border bg-card hover:bg-channel-hover hover:border-primary/20"
      }`}
    >
      <div className="p-5 flex gap-4 items-center">
        <div className="relative shrink-0">
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-16 h-16 rounded-md object-cover"
            crossOrigin="anonymous"
          />
          <div className={`absolute inset-0 rounded-md flex items-center justify-center bg-background/60 transition-opacity ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}>
            {isActive && isPlaying ? (
              <Pause className="w-6 h-6 text-primary" />
            ) : (
              <Play className="w-6 h-6 text-primary" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
              Ch.{channel.id}
            </span>
            {channel.geoRestricted && (
              <Lock className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-foreground font-bold text-lg truncate">{channel.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isActive && isPlaying && (
              <div className="flex items-end gap-0.5 h-4">
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

        {albumArt && (
          <img
            src={albumArt}
            alt="Album art"
            className="w-12 h-12 rounded object-cover hidden sm:block"
            crossOrigin="anonymous"
          />
        )}

        <Link
          to={`/channel/${channel.id}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </div>
    </button>
  );
}
