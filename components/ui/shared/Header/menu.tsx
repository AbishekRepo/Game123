"use client";

import React from "react";
// import ModeToggle from "./mode-toggle";
import { Button } from "../../button";
import Link from "next/link";
import { EllipsisVertical, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../../sheet";
import { useSession, signOut } from "next-auth/react";
import WalletBalance from "./Wallet-Balance";

const Menu = () => {
  const { data: session } = useSession();
  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

  const userfirstname = session?.user && session?.user?.name.split(" ")[0];
  console.log(session?.user);

  return (
    <div className="flex justify-between gap-3 ml-4">
      <nav className="hidden md:flex w-full max-w-xs items-center justify-center gap-4">
        <WalletBalance />
        {/* <ModeToggle></ModeToggle> */}
        {session ? (
          <div className="text-xs font-medium text-gray-700 text-center flex flex-col">
            <span>Welcome </span>
            <span className="font-semibold text-white">
              {userfirstname && userfirstname.length > 10
                ? `${userfirstname.substring(0, 10)}...`
                : userfirstname}
            </span>
          </div>
        ) : null}
        {session ? (
          <Button onClick={handleLogout}>
            <UserIcon /> Logout
          </Button>
        ) : (
          <Button asChild>
            <Link href="/sign-in">
              <UserIcon /> Login
            </Link>
          </Button>
        )}
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            {session ? (
              <div className="text-sm font-medium text-gray-700">
                Welcome{" "}
                <span className="font-semibold text-white">
                  {userfirstname}
                </span>
              </div>
            ) : null}
            <div className="md:hidden">
              <WalletBalance title="Money" buttonText="add" />
            </div>
            {session ? (
              <Button onClick={handleLogout}>
                <UserIcon /> Logout
              </Button>
            ) : (
              <Button asChild>
                <Link href="/sign-in">
                  <UserIcon /> Login
                </Link>
              </Button>
            )}
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
