import { createContext, useContext, useState, useRef, useCallback, ReactNode } from "react";
import { Channel } from "@/lib/channels";

interface AudioPlayerContextType {
  currentChannel: Channel | null;
  isPlaying: boolean;
  volume: number;
  play: (channel: Channel) => void;
  stop: () => void;
  togglePlayPause: () => void;
  changeVolume: (v: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((channel: Channel) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio(channel.streamUrl);
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener("playing", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("error", () => setIsPlaying(false));

    audio.play().catch(() => setIsPlaying(false));
    setCurrentChannel(channel);
  }, [volume]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentChannel(null);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentChannel) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [isPlaying, currentChannel]);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return (
    <AudioPlayerContext.Provider value={{ currentChannel, isPlaying, volume, play, stop, togglePlayPause, changeVolume }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayerContext() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayerContext must be used within AudioPlayerProvider");
  return ctx;
}
