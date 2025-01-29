// BetDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BetDialogProps {
  gameId: string;
  gameTitle: string;
  onConfirm: (betAmount: number) => Promise<void>;
}

const BetDialog: React.FC<BetDialogProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gameId,
  gameTitle,
  onConfirm,
}) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const defaultBetAmounts = [5, 10, 20, 50];

  async function handleConfirmBet() {
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    setIsLoading(true);

    try {
      await onConfirm(betAmount);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while placing the bet.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
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

        <div className="grid grid-cols-2 gap-2 py-4">
          {defaultBetAmounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => setBetAmount(amount)}
              variant={amount === betAmount ? "default" : "outline"}
              className="w-full"
            >
              ${amount}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="customAmount">Custom Amount</label>
          <Input
            id="customAmount"
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            placeholder="Enter custom amount"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleConfirmBet} disabled={isLoading}>
            {isLoading ? "Placing Bet..." : "Confirm Bet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BetDialog;
