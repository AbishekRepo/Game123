// GamesMenu.tsx
"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        router.push(`/games/${gameId}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place bet. Please try again.");
    }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
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
  );
};

export default GamesMenu;
