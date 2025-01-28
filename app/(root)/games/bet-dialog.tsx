"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BetDialogProps {
  gameId: string;
  gameTitle: string;
  onConfirm: (betAmount: number) => Promise<void>;
}

const BetDialog: React.FC<BetDialogProps> = ({
  gameId,
  gameTitle,
  onConfirm,
}) => {
  const [betAmount, setBetAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);

  const defaultBetAmounts = [5, 10, 20, 50];
  console.log(gameId);

  async function handleConfirmBet() {
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    setIsLoading(true);

    try {
      await onConfirm(betAmount);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while placing the bet.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Play Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Place Your Bet for {gameTitle}</DialogTitle>
          <DialogDescription>
            Select or enter your bet amount to proceed with the game.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {defaultBetAmounts.map((amount) => (
            <Button
              key={amount}
              variant={amount === betAmount ? "default" : "outline"}
              onClick={() => setBetAmount(amount)}
              className="w-full"
            >
              ${amount}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <label htmlFor="customBet" className="block text-sm font-medium">
            Custom Amount
          </label>
          <Input
            id="customBet"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            placeholder="Enter custom amount"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleConfirmBet}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Placing Bet..." : "Confirm Bet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BetDialog;
