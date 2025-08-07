"use client";

import type { Grantee, PayoutProvider, User } from "@/generated/prisma";
import { supabase } from "@/lib/supabase";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuthMutations } from "../hooks/useAuthMutations";
import { useOAuthUserSetup } from "../hooks/useOAuthUserSetup";

interface AuthContextType {
  user: User | null;
  grantee: Grantee | null;
  payoutProvider: PayoutProvider | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [grantee, setGrantee] = useState<Grantee | null>(null);
  const [payoutProvider, setPayoutProvider] = useState<PayoutProvider | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { useCompleteUserData, handleRefreshUser, handleClearCache } =
    useAuthMutations();

  // Hook para manejar la configuración automática de usuarios OAuth
  useOAuthUserSetup();

  // Usar TanStack Query para obtener datos del usuario
  const {
    user: userData,
    grantee: granteeData,
    payoutProvider: payoutProviderData,
    isLoading: isDataLoading,
  } = useCompleteUserData(currentUserId || "");

  // Actualizar estado cuando cambien los datos de TanStack Query
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
    if (granteeData && userData?.role === "GRANTEE") {
      setGrantee(granteeData);
    }
    if (payoutProviderData && userData?.role === "PAYOUT_PROVIDER") {
      setPayoutProvider(payoutProviderData);
    }
  }, [userData, granteeData, payoutProviderData]);

  // Actualizar loading state
  useEffect(() => {
    setIsLoading(isDataLoading);
  }, [isDataLoading]);

  const fetchUserData = useCallback(async (userId: string) => {
    setCurrentUserId(userId);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      if (currentUserId) {
        await handleRefreshUser(currentUserId);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, [handleRefreshUser, currentUserId]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setGrantee(null);
        setPayoutProvider(null);
        setCurrentUserId(null);
        await handleClearCache();
      }
    });

    // Petición inicial: usar la sesión actual para evitar llamadas a /auth/v1/user
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setIsLoading(false);
        return;
      }

      const authUser = data.session?.user;
      if (authUser) {
        await fetchUserData(authUser.id);
      } else {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData, handleClearCache]);

  return (
    <AuthContext.Provider
      value={{
        user,
        grantee,
        payoutProvider,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
