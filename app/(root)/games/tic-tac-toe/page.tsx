"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WinLosePopup from "@/components/ui/shared/win-lose-popup/win-lose-popup";
import { useToast } from "@/hooks/use-toast";
import RefreshProtection from "@/components/ui/shared/refresh-protect/refresh-protection";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [player, setPlayer] = useState("");
  interface Bet {
    id: string;
    // Add other properties if needed
  }

  const [activeBet, setActiveBet] = useState<Bet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();
  const [firstname] = session?.user.name.split(" ") || "player1";
  const router = useRouter();
  const { toast } = useToast();
  const gameTitle = "tic-tac-toe";

  useEffect(() => {
    const validateGame = async () => {
      try {
        const response = await fetch(`/api/game/user-bet?game=${gameTitle}`);
        const data = await response.json();

        setActiveBet(data.activeBet);
        setIsLoading(false);

        // Start session timeout
        const timeout = setTimeout(() => {
          toast({
            title: "Session Expired",
            description: "Game session has expired",
          });
          router.push("/games");
        }, 30 * 60 * 1000); // 30 minutes

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error(error);
        router.push("/games");
      }
    };

    validateGame();
  }, [gameTitle, router, toast]);

  useEffect(() => {
    if (!isGameOver && !isLoading) {
      localStorage.setItem(
        "gameState",
        JSON.stringify({
          board,
          isUserTurn,
          timestamp: Date.now(),
          betId: activeBet?.id,
        })
      );
    }
  }, [board, isUserTurn, isGameOver, isLoading, activeBet]);

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
        rewardWinner(gameWinner);
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
      rewardWinner(gameWinner);
    } else {
      setIsUserTurn(true);
    }
  };

  const rewardWinner = async (gameWinner: string) => {
    try {
      const response = await fetch("/api/game/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          gameStatus: gameWinner === "X" ? "WON" : "LOST",
          betId: activeBet?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update game result");
      }

      localStorage.removeItem("gameState");
    } catch (error) {
      console.error("Failed to update wallet:", error);
      toast({
        title: "Error",
        description: "Failed to update game result",
      });
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
      <RefreshProtection betId={activeBet?.id} />
    </div>
  );
};

export default TicTacToe;
