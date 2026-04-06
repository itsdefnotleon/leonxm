import { Channel } from "@/lib/channels";
import { useNowPlaying } from "@/hooks/use-now-playing";
import { Play, Pause, Square, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface PlayerBarProps {
  channel: Channel | null;
  isPlaying: boolean;
  volume: number;
  onTogglePlayPause: () => void;
  onStop: () => void;
  onVolumeChange: (v: number) => void;
}

export function PlayerBar({ channel, isPlaying, volume, onTogglePlayPause, onStop, onVolumeChange }: PlayerBarProps) {
  const nowPlaying = useNowPlaying(channel?.nowPlayingApi || "");
  const songTitle = nowPlaying?.now_playing?.song?.title || "";
  const artist = nowPlaying?.now_playing?.song?.artist || "";
  const albumArt = nowPlaying?.now_playing?.song?.art;

  if (!channel) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-player-bg border-t border-border backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Channel info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {albumArt ? (
            <img src={albumArt} alt="" className="w-12 h-12 rounded object-cover" />
          ) : (
            <img src={channel.logo} alt="" className="w-12 h-12 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="text-foreground font-semibold text-sm truncate">{channel.name}</p>
            <p className="text-muted-foreground text-xs truncate">
              {artist ? `${artist} — ${songTitle}` : songTitle || "Live"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlayPause}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            )}
          </button>
          <button
            onClick={onStop}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <Square className="w-3.5 h-3.5 text-secondary-foreground" />
          </button>
        </div>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 w-32">
          <button onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}>
            {volume === 0 ? (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(v) => onVolumeChange(v[0] / 100)}
            className="flex-1"
          />
        </div>

        {/* Live badge */}
        {isPlaying && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live</span>
          </div>
        )}
      </div>
    </div>
  );
}
