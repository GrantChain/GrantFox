import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletGlobalStore } from "./@types/wallet.entity";
import { useGlobalWalletSlice } from "./slices/wallet.slice";

type AuthState = WalletGlobalStore;

export const useGlobalWalletStore = create<AuthState>()(
  persist(
    (...b) => ({
      ...useGlobalWalletSlice(...b),
    }),
    {
      name: "address-wallet",
    },
  ),
);
