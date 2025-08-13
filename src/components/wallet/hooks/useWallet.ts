import { kit } from "@/lib/wallet-kit";
import { profileService } from "@/components/modules/profile/services/profile.service";
import { useAuth } from "@/components/modules/auth/context/AuthContext";
import type { ISupportedWallet } from "@creit.tech/stellar-wallets-kit";
import { useGlobalWalletStore } from "../store/store";
import { toast } from "sonner";

export const useWallet = () => {
  const { connectWalletStore, disconnectWalletStore, address } =
    useGlobalWalletStore();
  const { user, refreshUser } = useAuth();

  const connectWallet = async () => {
    await kit.openModal({
      modalTitle: "Connect to your favorite wallet",
      onWalletSelected: async (option: ISupportedWallet) => {
        kit.setWallet(option.id);
        const { address: addr } = await kit.getAddress();
        // First try persisting wallet; only update local state on success
        const userId = user?.user_id;
        const currentWallet = user?.wallet_address || null;
        if (!userId || !addr) return;

        try {
          if (addr !== currentWallet) {
            await profileService.update({
              userId,
              user: { wallet_address: addr },
            } as never);
          }
          connectWalletStore(addr, option.name);
          await refreshUser();
        } catch (error: unknown) {
          // If server rejects (e.g., wallet already in use), do NOT connect locally
          console.error("Failed to persist wallet address:", error);
          let message = "Failed to connect wallet";
          if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
              response?: { data?: { error?: string; message?: string } };
            };
            message =
              axiosError.response?.data?.error ||
              axiosError.response?.data?.message ||
              message;
          } else if (error instanceof Error && error.message) {
            message = error.message;
          }
          toast.error(message);
          return;
        }
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
      // Try to extract an API error message
      let message = "Failed to connect wallet";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { error?: string; message?: string } };
        };
        message =
          axiosError.response?.data?.error ||
          axiosError.response?.data?.message ||
          message;
      } else if (error instanceof Error && error.message) {
        message = error.message;
      }
      toast.error(message);
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
