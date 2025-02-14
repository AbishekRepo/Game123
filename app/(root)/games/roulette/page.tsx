"use client";

import { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { GameUIProps } from "../../../../types/game";
import BaseGame from "../base-game";
import { toast } from "@/hooks/use-toast";
import { gsap } from "gsap";

ChartJS.register(ArcElement, Tooltip, Legend);

const datasetValues = [
  { value: 100, color: "#FF0000", label: "Red", multiplier: 2 }, // Red
  { value: 100, color: "#00FF00", label: "Green", multiplier: 3 }, // Green
  { value: 100, color: "#FFA500", label: "Orange", multiplier: 1.5 }, // Orange
];

const SpinWheelUI = ({ onGameComplete, isDisabled, username }: GameUIProps) => {
  const [countdown, setCountdown] = useState<number>(20);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [randomRotation] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const chartRef = useRef<ChartJS<"doughnut", number[], unknown> | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

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
    if (spinning || isDisabled || !selectedColor || gameOver) return;

    setSpinning(true);

    // Calculate the final rotation to align the winning segment with the pointer
    const segmentSize = 360 / datasetValues.length;
    const winningIndex = Math.floor(Math.random() * datasetValues.length); // Randomly select a winning segment
    const winner = datasetValues[winningIndex];

    // Calculate the final rotation to align the winning segment with the pointer
    const finalRotation = 360 - (winningIndex * segmentSize + segmentSize / 2);

    // Add multiple spins for a realistic effect
    const totalRotation = finalRotation + 360 * 5; // 5 extra spins

    // Animate the wheel
    gsap.to(wheelRef.current, {
      rotation: totalRotation,
      duration: 5,
      ease: "power3.out",
      onComplete: () => {
        // Determine if player wins
        const playerWon = winner.color === selectedColor;

        toast({
          title: `🎨 Winner Color: ${winner.label.toUpperCase()}`,
          description: playerWon ? "🎉 You WON!" : "😞 You LOST!",
          style: { backgroundColor: winner.color, color: "#fff" }, // Dark mode-friendly
        });
        setGameOver(true);

        setTimeout(() => {
          onGameComplete({
            winner: playerWon ? username || "Player 1" : "Player 2",
            gameStatus: playerWon ? "WON" : "LOST",
          });
        }, 4000);

        setSpinning(false);
      },
    });
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
    <div className="flex flex-col items-center gap-8">
      {/* Spinner Container */}
      <div className="relative w-[340px] h-[340px] md:w-[410px] md:h-[410px]">
        {/* Wheel */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={wheelRef}>
            <Doughnut
              data={data}
              options={{
                plugins: { legend: { display: false } },
                animation: { duration: 0 }, // Disable Chart.js animation
              }}
              ref={chartRef}
            />
          </div>
        </div>

        {/* Pointer */}
        <div
          ref={pointerRef}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50"
          style={{
            clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)", // Upside-down triangle shape
            borderTop: "2px solid #000", // Add a border for better visibility
            boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for depth
          }}
        ></div>

        {/* Spin Button */}
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     px-6 py-3 bg-green-600 text-white rounded-lg text-lg font-bold
                     disabled:opacity-50"
          onClick={spinWheel}
          disabled={spinning || isDisabled || !selectedColor || gameOver}
        >
          {spinning ? "Spinning..." : `Spin (${countdown}s)`}
        </button>
      </div>

      {/* Color Selection UI */}
      <div className="flex gap-3">
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
    </div>
  );
};

export default function SpinWheel() {
  return <BaseGame gameTitle="spin-wheel" GameUI={SpinWheelUI} />;
}
