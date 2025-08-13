"use client";

import { useGlobalWalletStore } from "@/components/wallet/store/store";
import type { PayoutProvider, User } from "@/generated/prisma";
import { useGetMultipleEscrowBalances } from "@trustless-work/escrow";
import { type ReactNode, createContext, useContext, useState } from "react";

interface PayoutContextType {
  selectedGrantee: User | null;
  setSelectedGrantee: (selectedGrantee: User | null) => void;
  selectedPayoutProvider: User | null;
  setSelectedPayoutProvider: (selectedPayoutProvider: User | null) => void;
  creator: PayoutProvider | null;
  setCreator: (creator: PayoutProvider | null) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  escrowBalances: Record<string, number>;
  setEscrowBalances: (
    updater:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>),
  ) => void;
  isEscrowBalancesLoading: boolean;
  setIsEscrowBalancesLoading: (loading: boolean) => void;
  lastFetchedAt: Record<string, number>;
  fetchEscrowBalances: (
    addresses: string[],
    options?: { force?: boolean },
  ) => Promise<void>;
  updateEscrowBalance: (
    address: string,
    updater: number | ((prev: number) => number),
  ) => void;
}

export const PayoutContext = createContext<PayoutContextType | undefined>(
  undefined,
);

export function PayoutContextProvider({ children }: { children: ReactNode }) {
  const [selectedGrantee, setSelectedGrantee] = useState<User | null>(null);
  const [selectedPayoutProvider, setSelectedPayoutProvider] =
    useState<User | null>(null);
  const [creator, setCreator] = useState<PayoutProvider | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [escrowBalances, setEscrowBalancesState] = useState<
    Record<string, number>
  >({});
  const [isEscrowBalancesLoading, setIsEscrowBalancesLoading] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<Record<string, number>>(
    {},
  );

  const { getMultipleBalances } = useGetMultipleEscrowBalances();
  const { address } = useGlobalWalletStore();
  const STALE_MS = 30 * 1000;

  const setEscrowBalances = (
    updater:
      | Record<string, number>
      | ((prev: Record<string, number>) => Record<string, number>),
  ) => {
    setEscrowBalancesState((prev) =>
      typeof updater === "function"
        ? (updater as (prev: Record<string, number>) => Record<string, number>)(
            prev,
          )
        : updater,
    );
  };

  const fetchEscrowBalances: PayoutContextType["fetchEscrowBalances"] = async (
    addresses,
    options,
  ) => {
    const unique = Array.from(new Set(addresses.filter(Boolean)));
    if (!unique.length) return;
    if (!address) return;

    const now = Date.now();
    const missing = unique.filter((id) => {
      if (options?.force) return true;
      const fetchedAt = lastFetchedAt[id];
      if (escrowBalances[id] == null) return true;
      if (!fetchedAt) return true;
      return now - fetchedAt > STALE_MS;
    });
    if (!missing.length) return;

    setIsEscrowBalancesLoading(true);
    try {
      const balances = await getMultipleBalances(
        { signer: address, addresses: missing },
        "multi-release",
      );
      setEscrowBalances((prev) => {
        const next = { ...prev };
        for (const b of balances) {
          if (b.address) next[b.address] = b.balance;
        }
        return next;
      });
      setLastFetchedAt((prev) => {
        const next = { ...prev };
        for (const id of missing) {
          next[id] = now;
        }
        return next;
      });
    } finally {
      setIsEscrowBalancesLoading(false);
    }
  };

  const updateEscrowBalance: PayoutContextType["updateEscrowBalance"] = (
    escrowId,
    updater,
  ) => {
    setEscrowBalances((prev) => {
      const current = prev[escrowId] ?? 0;
      const nextValue =
        typeof updater === "function"
          ? (updater as (p: number) => number)(current)
          : updater;
      return { ...prev, [escrowId]: nextValue };
    });
    setLastFetchedAt((prev) => ({ ...prev, [escrowId]: Date.now() }));
  };

  return (
    <PayoutContext.Provider
      value={{
        selectedGrantee,
        setSelectedGrantee,
        selectedPayoutProvider,
        setSelectedPayoutProvider,
        creator,
        setCreator,
        showCreateModal,
        setShowCreateModal,
        escrowBalances,
        setEscrowBalances,
        lastFetchedAt,
        fetchEscrowBalances,
        updateEscrowBalance,
        isEscrowBalancesLoading,
        setIsEscrowBalancesLoading,
      }}
    >
      {children}
    </PayoutContext.Provider>
  );
}

export function usePayout() {
  const context = useContext(PayoutContext);
  if (context === undefined) {
    throw new Error("usePayout must be used within a PayoutProvider");
  }
  return context;
}
