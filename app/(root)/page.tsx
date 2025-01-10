import Hero from "@/components/ui/shared/Hero/Hero";
import React from "react";

export const metadata = {
  title: "Home",
};

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)); // test loader

const page = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default page;
