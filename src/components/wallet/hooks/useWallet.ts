import { kit } from "@/lib/wallet-kit";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useGlobalWalletStore } from "../store/store";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore, address } =
    useGlobalWalletStore();

  const connectWallet = async () => {
    await kit.openModal({
      modalTitle: "Connect to your favorite wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);
        const { address: addr } = await kit.getAddress();
        connectWalletStore(addr, option.name);
      },
    });
  };

  const disconnectWallet = async () => {
    await kit.disconnect();
    disconnectWalletStore();
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  return {
    handleConnect,
    handleDisconnect,
    account: address,
  };
};
