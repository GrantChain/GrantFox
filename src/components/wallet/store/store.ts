import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { WalletGlobalStore } from "./@types/wallet.entity";
import { useGlobalWalletSlice } from "./slices/wallet.slice";

type AuthState = WalletGlobalStore;

export const useGlobalWalletStore = create<AuthState>()(
  devtools(
    persist(
      (...a) => ({
        ...useGlobalWalletSlice(...a),
      }),
      {
        name: "address-wallet",
      },
    ),
  ),
);
