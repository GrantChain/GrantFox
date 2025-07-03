import type { StateCreator } from "zustand";
import type { AuthenticationStore } from "../@types/authentication.entity";

const AUTHENTICATION_ACTIONS = {
  SET_EMAIL: "authentication/set-email",
  CLEAR_EMAIL: "authentication/clear-email",
} as const;

export const useAuthenticationSlice: StateCreator<
  AuthenticationStore,
  [["zustand/devtools", never]],
  [],
  AuthenticationStore
> = (set) => {
  return {
    // Stores
    email: "",

    // Modifiers
    setEmail: (email: string) =>
      set({ email }, false, AUTHENTICATION_ACTIONS.SET_EMAIL),
    clearEmail: () =>
      set({ email: "" }, false, AUTHENTICATION_ACTIONS.CLEAR_EMAIL),
  };
};
