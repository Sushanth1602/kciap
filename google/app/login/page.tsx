"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { supabase } from "@/backend/src/utils/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ email: error.message });
        setLoading(false);
        return;
      }

      if (data.session) {
        localStorage.setItem("sb-access-token", data.session.access_token);
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Lax`;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setErrors({ email: err.message || "An unexpected error occurred." });
      setLoading(false);
    }
  };

  return (
    <AuthShell
      layout="split"
      leftTitle="Welcome back."
      leftSubtitle="Continue building with your AI engineering team."
    >
      <div className="space-y-6">
        {/* Card Header (Visible on Mobile) */}
        <div className="space-y-1.5 lg:hidden">
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome back.</h2>
          <p className="text-[11px] text-zinc-450 leading-relaxed">
            Continue building with your AI engineering team.
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <AuthInput
            label="Email Address"
            id="login-email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <AuthInput
            label="Password"
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          {/* Options Row (Remember Me / Forgot Password) */}
          <div className="flex items-center justify-between text-[11px] select-none">
            <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-white/5 bg-[#0B0B0F]/90 h-3.5 w-3.5 accent-primary cursor-pointer"
              />
              <span>Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 disabled:opacity-50 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] cursor-pointer mt-2"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4 select-none">
          <div className="w-full border-t border-white/5" />
          <span className="absolute bg-[#0b0b0f] px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
            or login with
          </span>
        </div>

        {/* OAuth targets */}
        <OAuthButtons />

        {/* Signup redirection footer */}
        <div className="pt-2 text-center text-[11px] text-zinc-450 border-t border-white/5">
          <span>Don't have an account? </span>
          <Link
            href="/signup"
            className="font-bold text-white hover:text-primary transition-colors pl-0.5"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
