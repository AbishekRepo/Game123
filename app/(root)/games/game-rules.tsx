"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Typography } from "@/components/ui/typography";

interface GameRulesProps {
  game: string;
}

const GameRules: React.FC<GameRulesProps> = ({ game }) => {
  const renderRules = () => {
    switch (game) {
      case "Tic Tac Toe":
        return (
          <Card>
            <CardContent className="mt-4">
              <p>
                Tic Tac Toe is a two-player game played on a 3x3 grid.
              </p>
              <ul className="list-disc pl-5">
                <li>Players take turns marking a space, one using X and the other using O.</li>
                <li>The goal is to get three marks in a row (horizontally, vertically, or diagonally).</li>
                <li>If all 9 squares are filled without a winner, the game ends in a draw.</li>
              </ul>
            </CardContent>
          </Card>
        );
      case "Roulette":
        return (
          <Card>
            <CardContent className="mt-4">
              <p>
                Roulette is a casino game where players bet on where a ball will land on a spinning wheel.
              </p>
              <ul className="list-disc pl-5">
                <li>The wheel has numbered pockets from 0 to 36 (European) or 00 to 36 (American).</li>
                <li>Players bet on a number, range, color (red or black), or odd/even.</li>
                <li>If the ball lands on your bet, you win according to the payout.</li>
              </ul>
            </CardContent>
          </Card>
        );
      case "Coin Toss":
        return (
          <Card>
            <CardContent className="mt-4">
              <p>Coin Toss is a simple game of chance.</p>
              <ul className="list-disc pl-5">
                <li>A coin is flipped, and players bet on Heads or Tails.</li>
                <li>If it lands on your choice, you win!</li>
                <li>The outcome is completely random (50% chance for each side).</li>
              </ul>
            </CardContent>
          </Card>
        );
      default:
        return <p className="text-center mt-5">Select a game to view its rules.</p>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5">
      <h2 className="pb-2">Game Rules</h2>
      {renderRules()}
    </div>
  );
};

export default GameRules;
