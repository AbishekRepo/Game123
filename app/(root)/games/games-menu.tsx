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

interface games {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface Game {
  games: games[];
}

const GamesMenu: React.FC<Game> = ({ games }) => {
  const { status } = useSession();
  const router = useRouter();

  async function handlePlaceBet(gameId: string, betAmount: number) {
    try {
      const response = await fetch("/api/game/bet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          betAmount,
        }),
      });
      const data = await response.json();

      if (data.success) {
        router.push(`/game/${gameId}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place bet. Please try again.");
    }
  }

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading indicator while checking authentication
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {games.map((game) => (
        <Card
          key={game.id}
          className="hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden BG"
        >
          <CardHeader className=" p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {game.title}
              </CardTitle>
              <div className="text-2xl">{game.icon}</div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-600">{game.description}</p>
          </CardContent>
          <CardFooter className="p-4">
            {/* <Button
              variant="outline"
              className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
              onClick={() => router.push(game.link)}
            >
              Play Now
            </Button> */}
            <BetDialog
              gameId={game.id}
              gameTitle={game.title}
              onConfirm={(betAmount) => handlePlaceBet(game.id, betAmount)}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GamesMenu;
