import React from "react";
import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.png"
              alt="logo"
              priority={true}
              height={48}
              width={48}
            ></Image>
            <span className="hidden lg:block ml-3 font-bold text-2xl">
              {APP_NAME}
            </span>
            <span className="md:hidden ml-3 font-bold text-xl">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
