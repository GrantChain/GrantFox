import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const USER_CACHE_KEY = "user_data_cache";
const USER_CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

interface CachedUserData {
  user_id: string;
  role: string;
  timestamp: number;
}

export const useOptimizedUserData = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  const getCachedUserData = (): CachedUserData | null => {
    try {
      if (typeof window === "undefined") return null;

      const cached = localStorage.getItem(USER_CACHE_KEY);
      if (!cached) return null;

      const parsed: CachedUserData = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > USER_CACHE_DURATION;

      return isExpired ? null : parsed;
    } catch {
      return null;
    }
  };

  const setCachedUserData = (userData: CachedUserData) => {
    try {
      if (typeof window === "undefined") return;

      const cached = {
        ...userData,
        timestamp: Date.now(),
      };
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(cached));
    } catch {
      // Ignore localStorage errors
    }
  };

  const clearCachedUserData = () => {
    try {
      if (typeof window === "undefined") return;

      localStorage.removeItem(USER_CACHE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        // Verificar si hay usuario autenticado
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIsInitialized(true);
          return;
        }

        // Intentar usar caché primero
        const cachedData = getCachedUserData();
        if (cachedData && cachedData.user_id === user.id) {
          // Prefetch datos en background
          queryClient.prefetchQuery({
            queryKey: ["user-role", user.id],
            queryFn: () => Promise.resolve(cachedData.role),
            staleTime: 30 * 1000,
          });
          setIsInitialized(true);
          return;
        }

        // Si no hay caché, cargar datos en paralelo
        const [roleResponse] = await Promise.allSettled([
          authService.checkRole(user.id),
        ]);

        if (roleResponse.status === "fulfilled" && roleResponse.value.success) {
          const role = roleResponse.value.role;
          if (role && role !== "EMPTY") {
            setCachedUserData({
              user_id: user.id,
              role,
              timestamp: Date.now(),
            });

            // Prefetch datos adicionales en background
            queryClient.prefetchQuery({
              queryKey: ["user-role", user.id],
              queryFn: () => Promise.resolve(role),
              staleTime: 30 * 1000,
            });
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing user data:", error);
        setIsInitialized(true);
      }
    };

    initializeUserData();
  }, [queryClient]);

  return {
    isInitialized,
    clearCachedUserData,
  };
};
