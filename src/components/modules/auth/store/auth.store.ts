import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TemporaryEmailState {
  email: string;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const useTemporaryEmailStore = create<TemporaryEmailState>()(
  devtools(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: "" }),
    }),
    {
      name: "temporary-email-store",
    }
  )
);