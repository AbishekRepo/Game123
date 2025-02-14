"use client";

import { useState } from "react";
import { GameUIProps } from "../../../../types/game";
import BaseGame from "../base-game";

const CoinTossUI = ({ onGameComplete, isDisabled, username }: GameUIProps) => {
  const [userChoice, setUserChoice] = useState<"Heads" | "Tails" | null>(null);
  const [coinResult, setCoinResult] = useState<"Heads" | "Tails" | null>(null);

  const flipCoin = () => {
    if (!userChoice) return;

    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    setCoinResult(result);

    onGameComplete({
      winner: userChoice === result ? username || "Player 1" : "Player 2",
      gameStatus: userChoice === result ? "WON" : "LOST",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex space-x-4">
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            userChoice === "Heads" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUserChoice("Heads")}
          disabled={isDisabled}
        >
          Heads
        </button>
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            userChoice === "Tails" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUserChoice("Tails")}
          disabled={isDisabled}
        >
          Tails
        </button>
      </div>

      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold disabled:opacity-50"
        onClick={flipCoin}
        disabled={!userChoice || isDisabled}
      >
        Flip Coin
      </button>

      {coinResult && (
        <p className="mt-4 text-lg">Coin Landed on: {coinResult}</p>
      )}
    </div>
  );
};

export default function CoinToss() {
  return <BaseGame gameTitle="coin-toss" GameUI={CoinTossUI} />;
}
