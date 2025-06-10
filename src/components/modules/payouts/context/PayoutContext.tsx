"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/generated/prisma";

interface PayoutContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

const PayoutContext = createContext<PayoutContextType | undefined>(undefined);

export function PayoutProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <PayoutContext.Provider
      value={{ user, setUser, showCreateModal, setShowCreateModal }}
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
