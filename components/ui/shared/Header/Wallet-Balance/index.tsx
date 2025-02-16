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

  // Test code dont touch this file!
  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const handlePayment = () => {
    const options = {
      key: "rzp_test_0rLZuRany2Y32s", // Replace with your Razorpay Key ID
      amount: 50000, // Amount in paise (50000 paise = 500 INR)
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: "order_PwSBqGNMWcn0uc", // Replace with actual order ID
      handler: function (response: any) {
        alert("Payment ID: " + response.razorpay_payment_id);
        alert("Order ID: " + response.razorpay_order_id);
        alert("Signature: " + response.razorpay_signature);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    
    const rzp1 = new (window as any).Razorpay(options);
    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    
    rzp1.open();
  };

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
    <Card className="rounded-2xl shadow-md pl-2">
      <CardContent className="flex items-center p-0">
        <div className="flex gap-1">
          <div className="flex items-center space-x-2">
            {title ? (
              <p className="text-xs">{title}</p>
            ) : (
              <p className="text-xs">Money check</p>
            )}
            <span className="text-lg md:text-sm font-semibold">
              {balance?.toFixed(0)} &#8377;
            </span>
          </div>
          <Button
            variant="ghost"
            className=" bg-green-600 hover:bg-green-700 text-white p-2 rounded-full"
            onClick={handlePayment}
          >
            {buttonText ? buttonText : "+"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
