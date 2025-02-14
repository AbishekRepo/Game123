"use client";

import { useState, useEffect } from "react";
import { GameUIProps } from "../../../../types/game";
import BaseGame from "../base-game";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

const TicTacToeUI = ({ onGameComplete, isDisabled, username }: GameUIProps) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);

  const checkWinner = (squares: (string | null)[]) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : "Draw";
  };

  const handleMove = (index: number) => {
    if (board[index] || !isUserTurn || isDisabled) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleGameEnd(winner);
    } else {
      setIsUserTurn(false);
    }
  };

  const handleGameEnd = (winner: string) => {
    if (winner === "Draw") {
      onGameComplete({ winner: "Draw", gameStatus: "DRAW" });
    } else {
      onGameComplete({
        winner: winner === "X" ? username || "Player 1" : "Player 2",
        gameStatus: winner === "X" ? "WON" : "LOST",
      });
    }
  };

  const botMove = () => {
    const emptyIndices = board.reduce<number[]>(
      (acc, cell, index) => (cell === null ? [...acc, index] : acc),
      []
    );

    if (emptyIndices.length === 0) return;

    // Use minimax algorithm for better AI (optional enhancement)
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      handleGameEnd(winner);
    } else {
      setIsUserTurn(true);
    }
  };

  useEffect(() => {
    if (!isUserTurn && !isDisabled) {
      const timer = setTimeout(botMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, isDisabled]);

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <button
          key={index}
          className="w-28 h-28 md:w-32 md:h-32 text-4xl font-bold bg-slate-900 
                     border border-gray-300 rounded-lg shadow-sm hover:bg-slate-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
          onClick={() => handleMove(index)}
          disabled={!isUserTurn || isDisabled || cell !== null}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default function TicTacToe() {
  return <BaseGame gameTitle="tic-tac-toe" GameUI={TicTacToeUI} />;
}
