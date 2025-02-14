import GamesMenu from "./games-menu";

const games = [
  {
    id: "roulette",
    title: "Spinning Wheel",
    description: "Classic casino wheel game",
    icon: "/images/Roulette.png",
    link: "/games/roulette",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Strategy game for two players",
    icon: "/images/TicTacToe.png",
    link: "/games/tic-tac-toe",
  },
  {
    id: "coin-toss",
    title: "Coin Toss",
    description: "Simple heads or tails game",
    icon: "/images/Toss.png",
    link: "/games/coin-toss",
  },
  // {
  //   id: "hangman",
  //   title: "Hangman",
  //   description: "Guess the hidden word",
  //   icon: <Gamepad2 className="w-12 h-12 text-green-500" />,
  //   link: "/games/hangman",
  // },
  // {
  //   id: "memory",
  //   title: "Memory Game",
  //   description: "Test your recall skills",
  //   icon: <Dice3 className="w-12 h-12 text-purple-500" />,
  //   link: "/games/memory",
  // },
  // {
  //   id: "rock-paper-scissors",
  //   title: "Rock Paper Scissors",
  //   description: "Classic hand game",
  //   icon: <Gamepad2 className="w-12 h-12 text-indigo-500" />,
  //   link: "/games/rock-paper-scissors",
  // },
];

const GamesGrid = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl mb-6 text-center ">Games Collection</h1>
      <GamesMenu games={games} />
    </div>
  );
};

export default GamesGrid;
