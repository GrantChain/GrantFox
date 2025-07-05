import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AuthenticationStore } from "./@types/authentication.entity";

export const useAuthenticationBoundedStore = create<AuthenticationStore>()(
  devtools(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      clearEmail: () => set({ email: "" }),
    }),
    {
      name: "temporary-email-store",
    },
  ),
);
