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
import { authService } from "../services/auth.service";

interface UserContextType {
  user: User | null;
  grantee: Grantee | null;
  payoutProvider: PayoutProvider | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [grantee, setGrantee] = useState<Grantee | null>(null);
  const [payoutProvider, setPayoutProvider] = useState<PayoutProvider | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (!userData) {
        console.log("No user data found for userId:", userId);
        return;
      }

      if (userError) {
        console.error("Error fetching user data:", {
          error: userError,
          message: userError.message,
          details: userError.details,
        });
      }

      setUser(userData);

      // Check role and fetch role-specific data
      const roleResponse = await authService.checkRole(userId);
      if (roleResponse.success && roleResponse.role) {
        const { role } = roleResponse;

        if (role === "GRANTEE") {
          const { data: granteeData, error: granteeError } = await supabase
            .from("grantee")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (granteeError) {
            console.error("Error fetching grantee data:", {
              error: granteeError,
              message: granteeError.message,
              details: granteeError.details,
              hint: granteeError.hint,
              code: granteeError.code,
            });
          } else if (granteeData) {
            setGrantee(granteeData);
          }
        } else if (role === "PAYOUT_PROVIDER") {
          const { data: providerData, error: providerError } = await supabase
            .from("payout_provider")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (providerError) {
            console.error("Error fetching payout provider data:", {
              error: providerError,
              message: providerError.message,
              details: providerError.details,
              hint: providerError.hint,
              code: providerError.code,
            });
          } else if (providerData) {
            setPayoutProvider(providerData);
          }
        }
      }
    } catch (error) {
      console.error("Error in fetchUserData:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await fetchUserData(authUser.id);
    }
  }, [fetchUserData]);

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
      }
    });

    // Initial fetch
    refreshUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData, refreshUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        grantee,
        payoutProvider,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
