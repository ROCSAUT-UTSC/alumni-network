"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const SignInPage: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid = email && password;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail || data?.message || "Login failed.");
      }

      const accessToken = data?.tokens?.access_token || data?.access_token;
      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
      }

      setSuccess("Login successful. Redirecting...");
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/oauth/google/start`;
  };

  return (
    <div className="min-h-screen text-slate-800">
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-md rounded-[2rem] border border-[#D8C8BE] bg-[#F8F3EE] p-6 shadow-[0_20px_60px_rgba(91,66,52,0.10)] sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#00799A] sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-2 text-base text-[#8A6B5B]">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#6E574D]"
              >
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B08D7C]" />
                <input
                  id="email"
                  type="email"
                  placeholder="alumni@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                  className="h-14 w-full rounded-2xl border border-[#D8C8BE] bg-white pl-12 pr-4 text-[15px] text-slate-800 outline-none transition focus:border-[#9A715D] focus:ring-2 focus:ring-[#D8B7A6]/40 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#6E574D]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#00779A] transition hover:opacity-80"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B08D7C]" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-14 w-full rounded-2xl border border-[#D8C8BE] bg-white pl-12 pr-4 text-[15px] text-slate-800 outline-none transition focus:border-[#9A715D] focus:ring-2 focus:ring-[#D8B7A6]/40 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#7B6658] text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="flex items-center gap-4 py-1">
              <div className="h-px flex-1 bg-[#DECFC5]" />
              <span className="text-sm text-[#9A7A69]">Or login with</span>
              <div className="h-px flex-1 bg-[#DECFC5]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#D8C8BE] bg-white text-base font-medium text-slate-700 transition hover:bg-[#FCFAF8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <p className="pt-2 text-center text-sm text-[#7C6255]">
              Not a member?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#00779A] transition hover:opacity-80"
              >
                Sign up now
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SignInPage;
