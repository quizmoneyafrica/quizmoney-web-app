"use client";

import { useAppDispatch } from "@/app/hooks/useAuth";
import { updateNextGameData } from "@/app/store/gameSlice";
import { useEffect } from "react";

// Note: Next game updates would typically come from REST API polling
// or could be implemented via Socket.io if the backend supports it.
// For now, we'll keep the existing REST-based approach.

function NextGameQueries() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch next game data periodically
    // This would typically be handled by useNextGame hook in components
    const fetchNextGame = async () => {
      // Placeholder for potential Socket.io implementation
    };

    // Set up interval for updates if needed
    // const interval = setInterval(fetchNextGame, 30000); // 30 seconds
    // return () => clearInterval(interval);
  }, []);

  return null;
}

export default NextGameQueries;