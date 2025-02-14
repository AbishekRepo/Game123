"use client";

import { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { GameUIProps } from "../../../../types/game";
import BaseGame from "../base-game";
import { toast } from "@/hooks/use-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const datasetValues = [
  { value: 50, color: "#FF0000", label: "Red", multiplier: 2 }, // Red
  { value: 30, color: "#00FF00", label: "Green", multiplier: 3 }, // Green
  { value: 70, color: "#FFA500", label: "Orange", multiplier: 1.5 }, // Orange
  { value: 40, color: "#0000FF", label: "Blue", multiplier: 2.5 }, // Blue
  { value: 60, color: "#800080", label: "Purple", multiplier: 1.8 }, // Purple
  { value: 20, color: "#FF1493", label: "Pink", multiplier: 4 }, // Pink
];

const SpinWheelUI = ({ onGameComplete, isDisabled, username }: GameUIProps) => {
  const [countdown, setCountdown] = useState<number>(20);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [randomRotation, setRandomRotation] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const chartRef = useRef<ChartJS<"doughnut", number[], unknown> | null>(null);

  const data = {
    datasets: [
      {
        data: datasetValues.map((item) => item.value),
        backgroundColor: datasetValues.map((item) => item.color),
        borderColor: datasetValues.map((item) => item.color),
        cutout: "67%",
        rotation: randomRotation,
      },
    ],
    labels: datasetValues.map((item) => item.label),
  };

  const spinWheel = () => {
    if (spinning || isDisabled || !selectedColor) return;

    setSpinning(true);
    const newRotation = Math.random() * 3600 + 720; // At least 2 full spins
    setRandomRotation(newRotation);

    setTimeout(() => {
      const finalRotation = newRotation % 360;
      const segmentSize = 360 / datasetValues.length;
      const winningIndex = Math.floor(finalRotation / segmentSize);
      const winner = datasetValues[winningIndex];

      // Determine if player wins
      const playerWon = winner.color === selectedColor;

      toast({
        title: `🎨 Winner Color: ${winner.label.toUpperCase()}`,
        description: playerWon ? "🎉 You WON!" : "😞 You LOST!",
        style: { backgroundColor: winner.color, color: "#fff" }, // Dark mode-friendly
      });

      setTimeout(() => {
        onGameComplete({
          winner: playerWon ? username || "Player 1" : "Player 2",
          gameStatus: playerWon ? "WON" : "LOST",
        });
      }, 4000);

      setSpinning(false);
    }, 5000);
  };

  useEffect(() => {
    if (!isDisabled && !spinning && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown, spinning, isDisabled]);

  return (
    <div className="relative w-[340px] h-[340px] md:w-[410px] md:h-[410px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <Doughnut
          data={data}
          options={{
            plugins: { legend: { display: false } },
            animation: { duration: 5000 },
          }}
          ref={chartRef}
        />
      </div>

      {/* Color Selection UI with Thick Pointer */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-3">
        {datasetValues.map((item) => (
          <button
            key={item.color}
            className={`w-10 h-10 rounded-full transition-all 
                ${
                  selectedColor === item.color
                    ? "border-4 border-white shadow-lg scale-110"
                    : "border-2 border-gray-500 opacity-80"
                }
                `}
            style={{ backgroundColor: item.color }}
            onClick={() => setSelectedColor(item.color)}
            disabled={spinning}
          />
        ))}
      </div>

      {/* Spin Button */}
      <button
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold
                   disabled:opacity-50"
        onClick={spinWheel}
        disabled={spinning || isDisabled || !selectedColor}
      >
        {spinning ? "Spinning..." : `Spin (${countdown}s)`}
      </button>
    </div>
  );
};

export default function SpinWheel() {
  return <BaseGame gameTitle="spin-wheel" GameUI={SpinWheelUI} />;
}
