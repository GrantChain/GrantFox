"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@/@types/user.entity";
import { Grantee } from "@/@types/grantee.entity";
import { GrantProvider } from "@/@types/grant-provider.entity";
import { checkRole } from "../services/check-role.service";

interface UserContextType {
  user: User | null;
  grantee: Grantee | null;
  grantProvider: GrantProvider | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [grantee, setGrantee] = useState<Grantee | null>(null);
  const [grantProvider, setGrantProvider] = useState<GrantProvider | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (userError) throw userError;
      if (!userData) return;

      setUser(userData);

      // Check role and fetch role-specific data
      const roleResponse = await checkRole(userId);
      if (roleResponse.success && roleResponse.data) {
        const { role } = roleResponse.data;

        if (role === "grantee") {
          const { data: granteeData, error: granteeError } = await supabase
            .from("grantee")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (!granteeError && granteeData) {
            setGrantee(granteeData);
          }
        } else if (role === "grant_provider") {
          const { data: providerData, error: providerError } = await supabase
            .from("grant_provider")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (!providerError && providerData) {
            setGrantProvider(providerData);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      await fetchUserData(authUser.id);
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setGrantee(null);
        setGrantProvider(null);
      }
    });

    // Initial fetch
    refreshUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        grantee,
        grantProvider,
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
