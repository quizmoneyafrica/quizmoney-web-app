import { useCallback, useEffect, useRef, useState } from "react";

export default function useHighPrecisionTimer(autoStart = false) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const updateElapsedTime = useCallback((now: number) => {
    if (startTimeRef.current !== null) {
      setElapsedMs(now - startTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(updateElapsedTime);
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateElapsedTime);
  }, [updateElapsedTime]);

  const stopTimer = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedMs(0);
    startTimeRef.current = null;
  }, [stopTimer]);

  // Auto-start
  useEffect(() => {
    if (autoStart) {
      startTimer();
    }

    return () => stopTimer();
  }, [autoStart, startTimer, stopTimer]);

  return { elapsedMs, startTimer, stopTimer, resetTimer };
}
