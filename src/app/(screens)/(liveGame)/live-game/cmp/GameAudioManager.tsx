"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { useEffect, useRef } from "react";

export default function AudioManager() {
  const { audioShouldPlay, phase } = useAppSelector((state) => state.game);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 0.1;
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Audio source for diff game screens
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    // const newSrc =
    //   phase === "lobby" ? "/sounds/count-sound.mp3" : "/sounds/melodiza.wav";
    const newSrc =
      phase === "lobby" ? "/sounds/melodiza.wav" : "/sounds/count-sound.mp3";

    // Only update if the src is different to avoid reload flicker
    if (audio.src !== new URL(newSrc, window.location.origin).href) {
      audio.src = newSrc;
      audio.load();
      // If audio should be playing, play new source immediately
      if (audioShouldPlay) {
        audio.play().catch((err) => {
          console.warn("Autoplay blocked:", err);
        });
      }
    }
  }, [phase, audioShouldPlay]);

  // Play/pause control if audioShouldPlay changes (but src unchanged)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audioShouldPlay) {
      audio.play().catch((err) => {
        console.warn("Autoplay blocked:", err);
      });
    } else {
      audio.pause();
    }
  }, [audioShouldPlay]);

  return null;
}
