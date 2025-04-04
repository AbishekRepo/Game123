"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WinLosePopup from "@/components/ui/shared/win-lose-popup/win-lose-popup";
import { useToast } from "@/hooks/use-toast";
import RefreshProtection from "@/components/ui/shared/refresh-protect/refresh-protection";
import { BaseGameProps, Bet, GameResult } from "../../../types/game";
import { useWalletStore } from "@/store/useWalletStore";

const BaseGame = ({ gameTitle, GameUI }: BaseGameProps) => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [activeBet, setActiveBet] = useState<Bet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [player2Joined, setPlayer2Joined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const { data: session, status } = useSession();
  const [firstname] = session?.user?.name?.split(" ") || ["player 1"];
  const router = useRouter();
  const { toast } = useToast();
  const isSpinWheelGame = gameTitle === "spin-wheel";
  const { fetchBalance } = useWalletStore();

  useEffect(() => {
    const validateGame = async () => {
      try {
        const response = await fetch(`/api/game/user-bet?game=${gameTitle}`);
        const data = await response.json();
        setActiveBet(data.activeBet);
        setIsLoading(false);

        const timeout = setTimeout(() => {
          toast({
            title: "Session Expired",
            description: "Game session has expired",
          });
          router.push("/games");
        }, 30 * 60 * 1000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error(error);
        router.push("/games");
      }
    };

    validateGame();
  }, [gameTitle, router, toast]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    toast({
      title: isSpinWheelGame
        ? "Waiting for others to choose..pls wait"
        : "Waiting for Player 2",
      description: isSpinWheelGame
        ? ""
        : "Game will begin once Player 2 joins.",
    });

    const delay = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;

    const timer = setTimeout(() => {
      toast({
        title: isSpinWheelGame
          ? "Done. please choose your color and spin"
          : "Player 2 Joined",
        description: "Game is starting now!",
      });
      setGameStarted(true);
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGameComplete = async (result: GameResult) => {
    sessionStorage.removeItem("activeBet");
    setWinner(result.winner);
    setIsDraw(result.gameStatus === "DRAW");
    setIsGameOver(true);

    try {
      const response = await fetch("/api/game/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          gameStatus: result.gameStatus,
          betId: activeBet?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update game result");
      }
      fetchBalance();
    } catch (error) {
      console.error("Failed to update wallet:", error);
      toast({ title: "Error", description: "Failed to update game result" });
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("activeBet")) {
      router.push("/games");
      toast({
        title: "Invalid Action",
        description:
          "You must place a bet before playing the game,pls select a game and Place bet.",
      });
    }
  }, [router, toast]);

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center p-4 flex flex-col items-center">
      <h2 className="text-sm font-bold mb-4">{gameTitle}</h2>

      <GameUI
        onGameComplete={handleGameComplete}
        isDisabled={!gameStarted || isGameOver}
        username={firstname}
      />

      <WinLosePopup
        isGameOver={isGameOver}
        isDraw={isDraw}
        player={winner || ""}
        customMessage={gameTitle === "spin-wheel" ? "Thanks for playing" : ""}
      />
      <RefreshProtection betId={activeBet?.id} />
    </div>
  );
};

export default BaseGame;
