// components/WalletBalance.tsx
"use client";

import React, { useEffect } from "react";
import { WalletIcon } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { Skeleton } from "@/components/ui/skeleton";
// import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const WalletBalance = ({
  title = "",
  buttonText = "",
}: {
  title?: string;
  buttonText?: string;
}) => {
  const { balance, isLoading, error, fetchBalance } = useWalletStore();

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <WalletIcon className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-destructive">
        <WalletIcon className="h-4 w-4" />
        Error loading balance
      </div>
    );
  }

  return (
    <Card className="rounded-2xl shadow-md border-none">
      <CardContent className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2 whitespace-nowrap px-2">
          {title ? (
            <p className="text-xs">{title}</p>
          ) : (
            <p className="text-xs">Money</p>
          )}
          <span className="text-lg md:text-sm font-semibold">
            {balance?.toFixed(0)} &#8377;
          </span>
        </div>
        <Button
          variant="ghost"
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-[20px]"
        >
          {buttonText ? buttonText : "+"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
