"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";
import OAuthButtons from "@/components/auth/OAuthButtons";
import { supabase } from "@/backend/src/utils/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!email) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!agreeTerms) {
      newErrors.terms = "You must agree to the Terms of Service.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        setErrors({ email: error.message });
        setLoading(false);
        return;
      }

      alert("Account Created Successfully! Please log in.");
      router.push("/login");
    } catch (err: any) {
      setErrors({ email: err.message || "An unexpected error occurred." });
      setLoading(false);
    }
  };

  return (
    <AuthShell
      layout="split"
      leftTitle="Create your BuildAI account."
      leftSubtitle="Assemble your autonomous engineering team and deploy production-ready applications in minutes."
    >
      <div className="space-y-6">
        {/* Card Header (Visible on Mobile) */}
        <div className="space-y-1.5 lg:hidden">
          <h2 className="text-xl font-bold text-white tracking-tight">Create your account.</h2>
          <p className="text-[11px] text-zinc-450 leading-relaxed">
            Assemble your autonomous engineering team and deploy code.
          </p>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <AuthInput
            label="Full Name"
            id="signup-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <AuthInput
            label="Email Address"
            id="signup-email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <AuthInput
            label="Password"
            id="signup-password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />

          <AuthInput
            label="Confirm Password"
            id="signup-confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            required
          />

          {/* Terms checkbox */}
          <div className="space-y-1 select-none">
            <label className="flex items-start space-x-2 text-[11px] text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded border-white/5 bg-[#0B0B0F]/90 h-3.5 w-3.5 accent-primary cursor-pointer mt-0.5"
              />
              <span className="leading-relaxed">
                I agree to the{" "}
                <Link href="#terms" className="text-white hover:text-primary transition-colors underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#privacy" className="text-white hover:text-primary transition-colors underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.terms && (
              <p className="text-[10px] font-medium text-red-400 pl-6 mt-1">
                {errors.terms}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 disabled:opacity-50 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] cursor-pointer mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4 select-none">
          <div className="w-full border-t border-white/5" />
          <span className="absolute bg-[#0b0b0f] px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
            or sign up with
          </span>
        </div>

        {/* OAuth targets */}
        <OAuthButtons />

        {/* Login redirection footer */}
        <div className="pt-2 text-center text-[11px] text-zinc-450 border-t border-white/5">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-white hover:text-primary transition-colors pl-0.5"
          >
            Login
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
