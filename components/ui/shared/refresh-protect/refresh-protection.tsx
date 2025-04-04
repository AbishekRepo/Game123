"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface RefreshProtectionProps {
  betId?: string;
}

const RefreshProtection = ({ betId }: RefreshProtectionProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Your bet will be LOST if you refresh or leave the page. Are you sure?";
    };

    const handleUnload = async () => {
      try {
        const activeBet = sessionStorage.getItem("activeBet") || null;
        if (activeBet) {
          sessionStorage.removeItem("activeBet");
        }
        // Update bet status to LOST
        await fetch("/api/game/forfeit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ betId }),
          // Using keepalive to ensure the request completes even if the page is unloading
          keepalive: true,
        });
        router.push("/games");
      } catch (error) {
        console.error("Error forfeiting bet:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [betId, router]);

  return null;
};

export default RefreshProtection;
