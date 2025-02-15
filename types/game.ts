// types.ts
export type GameStatus = "WON" | "LOST" | "DRAW";

export interface GameResult {
  winner: string;
  gameStatus: GameStatus;
}

export interface Bet {
  id: string;
}

export interface GameUIProps {
  onGameComplete: (result: GameResult) => void;
  isDisabled: boolean;
  username?: string | null;
}

export interface BaseGameProps {
  gameTitle: string;
  GameUI: React.ComponentType<GameUIProps>;
}
