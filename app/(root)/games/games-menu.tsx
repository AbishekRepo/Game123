"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import BetDialog from "./bet-dialog";
import Image from "next/image";
import { useWalletStore } from "@/store/useWalletStore";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

interface GamesMenuProps {
  games: Game[];
}

const GamesMenu: React.FC<GamesMenuProps> = ({ games }) => {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false);

  const setBalance = useWalletStore((state) => state.setBalance);

  async function handlePlaceBet(
    gameId: string,
    betAmount: number,
    gameTitle: string
  ) {
    try {
      const betCheck = await fetch(`/api/game/user-bet?game=${gameTitle}`);
      const betData = await betCheck.json();

      if (betData.activeBet) {
        toast({
          title: "Error",
          description: "You already have an active bet for this game",
        });
        router.push(`/games/${gameId}`);
        return;
      }

      const response = await fetch("/api/game/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          betAmount,
          gameTitle,
          multiplier: 2.0,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setBalance(data.newBalance);
        router.push(`/games/${gameId}`);
      } else if (
        response.status === 400 &&
        data.message === "Insufficient balance"
      ) {
        setShowInsufficientBalance(true);
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough funds to place this bet.",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to place bet. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }

  function handleAddFunds() {
    router.push("/wallet/add-funds");
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {showInsufficientBalance && (
        <Alert className="mb-4">
          <AlertTitle className="font-bold text-red-500">
            Insufficient Balance
          </AlertTitle>
          <AlertDescription className="flex items-center justify-between text-red-500">
            <span>You don&apos;t have enough funds to place this bet.</span>
            <Button onClick={handleAddFunds} className="ml-4">
              Add Rupees
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className="flex flex-col">
            <div className="flex flex-col items-center">
              <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <Image
                  src={game.icon}
                  alt={game.title}
                  height={70}
                  width={70}
                  priority
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm">{game.description}</p>
              </CardContent>
            </div>
            <CardFooter>
              <BetDialog
                gameId={game.id}
                gameTitle={game.title}
                onConfirm={(betAmount) =>
                  handlePlaceBet(game.id, betAmount, game.title)
                }
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GamesMenu;
