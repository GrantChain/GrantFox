"use client";

import type {
  Grantee,
  PayoutProvider,
  User,
  UserRole,
} from "@/generated/prisma";
import { http } from "@/lib/axios";
import { supabase } from "@/lib/supabase";
import axios from "axios";
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

interface UserResponse {
  exists: boolean;
  user: User;
}

interface RoleDataResponse {
  exists: boolean;
  user: Grantee | PayoutProvider;
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
      // First check the role
      const roleResponse = await authService.checkRole(userId);
      if (!roleResponse.success || !roleResponse.role) {
        console.log("No role found for userId:", userId);
        return;
      }

      const { role } = roleResponse;

      // Then fetch user data with the correct role
      const response = await http.get<UserResponse>("/get-user-by-id", {
        params: {
          user_id: userId,
          role,
        },
      });

      if (!response.data.exists || !response.data.user) {
        console.log("No user data found for userId:", userId);
        return;
      }

      // Ensure the user has the correct role
      const userWithRole = {
        ...response.data.user,
        role: role as UserRole,
      };
      setUser(userWithRole);

      try {
        const roleDataResponse = await http.get<RoleDataResponse>(
          "/get-user-role-by-id",
          {
            params: {
              user_id: userId,
              role,
            },
          },
        );

        if (roleDataResponse.data.exists && roleDataResponse.data.user) {
          if (role === "GRANTEE") {
            setGrantee(roleDataResponse.data.user as Grantee);
          } else if (role === "PAYOUT_PROVIDER") {
            setPayoutProvider(roleDataResponse.data.user as PayoutProvider);
          }
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
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
