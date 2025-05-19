import { StateCreator } from "zustand";
import { WalletGlobalStore } from "../@types/wallet.entity";

const AUTHENTICATION_ACTIONS = {
  CONNECT_WALLET: "authentication/connect",
  DISCONNECT_WALLET: "authentication/disconnect",
} as const;

export const useGlobalWalletSlice: StateCreator<
  WalletGlobalStore,
  [["zustand/devtools", never]],
  [],
  WalletGlobalStore
> = (set) => {
  return {
    // Stores
    address: "",
    name: "",

    // Modifiers
    connectWalletStore: async (address: string, name: string) => {
      set({ address, name }, false, AUTHENTICATION_ACTIONS.CONNECT_WALLET);
    },

    disconnectWalletStore: () =>
      set(
        { address: "", name: "" },
        false,
        AUTHENTICATION_ACTIONS.DISCONNECT_WALLET,
      ),
  };
};
