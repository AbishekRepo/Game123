import { Gamepad2, Coins, Dice3 } from "lucide-react";
import GamesMenu from "./games-menu";

const games = [
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Classic strategy game for two players",
    icon: <Gamepad2 className="w-12 h-12 text-blue-500" />,
    link: "/games/tic-tac-toe",
  },
  {
    id: "coin-toss",
    title: "Coin Toss",
    description: "Simple heads or tails game",
    icon: <Coins className="w-12 h-12 text-yellow-500" />,
    link: "/games/coin-toss",
  },
  {
    id: "roulette",
    title: "Roulette",
    description: "Classic casino wheel game",
    icon: <Dice3 className="w-12 h-12 text-red-500" />,
    link: "/games/roulette",
  },
  {
    id: "hangman",
    title: "Hangman",
    description: "Guess the hidden word",
    icon: <Gamepad2 className="w-12 h-12 text-green-500" />,
    link: "/games/hangman",
  },
  {
    id: "memory",
    title: "Memory Game",
    description: "Test your recall skills",
    icon: <Dice3 className="w-12 h-12 text-purple-500" />,
    link: "/games/memory",
  },
  {
    id: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Classic hand game",
    icon: <Gamepad2 className="w-12 h-12 text-indigo-500" />,
    link: "/games/rock-paper-scissors",
  },
];

const GamesGrid = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-6 text-center ">Games Collection</h1>
      <GamesMenu games={games} />
    </div>
  );
};

export default GamesGrid;
