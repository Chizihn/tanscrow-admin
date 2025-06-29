"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuthStore } from "@/store/authStore";
import { cookieStorage } from "@/utils/session";
import { SIGN_IN_WITH_EMAIL } from "@/graphql/admin";
import { useMutation } from "@apollo/client";
import { User } from "@/types/admin";

export default function SigninPage() {
  const router = useRouter();
  const { setUser, setToken, isAuthenticated } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  interface Payload {
    token: string;
    user: User;
  }

  const storeAuthData = (data: Payload) => {
    cookieStorage.setItem("authToken", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const [signIn, { loading }] = useMutation(SIGN_IN_WITH_EMAIL, {
    onCompleted: (data) => {
      toast.success("Welcome back!");
      storeAuthData(data.signinWithEmail);
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "An error occurred");
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    await signIn({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md space-y-6">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <ModeToggle />
        </CardFooter>
      </Card>
    </div>
  );
}
