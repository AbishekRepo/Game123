import { create } from "zustand";
import { toast } from "@/hooks/use-toast";

interface WalletState {
  balance: number | null;
  previousBalance: number | null; // Add this to track changes
  isLoading: boolean;
  error: string | null;
  setBalance: (balance: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchBalance: () => Promise<void>;
  trackBalanceChange: (newBalance: number) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  balance: null,
  previousBalance: null,
  isLoading: false,
  error: null,

  setBalance: (balance) => {
    const currentBalance = get().balance;
    set({ previousBalance: currentBalance, balance });
    if (currentBalance !== null) {
      get().trackBalanceChange(balance);
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  trackBalanceChange: (newBalance: number) => {
    const previousBalance = get().previousBalance;
    if (previousBalance === null) return;

    const difference = newBalance - previousBalance;
    if (difference === 0) return;

    const formattedDifference = Math.abs(difference).toLocaleString();

    if (difference > 0) {
      toast({
        title: "Balance Increased! 🎉",
        description: `You won ₹${formattedDifference}`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Balance Decreased",
        description: `You lost ₹${formattedDifference}`,
        variant: "default",
        className: "bg-red-500 text-white",
      });
    }
  },

  fetchBalance: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/game/wallet-balance");
      const data = await response.json();

      if (response.ok) {
        // Use setBalance to trigger change tracking
        get().setBalance(data.balance);
      } else {
        set({ error: data.error || "Failed to fetch balance" });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({ error: "Failed to fetch balance" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
