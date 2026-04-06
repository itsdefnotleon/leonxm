import { useState, useRef, useCallback } from "react";
import { Channel } from "@/lib/channels";

export function useAudioPlayer() {
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

  return { currentChannel, isPlaying, volume, play, stop, togglePlayPause, changeVolume };
}
