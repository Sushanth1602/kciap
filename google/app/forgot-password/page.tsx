"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import AuthInput from "@/components/auth/AuthInput";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email address is required.");
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
    alert(`Mock password reset link sent to: ${email}`);
  };

  return (
    <AuthShell layout="centered">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center select-none">
          <h2 className="text-xl font-bold text-white tracking-tight">Reset password</h2>
          <p className="text-[11px] text-zinc-450 leading-relaxed max-w-[280px] mx-auto">
            Enter your email address and we'll send you a recovery link.
          </p>
        </div>

        {submitted ? (
          /* Success state message */
          <div className="space-y-4 text-center">
            <div className="p-3.5 rounded-lg bg-success/5 border border-success/15 text-[11px] text-zinc-300 leading-relaxed">
              We've sent a password reset link to <strong className="text-white">{email}</strong>. Please check your inbox and spam folders.
            </div>
            
            <button
              onClick={() => setSubmitted(false)}
              className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Resend recovery link
            </button>
          </div>
        ) : (
          /* Primary Form */
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <AuthInput
              label="Email Address"
              id="reset-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              error={error}
              required
            />

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] cursor-pointer mt-2"
            >
              Send reset link
            </button>
          </form>
        )}

        {/* Back to login redirection */}
        <div className="pt-4 text-center border-t border-white/5">
          <Link
            href="/login"
            className="inline-flex items-center text-[11px] font-bold text-zinc-450 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            <span>Back to login</span>
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
