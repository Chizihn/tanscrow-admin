"use client";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { useQuery } from "@apollo/client";
import { isTokenExpired, getToken } from "@/utils/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { showErrorToast } from "./Toast";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types/admin";
import { ME } from "@/graphql/admin";
import { apolloClient } from "@/lib/apolloClient";

function ApolloAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, setIsAuthenticated, logout } = useAuthStore();
  const [shouldSkipQuery, setShouldSkipQuery] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check token on mount
  useEffect(() => {
    const token = getToken();

    if (!token) {
      // No token - user not authenticated
      logout();
      setIsInitializing(false);
      setShouldSkipQuery(true);
      return;
    }

    if (isTokenExpired(token)) {
      // Token expired - logout and redirect
      console.log("Token expired, logging out...");
      showErrorToast("Session expired. Please sign in again.");
      logout();
      router.replace("/signin");
      setIsInitializing(false);
      setShouldSkipQuery(true);
      return;
    }

    // Token exists and is valid - proceed with ME query
    setShouldSkipQuery(false);
  }, [logout, router]);

  const { loading } = useQuery<{ me: User }>(ME, {
    fetchPolicy: "network-only",
    skip: shouldSkipQuery,
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        setIsAuthenticated(true);
      }
      setIsInitializing(false);
    },
    onError: (error) => {
      console.error("ME query error:", error);
      showErrorToast("Session expired. Please sign in again.");
      logout();
      router.push("/signin");
      setIsInitializing(false);
    },
  });

  // Show loading state while initializing or querying
  if (isInitializing || loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" closeButton={true} />
      {children}
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <ApolloAuthWrapper>{children}</ApolloAuthWrapper>
      </ApolloProvider>
    </ThemeProvider>
  );
}
