"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import { useEffect, useRef } from "react";

export default function GameZoneAudioManager() {
  const { audioShouldPlay, phase, currentGameData } = useAppSelector(
    (state) => state.gameZone
  );
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
    const soundMap: Record<string, Record<string, string>> = {
      NUMBER_GUESSER: {
        zone: "/sounds/gamezone.mp3",
        playing: "/sounds/numberguess.mp3",
        win: "/sounds/numberguesswin.mp3",
        lost: "/sounds/numberguesslost.mp3",
      },
      PERFECT_SCORE: {
        zone: "/sounds/gamezone.mp3",
        playing: "/sounds/numberguess.mp3",
        win: "/sounds/numberguesswin.mp3",
        lost: "/sounds/numberguesslost.mp3",
      },
    };

    let newSrc = "/sounds/gamezone.mp3";
    if (currentGameData.type && phase) {
      newSrc =
        soundMap[currentGameData.type]?.[phase] ?? "/sounds/melodiza.mp3";
    }

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
  }, [phase, audioShouldPlay, currentGameData.type]);

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
