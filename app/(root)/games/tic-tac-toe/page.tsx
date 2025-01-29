"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isUserTurn && !winner) {
      setTimeout(botMove, 500);
    }
  }, [isUserTurn, winner]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkWinner = (newBoard: any) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return newBoard.includes(null) ? null : "Draw";
  };

  const handleMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    const gameWinner = checkWinner(newBoard);

    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === "X") {
        rewardWinner();
      }
    } else {
      setIsUserTurn(false);
    }
  };

  const botMove = () => {
    const emptyIndices = board.reduce(
      (acc, cell, index) => (cell === null ? [...acc, index] : acc),
      []
    );
    if (emptyIndices.length === 0) return;

    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[randomIndex] = "O";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsUserTurn(true);
    }
  };

  const rewardWinner = async () => {
    try {
      await fetch("/api/game/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.user?.email, gameStatus: "" }),
      });
    } catch (error) {
      console.error("Failed to update wallet:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center p-1 flex flex-col items-center">
      <h2 className="text-sm font-bold mb-4">Tic-Tac-Toe</h2>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            className="w-32 h-32 text-4xl font-bold bg-slate-900 border border-gray-300 rounded-lg shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-gray-200"
            onClick={() => handleMove(index)}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <h3 className="text-2xl font-semibold mt-4">
          {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
        </h3>
      )}
    </div>
  );
};

export default TicTacToe;
