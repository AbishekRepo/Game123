"use client";

import React from "react";
import ModeToggle from "./mode-toggle";
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

const Menu = () => {
  const { data: session } = useSession();
  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" });
  };

  console.log(session?.user);

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1 items-center gap-3">
        <ModeToggle></ModeToggle>
        {session ? (
          <div className="text-sm font-medium text-gray-700">
            Welcome{" "}
            <span className="font-semibold text-white">
              {session.user?.name}
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
            <ModeToggle></ModeToggle>
            {session ? (
              <div className="text-sm font-medium text-gray-700">
                Welcome{" "}
                <span className="font-semibold text-white">
                  {session.user?.name}
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
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
