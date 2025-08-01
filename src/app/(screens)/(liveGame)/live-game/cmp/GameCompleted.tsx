import { useAppDispatch } from "@/app/hooks/useAuth";
import { setPhase } from "@/app/store/gameSlice";
import { Grid } from "@radix-ui/themes";
import React, { useEffect, useRef } from "react";

function GameCompleted() {
  const dispatch = useAppDispatch();
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const update = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      if (elapsed >= 60000) {
        dispatch(setPhase("result"));
        return;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dispatch]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     dispatch(setPhase("result"));
  //   }, 60000);

  //   return () => clearTimeout(timeout);
  // }, [dispatch]);
  return (
    <div className="min-h-[100dvh] lg:h-screen bg-primary-900 hero flex flex-col items-center justify-center  px-4">
      <div className="w-full h-full mx-auto max-w-lg space-y-6 grid grid-rows-2 place-items-center">
        <Grid gap="3" className="w-full">
          {/* body  */}
          <div className="bg-primary-50 text-center border-4 border-primary-500 rounded-[10px] px-4 py-4 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-900 border-t-transparent mx-auto" />
            <p className="text-lg font-medium">Collating results...</p>
            <p className="text-sm italic">please don&apos;t leave this page</p>
          </div>
        </Grid>
      </div>
    </div>
  );
}

export default GameCompleted;
