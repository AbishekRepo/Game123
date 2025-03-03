import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";
import { Input } from "../input";
import { Badge } from "../badge";

interface AddFundsProps {
  buttonText?: string;
  className?: string;
}

const AddFunds: React.FC<AddFundsProps> = ({ buttonText }) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | "">("");
  const [isLoading] = useState(false);

  const defaultAmounts = [5, 10, 20, 50];

  const formatIndianRupee = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAmountChange = (value: string) => {
    if (value === "") {
      setAmount("");
      return;
    }
    const numValue = Math.max(0, Number(value));
    setAmount(numValue);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full font-medium"
        >
          {buttonText ? buttonText : "+"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Funds</DialogTitle>
          <DialogDescription className="text-gray-500">
            Select the amount to be added to your account
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-6">
          {defaultAmounts.map((defaultAmount) => (
            <div key={defaultAmount} className="relative">
              <Button
                onClick={() => setAmount(defaultAmount)}
                variant={defaultAmount === amount ? "default" : "outline"}
                className={`w-full h-14 text-lg font-medium ${
                  defaultAmount === amount
                    ? "bg-green-50 text-green-700 border-green-600 hover:bg-green-100"
                    : "hover:border-green-600"
                }`}
              >
                {formatIndianRupee(defaultAmount)}
                {defaultAmount === 20 && (
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
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              min="0"
              className="pl-7 h-12 text-lg"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            disabled={isLoading || !amount || amount <= 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-medium"
          >
            {isLoading
              ? "Adding Funds..."
              : `Add ${amount ? formatIndianRupee(Number(amount)) : "₹0"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddFunds;
