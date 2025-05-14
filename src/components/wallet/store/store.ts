import { persist } from "zustand/middleware";
import { create } from "zustand";
import { useGlobalWalletSlice } from "./slices/wallet.slice";
import { WalletGlobalStore } from "./@types/wallet.entity";

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
