"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WinLosePopup from "@/components/ui/shared/win-lose-popup/win-lose-popup";
import { useToast } from "@/hooks/use-toast";
import RefreshProtection from "@/components/ui/shared/refresh-protect/refresh-protection";

const CoinToss = () => {
  const [userChoice, setUserChoice] = useState<"Heads" | "Tails" | null>(null);
  const [coinResult, setCoinResult] = useState<"Heads" | "Tails" | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  //   const [player, setPlayer] = useState("");

  interface Bet {
    id: string;
  }

  const [activeBet, setActiveBet] = useState<Bet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();
  const [firstname] = session?.user.name.split(" ") || "player1";
  const router = useRouter();
  const { toast } = useToast();
  const gameTitle = "coin-toss";

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

  const flipCoin = () => {
    if (!userChoice) return;
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    setCoinResult(result);
    setIsGameOver(true);

    if (userChoice === result) {
      setWinner(firstname || "Player 1");
      rewardWinner("WON");
    } else {
      setWinner("Player 2");
      rewardWinner("LOST");
    }
  };

  const rewardWinner = async (gameStatus: "WON" | "LOST") => {
    try {
      const response = await fetch("/api/game/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          gameStatus,
          betId: activeBet?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update game result");
      }
    } catch (error) {
      console.error("Failed to update wallet:", error);
      toast({ title: "Error", description: "Failed to update game result" });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center p-4 flex flex-col items-center">
      <h2 className="text-sm font-bold mb-4">Coin Toss</h2>
      <div className="flex space-x-4">
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            userChoice === "Heads" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUserChoice("Heads")}
        >
          Heads
        </button>
        <button
          className={`px-6 py-3 rounded-lg text-lg font-bold ${
            userChoice === "Tails" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
          onClick={() => setUserChoice("Tails")}
        >
          Tails
        </button>
      </div>
      <button
        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold"
        onClick={flipCoin}
        disabled={!userChoice}
      >
        Flip Coin
      </button>

      {coinResult && (
        <p className="mt-4 text-lg">Coin Landed on: {coinResult}</p>
      )}

      <WinLosePopup
        isGameOver={isGameOver}
        isDraw={false}
        player={winner || "Player 1"}
      />
      <RefreshProtection betId={activeBet?.id} />
    </div>
  );
};

export default CoinToss;
