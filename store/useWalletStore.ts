import { create } from "zustand";

interface WalletState {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  setBalance: (balance: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchBalance: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: null,
  isLoading: false,
  error: null,
  setBalance: (balance) => set({ balance }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  fetchBalance: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch("/api/game/wallet-balance");
      const data = await response.json();

      if (response.ok) {
        set({ balance: data.balance });
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
