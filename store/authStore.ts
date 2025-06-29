import { apolloClient } from "@/lib/apolloClient";
import { User } from "@/types/admin";
import { cookieStorage } from "@/utils/session";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface PersistAuth {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthState extends PersistAuth {
  setUser: (user: Partial<User> | null) => void;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
        })),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      logout: () => {
        // Clear cookies using multiple methods to ensure they're removed

        // Method 1: Using your cookie storage utility
        cookieStorage.removeItem("authToken");
        cookieStorage.removeItem("tanscrow-admin-auth");

        // Method 2: Direct cookie clearing (more reliable)
        // Clear with different path/domain combinations to ensure removal
        const cookiesToClear = ["authToken", "tanscrow-admin-auth"];

        cookiesToClear.forEach((cookieName) => {
          // Clear for current path
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

          // Clear for root domain
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

          // Clear for parent domain (in case of subdomain)
          const domain = window.location.hostname
            .split(".")
            .slice(-2)
            .join(".");
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
        });

        // Method 3: Clear localStorage as backup
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("tanscrow-auth");
        } catch (e) {
          // localStorage might not be available
          console.warn("Could not clear localStorage:", e);
        }

        // Update store state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });

        apolloClient.clearStore();
      },
    }),
    {
      name: "tanscrow-admin-auth", // name of the persisted store
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
