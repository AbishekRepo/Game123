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
import { Badge } from "@/components/ui/badge";

interface BetDialogProps {
  gameId?: string;
  gameTitle: string;
  onConfirm: (betAmount: number) => Promise<void>;
}

const BetDialog: React.FC<BetDialogProps> = ({ gameTitle, onConfirm }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const defaultBetAmounts = [5, 10, 20, 50];

  const formatIndianRupee = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

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
        <Button
          variant="ghost"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium mx-auto"
        >
          Play Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Place Your Bet for {gameTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Select or enter your bet amount to proceed with the game.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-6">
          {defaultBetAmounts.map((amount) => (
            <div key={amount} className="relative">
              <Button
                key={amount}
                onClick={() => setBetAmount(amount)}
                variant={amount === betAmount ? "default" : "outline"}
                className={`w-full h-14 text-lg font-medium ${
                  amount === betAmount
                    ? "bg-green-50 text-green-700 border-green-600 hover:bg-green-100"
                    : "hover:border-green-600"
                }`}
              >
                {formatIndianRupee(amount)}
                {amount === 10 && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">
                    Popular
                  </Badge>
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="customAmount"
            className="text-sm font-medium text-gray-700"
          >
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <Input
              id="customAmount"
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              placeholder="Enter amount"
              min="0"
              className="pl-7 h-12 text-lg"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleConfirmBet}
            disabled={isLoading || betAmount <= 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-medium"
          >
            {isLoading
              ? "Placing Bet..."
              : `Bet ${formatIndianRupee(betAmount)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BetDialog;
