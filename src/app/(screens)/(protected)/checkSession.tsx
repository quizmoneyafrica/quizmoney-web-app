"use client";

import { handleInvalidSession } from "@/app/api/parse/handleInvalidSession";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";

function CheckSession() {
  const [initialized, setInitialized] = useState(false);
  const refreshToken = useAppSelector((s) => s.auth.refreshToken);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (refreshToken && !initialized) {
      handleInvalidSession(dispatch, refreshToken).catch((err) => {
        console.error("Initial token refresh failed:", err);
      });
      setInitialized(true);
    }
  }, [refreshToken, dispatch, initialized]);

  return null;
}

export default CheckSession;
