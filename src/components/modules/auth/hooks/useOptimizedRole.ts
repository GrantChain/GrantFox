import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const ROLE_CACHE_KEY = "user_role_cache";
const ROLE_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

interface CachedRole {
  role: string;
  timestamp: number;
}

export const useOptimizedRole = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, isLoading: isAuthLoading } = useAuth();

  const getCachedRole = (): string | null => {
    try {
      const cached = localStorage.getItem(ROLE_CACHE_KEY);
      if (!cached) return null;

      const parsed: CachedRole = JSON.parse(cached);
      const isExpired = Date.now() - parsed.timestamp > ROLE_CACHE_DURATION;

      return isExpired ? null : parsed.role;
    } catch {
      return null;
    }
  };

  const setCachedRole = (role: string) => {
    try {
      const cached: CachedRole = {
        role,
        timestamp: Date.now(),
      };
      localStorage.setItem(ROLE_CACHE_KEY, JSON.stringify(cached));
    } catch {
      // Ignore localStorage errors
    }
  };

  const clearCachedRole = () => {
    try {
      localStorage.removeItem(ROLE_CACHE_KEY);
    } catch {
      // Ignore localStorage errors
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (isAuthLoading) return;

        const cachedRole = getCachedRole();
        if (cachedRole) {
          setRole(cachedRole);
          setIsLoading(false);
          return;
        }

        if (!user) {
          setIsLoading(false);
          return;
        }

        if (user.role && user.role !== "EMPTY") {
          setRole(user.role);
          setCachedRole(user.role);
          setIsLoading(false);
          return;
        }

        const response = await authService.checkRole(user.id);
        if (response.success && response.role && response.role !== "EMPTY") {
          setRole(response.role);
          setCachedRole(response.role);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch role"),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [isAuthLoading, user?.id, user?.role]);

  return {
    role,
    isLoading,
    error,
    clearCachedRole,
  };
};
