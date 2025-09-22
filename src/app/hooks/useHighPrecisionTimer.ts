import { useEffect, useRef, useState } from "react";

export default function useHighPrecisionTimer(autoStart = false) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  // Tick function throttled to update only every 100ms
  const tick = () => {
    const now = performance.now();
    const start = startTimeRef.current;
    if (start == null) return;

    // Update only if 100ms have passed since last state update
    if (now - lastUpdateRef.current >= 100) {
      setElapsedMs(now - start);
      lastUpdateRef.current = now;
    }

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const startTimer = () => {
    stopTimer(); // prevent multiple loops
    startTimeRef.current = performance.now();
    lastUpdateRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const stopTimer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
  };

  const resetTimer = () => {
    stopTimer();
    startTimeRef.current = undefined;
    lastUpdateRef.current = 0;
    setElapsedMs(0);
  };

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    return () => {
      stopTimer();
    };
    // Only run on mount/unmount — do NOT add `startTimer` to deps!
  }, []);

  return {
    elapsedMs: Math.floor(elapsedMs),
    startTimer,
    stopTimer,
    resetTimer,
  };
}
