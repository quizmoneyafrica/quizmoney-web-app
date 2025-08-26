import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameTypes = "NUMBER_GUESSER" | "MEMORY_GAME" | "PERFECT_SCORE";
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
}

const initialState: GameZoneGames = {
  allGamesData: [],
  currentGameData: {
    gameId: "",
    name: "",
    description: "",
    type: "NUMBER_GUESSER",
    config: {
      minimumStake: 1000,
      maximumStake: 1000000,
    },
  },
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
  },
});

export const { setGameZoneGames, setCurrentGameData } = gameZoneSlice.actions;
export default gameZoneSlice.reducer;
