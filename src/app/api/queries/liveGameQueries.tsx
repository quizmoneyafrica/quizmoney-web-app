"use client";

import { useGameQuestion, useGameQuestionResult, useGameStarted, useGameLocked, useGameFinished, useGamePlayerJoined, useGameLobbyUpdate, useGameCancelled, useGameError, useGameReconnected } from '@/lib/socket';
import { useAppDispatch } from "@/app/hooks/useAuth";
import { setCurrentLiveQuestion, setOptionLocked, 
  setGameStatus, setPlayersCount, setGameStarted, setGameFinished 
} from "@/app/store/gameSlice";
import { useEffect } from "react";

function LiveGameQueries() {
  const dispatch = useAppDispatch();

  // Handle incoming questions
  useGameQuestion((data) => {
    console.log("Received question:", data);
    dispatch(setCurrentLiveQuestion(data.question));
    dispatch(setOptionLocked(false));
  });

  // Handle question results
  useGameQuestionResult((data) => {
    console.log("Received question result:", data);
    // You might want to update UI with correct answer, etc.
  });

  // Handle game started
  useGameStarted((data) => {
    console.log("Game started:", data);
    dispatch(setGameStarted(true));
    dispatch(setGameStatus('active'));
  });

  // Handle game locked
  useGameLocked((data) => {
    console.log("Game locked:", data);
    dispatch(setGameStatus('locked'));
    // Optionally show "Game starting soon" message
  });

  // Handle game finished
  useGameFinished((data) => {
    console.log("Game finished:", data);
    dispatch(setGameFinished(true));
    dispatch(setGameStatus('finished'));
    // Show final leaderboard
  });

  // Handle player joined
  useGamePlayerJoined((data) => {
    console.log("Player joined:", data);
    dispatch(setPlayersCount(data.totalPlayers));
  });

  // Handle lobby updates
  useGameLobbyUpdate((data) => {
    console.log("Lobby update:", data);
    dispatch(setPlayersCount(data.totalPlayers));
  });

  // Handle game cancelled
  useGameCancelled((data) => {
    console.log("Game cancelled:", data);
    dispatch(setGameStatus('cancelled'));
    // Show cancellation message
  });

  // Handle game errors
  useGameError((data) => {
    console.error("Game error:", data);
    // Show error message to user
  });

  // Handle reconnection
  useGameReconnected((data) => {
    console.log("Game reconnected:", data);
    // Handle reconnection logic if needed
  });

  return null;
}

export default LiveGameQueries;