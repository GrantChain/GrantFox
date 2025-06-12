"use client";

import type { PayoutProvider, User } from "@/generated/prisma";
import { type ReactNode, createContext, useContext, useState } from "react";

interface PayoutContextType {
  selectedGrantee: User | null;
  setSelectedGrantee: (selectedGrantee: User | null) => void;
  creator: PayoutProvider | null;
  setCreator: (creator: PayoutProvider | null) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

export function PayoutContextProvider({ children }: { children: ReactNode }) {
  const [selectedGrantee, setSelectedGrantee] = useState<User | null>(null);
  const [creator, setCreator] = useState<PayoutProvider | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <PayoutContext.Provider
      value={{
        selectedGrantee,
        setSelectedGrantee,
        creator,
        setCreator,
        showCreateModal,
        setShowCreateModal,
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
