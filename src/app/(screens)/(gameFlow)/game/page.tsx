"use client";
import { useAppSelector } from "@/app/hooks/useAuth";
import React from "react";

function Page() {
  const gameData = useAppSelector((state) => state.game.nextGameData);

  console.log(gameData);
  
  return <div></div>;
}

export default Page;
