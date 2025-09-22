import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameTypes = "NUMBER_GUESSER" | "MEMORY_GAME" | "PERFECT_SCORE" | "";
export type GamePhase = "zone" | "game" | "playing" | "win" | "lost" | "";
export interface GameZoneGamesObject {
  gameId: string;
  name: string;
  description: string;
  type: GameTypes;
  config: Config;
}

interface Config {
  minimumStake: number;
  maximumStake: number;
}

export interface GameZoneGames {
  allGamesData: GameZoneGamesObject[];
  currentGameData: GameZoneGamesObject;
  audioShouldPlay: boolean;
  phase: GamePhase;
}

const initialState: GameZoneGames = {
  allGamesData: [],
  currentGameData: {
    gameId: "",
    name: "",
    description: "",
    type: "",
    config: {
      minimumStake: 1000,
      maximumStake: 1000000,
    },
  },
  audioShouldPlay: false,
  phase: "",
};

const gameZoneSlice = createSlice({
  name: "gameZone",
  initialState,
  reducers: {
    setGameZoneGames(state, action: PayloadAction<GameZoneGamesObject[]>) {
      state.allGamesData = action.payload;
    },
    setCurrentGameData: (state, action: PayloadAction<GameZoneGamesObject>) => {
      state.currentGameData = action.payload;
    },
    setZonePhase: (state, action: PayloadAction<GamePhase>) => {
      state.phase = action.payload;
    },
    setCurrentGameType: (state, action: PayloadAction<GameTypes>) => {
      state.currentGameData.type = action.payload;
    },
    playZoneAudio: (state) => {
      state.audioShouldPlay = true;
    },
    stopZoneAudio: (state) => {
      state.audioShouldPlay = false;
    },
  },
});

export const {
  setGameZoneGames,
  setCurrentGameData,
  setZonePhase,
  playZoneAudio,
  stopZoneAudio,
  setCurrentGameType,
} = gameZoneSlice.actions;
export default gameZoneSlice.reducer;
