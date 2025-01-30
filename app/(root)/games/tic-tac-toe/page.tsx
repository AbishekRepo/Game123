"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WinLosePopup from "@/components/ui/shared/win-lose-popup/win-lose-popup";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [player, setPlayer] = useState("");

  const { data: session, status } = useSession();
  const [firstname] = session?.user.name.split(" ") || "player1";
  const router = useRouter();

  useEffect(() => {
    if (!isUserTurn && !winner) {
      setTimeout(botMove, 500);
    }
  }, [isUserTurn, winner]);

  const checkWinner = (newBoard: (string | null)[]) => {
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
      setIsGameOver(true);
      if (gameWinner === "X") {
        setPlayer(firstname || "Player 1");
        rewardWinner();
      }
    } else {
      setIsUserTurn(false);
    }
  };

  const botMove = () => {
    const emptyIndices = board.reduce<number[]>(
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
      setPlayer("Player 2");
      setIsGameOver(true);
    } else {
      setIsUserTurn(true);
    }
  };

  const rewardWinner = async () => {
    try {
      await fetch("/api/game/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          gameStatus: winner,
        }),
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

  // const handlePopupClose = () => {
  //   router.push("/games"); // Navigate to the games menu when popup closes
  // };

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
            className="w-28 h-28 md:w-32 md:h-32 text-4xl font-bold bg-slate-900 border border-gray-300 rounded-lg shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-gray-200"
            onClick={() => handleMove(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Popup to show game result */}
      <WinLosePopup
        isGameOver={isGameOver}
        isDraw={winner === "Draw"}
        player={player || "player 1"}
      ></WinLosePopup>
    </div>
  );
};

export default TicTacToe;
