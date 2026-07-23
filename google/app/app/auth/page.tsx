"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader } from "lucide-react";
import PremiumBackground from "@/components/shared/PremiumBackground";
import AuthInput from "@/components/auth/AuthInput";
import OAuthButtons from "@/components/auth/OAuthButtons";

type Tab = "signin" | "signup";

export default function AppAuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("signup");
  const [loading, setLoading] = useState(false);

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    terms?: string;
  }>({});

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!signInEmail) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(signInEmail)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!signInPassword) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    executeMockAuth();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!signUpName.trim()) {
      newErrors.name = "Workspace name/your name is required.";
    }
    if (!signUpEmail) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!signUpPassword) {
      newErrors.password = "Password is required.";
    } else if (signUpPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the Terms of Service.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    executeMockAuth();
  };

  const executeMockAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/app/onboarding");
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] selection:bg-primary/20">
      {/* Background visual components */}
      <PremiumBackground />

      {/* Ambient aura glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-primary/3 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Header with logo link */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 z-10">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-[#0B0B0F] transition-all duration-350 group-hover:border-primary/50">
            <div className="h-3 w-3 rounded-sm bg-primary transition-all duration-500 group-hover:rotate-45" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
            BuildAI <span className="font-light text-zinc-400">OS</span>
          </span>
        </Link>
      </header>

      {/* Main card panel */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 flex items-center justify-center py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[400px] rounded-2xl border border-white/5 bg-[#0B0B0F]/85 shadow-2xl shadow-black/85 p-6 md:p-8 backdrop-blur-md relative"
        >
          {/* Release icon badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 rounded-full border border-white/5 bg-[#050505] px-3.5 py-1 text-[9px] text-zinc-400 select-none">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Workspace Setup Portal</span>
            </div>
          </div>

          <div className="text-center space-y-2 mb-6 select-none">
            <h1 className="text-xl font-bold tracking-tight text-white">Create your workspace</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Step 2 of 5</p>
          </div>

          {/* Authentication tabs toggler */}
          <div className="grid grid-cols-2 p-1 bg-[#050505] border border-white/5 rounded-full mb-6 font-mono text-[9px] font-bold text-zinc-500 select-none">
            <button
              onClick={() => {
                setActiveTab("signup");
                setErrors({});
              }}
              className={`py-1.5 rounded-full uppercase transition-colors relative cursor-pointer ${
                activeTab === "signup" ? "text-[#050505]" : "hover:text-zinc-300"
              }`}
            >
              Sign Up
              {activeTab === "signup" && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("signin");
                setErrors({});
              }}
              className={`py-1.5 rounded-full uppercase transition-colors relative cursor-pointer ${
                activeTab === "signin" ? "text-[#050505]" : "hover:text-zinc-300"
              }`}
            >
              Sign In
              {activeTab === "signin" && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </button>
          </div>

          {/* Form bodies */}
          <div className="relative min-h-[260px]">
            {loading ? (
              /* Loading screen overlay */
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-[#0B0B0F]/40 backdrop-blur-sm z-20">
                <Loader className="h-6 w-6 text-primary animate-spin" />
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest animate-pulse">
                  Provisioning Sandbox...
                </span>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {activeTab === "signup" ? (
                /* Signup Tab Form content */
                <motion.form
                  key="signup"
                  onSubmit={handleSignUp}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <AuthInput
                    label="Workspace owner name"
                    id="setup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpName}
                    onChange={(e) => {
                      setSignUpName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    error={errors.name}
                    required
                  />

                  <AuthInput
                    label="Admin Email"
                    id="setup-email"
                    type="email"
                    placeholder="name@company.com"
                    value={signUpEmail}
                    onChange={(e) => {
                      setSignUpEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    error={errors.email}
                    required
                  />

                  <AuthInput
                    label="Master Password"
                    id="setup-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={signUpPassword}
                    onChange={(e) => {
                      setSignUpPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    error={errors.password}
                    required
                  />

                  {/* Terms check box */}
                  <div className="space-y-1 select-none">
                    <label className="flex items-start space-x-2 text-[10px] text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => {
                          setAgreeTerms(e.target.checked);
                          if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                        }}
                        className="rounded border-white/5 bg-[#050505] h-3.5 w-3.5 accent-primary cursor-pointer mt-0.5"
                      />
                      <span className="leading-relaxed">
                        I agree to terms of deployment isolation and usage parameters.
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-[9px] text-red-400 pl-6 mt-0.5">{errors.terms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] cursor-pointer mt-2"
                  >
                    Create Workspace
                  </button>
                </motion.form>
              ) : (
                /* Signin Tab Form content */
                <motion.form
                  key="signin"
                  onSubmit={handleSignIn}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <AuthInput
                    label="Email Address"
                    id="setup-signin-email"
                    type="email"
                    placeholder="name@company.com"
                    value={signInEmail}
                    onChange={(e) => {
                      setSignInEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    error={errors.email}
                    required
                  />

                  <AuthInput
                    label="Password"
                    id="setup-signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => {
                      setSignInPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    error={errors.password}
                    required
                  />

                  {/* Options row */}
                  <div className="flex items-center justify-between text-[10px] select-none">
                    <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/5 bg-[#050505] h-3.5 w-3.5 accent-primary cursor-pointer"
                      />
                      <span>Remember workspace</span>
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] cursor-pointer mt-2"
                  >
                    Log In
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Social division marker */}
          <div className="relative flex items-center justify-center my-4 select-none">
            <div className="w-full border-t border-white/5" />
            <span className="absolute bg-[#0b0b0f] px-3 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
              or connect via
            </span>
          </div>

          <OAuthButtons />

        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-[10px] text-zinc-600 z-10 select-none">
        <span>&copy; {new Date().getFullYear()} BuildAI OS, Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
