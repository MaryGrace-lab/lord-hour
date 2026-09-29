"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { precheckLoginRateLimit } from "@/lib/login-precheck";

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
};

function safeCallback(url: string | null): string | null {
  if (!url) return null;
  if (!url.startsWith("/") || url.startsWith("//")) return null;
  return url;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));

  // If already authenticated, redirect to the correct portal.
  // We fetch the session directly instead of using useSession() to avoid
  // requiring a <SessionProvider> at the root of the app.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await res.json();
        if (cancelled) return;

        const role = session?.user?.role as string | undefined;
        if (role) {
          const home = callbackUrl || ROLE_HOME[role] || "/";
          router.replace(home);
          return;
        }
      } catch {
        // Silent — user just sees the login form.
      }
      if (!cancelled) setCheckingSession(false);
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      toast.error("Please enter your username and password");
      return;
    }

    setIsLoading(true);

    try {
      const precheck = await precheckLoginRateLimit(username);
      if (!precheck.allowed) {
        toast.error(
          `Too many failed attempts. Try again in ${precheck.minutesRemaining} minute(s).`,
          { duration: 6000 }
        );
        setIsLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        const errorMsg = result.error;
        if (errorMsg && errorMsg.toLowerCase().includes("too many")) {
          toast.error(errorMsg, { duration: 6000 });
        } else {
          toast.error("Invalid username or password");
        }
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Login successful. Redirecting...");
        const sessionRes = await fetch("/api/auth/session", {
          cache: "no-store",
        });
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role as string | undefined;
        const home = callbackUrl || (role ? ROLE_HOME[role] : null) || "/student";
        router.replace(home);
        return;
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
            aria-hidden
          />
          <p className="text-sm text-gray-500">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="font-heading text-2xl font-bold text-primary mb-4 text-center">
          Portal Login
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Enter your credentials to access the portal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              maxLength={50}
              autoComplete="username"
              placeholder="Your username"
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={200}
                autoComplete="current-password"
                placeholder="Your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FaEyeSlash size={18} aria-hidden />
                ) : (
                  <FaEye size={18} aria-hidden />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white hover:bg-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}