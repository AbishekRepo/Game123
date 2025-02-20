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

  const amountz = 500;
  const currency = "INR";
  const receiptId = "qwsaq1";

  const paymentHandler = async (e:any) => {
    const response = await fetch("http://localhost:8080/api/razorpay/create-order", {
      method: "POST",
      body: JSON.stringify({
        amount:amountz,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_0rLZuRany2Y32s", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "Acme Corp", //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response:any) {
        const body = {
          ...response,
        };
        console.log(body,"body-R-V")
        const validateRes = await fetch(
          "http://localhost:8080/api/razorpay/order-validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes,"jsonRes");
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Web Dev Matrix", //your customer's name
        email: "webdevmatrix@example.com",
        contact: "9000000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response:any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
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
            onClick={paymentHandler}
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
