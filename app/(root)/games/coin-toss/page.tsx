"use client";

import { useState, useRef } from "react";
import { GameUIProps } from "../../../../types/game";
import BaseGame from "../base-game";
import { gsap } from "gsap";

const CoinTossUI = ({ onGameComplete, isDisabled, username }: GameUIProps) => {
  const [userChoice, setUserChoice] = useState<"Heads" | "Tails" | null>(null);
  const [coinResult, setCoinResult] = useState<"Heads" | "Tails" | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false); // Track flipping state
  const [gameOver, setGameOver] = useState<boolean>(false);
  const coinRef = useRef<HTMLDivElement>(null);

  const flipCoin = () => {
    if (!userChoice || !coinRef.current || isFlipping || gameOver) return;

    // Disable buttons during animation
    setIsFlipping(true);

    // Determine the result
    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    // GSAP flip animation
    gsap.to(coinRef.current, {
      rotationY: "+=1800", // Spin multiple times
      duration: 2,
      ease: "power3.out",
      onComplete: () => {
        // Update the result after the animation completes
        setCoinResult(result);
        setGameOver(true);

        // Trigger game completion
        setTimeout(() => {
          onGameComplete({
            winner: userChoice === result ? username || "Player 1" : "Player 2",
            gameStatus: userChoice === result ? "WON" : "LOST",
          });
        }, 2500);

        // Re-enable flipping
        setIsFlipping(false);
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 3D Coin */}
      <div className="relative w-32 h-32">
        <div
          ref={coinRef}
          className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg font-bold"
          style={{
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
          }}
        >
          {coinResult || "Coin"}
        </div>
      </div>

      {/* Buttons for Heads and Tails */}
      <div className="flex space-x-4">
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            userChoice === "Heads" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUserChoice("Heads")}
          disabled={isDisabled || isFlipping}
        >
          Heads
        </button>
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            userChoice === "Tails" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUserChoice("Tails")}
          disabled={isDisabled || isFlipping}
        >
          Tails
        </button>
      </div>

      {/* Flip Coin Button */}
      <button
        className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold disabled:opacity-50"
        onClick={flipCoin}
        disabled={!userChoice || isDisabled || isFlipping || gameOver}
      >
        Flip Coin
      </button>

      {/* Display Result */}
      {coinResult && (
        <p className="mt-4 text-lg">Coin Landed on: {coinResult}</p>
      )}
    </div>
  );
};

export default function CoinToss() {
  return <BaseGame gameTitle="coin-toss" GameUI={CoinTossUI} />;
}
