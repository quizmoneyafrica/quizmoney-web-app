"use client";
import React from "react";
import { GameZoneCard } from "./game-zone-card";
import GameZoneHeader from "./game-zone-header";

const formatTime = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${milliseconds}0`;
};

function GameZoneLayout() {
  return (
    <div className="min-h-screen bg-primary-900 opacity-90 pb-8 hero flex flex-col items-center  px-4">
      <div className="w-full mx-auto max-w-xl mt-5">
        <GameZoneHeader
          balance={5000}
          onTopUp={() => console.log("Top up clicked")}
        />
      </div>
      <div className="w-full mx-auto max-w-xl space-y-5 mt-14">
        <div className=" w-full">
          <span className=" text-sm text-white">
            Join the fun🤩. Play daily🎮. Win real cash🤑.
          </span>
        </div>
        <GameZoneCard
          bgColor="#DFF9FF"
          badgeIcon="/icons/tabler_badge-filled.svg"
          riverLine1="/icons/riverline1.svg"
          riverLine2="/icons/riverline2.svg"
          gameZoneIcon="/icons/pscore.svg"
          gameZoneImage="/assets/images/perfect.svg"
          caption={"Win 5x your stake! Answer 5 True or False questions."}
          btnTitle="Coming soon"
          onClick={undefined}
        />
        <GameZoneCard
          bgColor="#E4F4FF"
          badgeIcon="/icons/tabler_badge-filled.svg"
          riverLine1="/icons/num_river_line1.svg"
          riverLine2="/icons/num_river_line2.svg"
          gameZoneIcon="/icons/num_guess.svg"
          gameZoneImage="/assets/images/number_guessing.svg"
          caption={"Guess the correct number within 3 chances"}
          btnTitle="Coming soon"
          onClick={undefined}
        />
        <GameZoneCard
          bgColor="#E7FEED"
          badgeIcon="/icons/tabler_badge-filled.svg"
          riverLine1="/icons/money_river_line1.svg"
          riverLine2="/icons/money_river_line2.svg"
          gameZoneIcon="/icons/memory_game.svg"
          gameZoneImage="/assets/images/memory_game.svg"
          caption={"Match all cards before time runs out"}
          btnTitle="Coming soon"
          onClick={undefined}
        />
      </div>
    </div>
  );
}

export default GameZoneLayout;
