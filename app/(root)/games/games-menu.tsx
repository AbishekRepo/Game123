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

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
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

  async function handlePlaceBet(
    gameId: string,
    betAmount: number,
    gameTitle: string
  ) {
    try {
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
    router.push("/wallet/add-funds"); // Replace with your actual add funds route
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
            <Button variant="outline" onClick={handleAddFunds} className="ml-4">
              Add Funds
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Card key={game.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <div className="text-4xl">{game.icon}</div>
            </CardHeader>
            <CardContent>
              <p>{game.description}</p>
            </CardContent>
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
