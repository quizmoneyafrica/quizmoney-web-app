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
  data: GameZoneGamesObject[];
}

const initialState: GameZoneGames = {
  data: [],
};

const gameZoneSlice = createSlice({
  name: "gameZone",
  initialState,
  reducers: {
    setGameZoneGames(state, action: PayloadAction<GameZoneGamesObject[]>) {
      state.data = action.payload;
    },
  },
});

export const { setGameZoneGames } = gameZoneSlice.actions;
export default gameZoneSlice.reducer;
