"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2 } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type UserType = "alumni" | "student";

const RegistrationPage: React.FC = () => {
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>("alumni");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid = useMemo(() => {
    return email.trim() && password.trim();
  }, [email, password]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please complete all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          role: userType,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || data?.message || "Registration failed.",
        );
      }

      setSuccess("Account created. Redirecting...");
      router.push("/signin");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${API_BASE_URL}/auth/oauth/google/start`;
  };

  const toggleBase =
    "h-11 rounded-2xl px-6 text-sm font-semibold transition border";
  const active = "bg-[#7B6658] border-[#7B6658] text-white";
  const inactive =
    "bg-white border-[#D8C8BE] text-[#6E574D] hover:bg-[#FCFAF8]";

  return (
    <div className="min-h-screen text-slate-800">
      <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-md rounded-[2rem] border border-[#D8C8BE] bg-[#F8F3EE] p-6 shadow-[0_20px_60px_rgba(91,66,52,0.10)] sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#00799A] sm:text-5xl">
              Create account
            </h1>
            <p className="mt-2 text-[#8A6B5B]">
              Join the network and get started
            </p>
          </div>

          {/* Role toggle */}
          <div className="mb-6 text-center text-sm text-[#6E574D]">
            <span className="mr-2">I’m joining as</span>

            <button
              type="button"
              onClick={() => setUserType("alumni")}
              className={`font-semibold ${
                userType === "alumni"
                  ? "text-[#00799A] underline"
                  : "text-[#9A7A69] hover:text-[#00799A]"
              }`}
            >
              Alumni
            </button>

            <span className="mx-2 text-[#C2AFA5]">|</span>

            <button
              type="button"
              onClick={() => setUserType("student")}
              className={`font-semibold ${
                userType === "student"
                  ? "text-[#00799A] underline"
                  : "text-[#9A7A69] hover:text-[#00799A]"
              }`}
            >
              Student
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6E574D]">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B08D7C]" />
                <input
                  type="email"
                  placeholder="alumni@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#D8C8BE] bg-white pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#D8B7A6]/40"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6E574D]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B08D7C]" />
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-[#D8C8BE] bg-white pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#D8B7A6]/40"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full h-14 bg-[#7B6658] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#DECFC5]" />
              <span className="text-sm text-[#9A7A69]">Or continue with</span>
              <div className="h-px flex-1 bg-[#DECFC5]" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#D8C8BE] bg-white text-base font-medium text-slate-700 transition hover:bg-[#FCFAF8] disabled:opacity-60"
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

            {/* Footer */}
            <p className="text-center text-sm text-[#7C6255]">
              Already have an account?{" "}
              <Link href="/signin" className="text-[#00779A] font-semibold">
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
};

export default RegistrationPage;
