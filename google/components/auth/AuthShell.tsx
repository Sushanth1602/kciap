"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PremiumBackground from "@/components/shared/PremiumBackground";

interface AuthShellProps {
  layout?: "split" | "centered";
  leftTitle?: string;
  leftSubtitle?: string;
  children: React.ReactNode;
}

export default function AuthShell({
  layout = "split",
  leftTitle,
  leftSubtitle,
  children
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] selection:bg-primary/20">
      {/* Moving Particles & Grid Background */}
      <PremiumBackground />

      {/* Floating Auroras */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/3 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/3 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Minimal Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-[#0B0B0F] transition-all duration-350 group-hover:border-primary/50">
            <div className="h-3 w-3 rounded-sm bg-primary transition-all duration-500 group-hover:rotate-45" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
            BuildAI <span className="font-light text-zinc-400">OS</span>
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 flex items-center justify-center py-10 z-10">
        {layout === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full max-w-5xl">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-6 space-y-4 text-left hidden lg:block"
            >
              {leftTitle && (
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                  {leftTitle}
                </h1>
              )}
              {leftSubtitle && (
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                  {leftSubtitle}
                </p>
              )}
            </motion.div>

            {/* Right Authentication Card Column */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="lg:col-span-6 flex justify-center lg:justify-end w-full"
            >
              <div className="w-full max-w-[420px] rounded-2xl border border-white/5 bg-[#0B0B0F]/85 shadow-2xl shadow-black/80 px-6 py-8 md:p-8 backdrop-blur-md relative">
                {children}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Centered layout for simplified password resets etc */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[420px]"
          >
            <div className="w-full rounded-2xl border border-white/5 bg-[#0B0B0F]/85 shadow-2xl shadow-black/80 px-6 py-8 md:p-8 backdrop-blur-md relative">
              {children}
            </div>
          </motion.div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-[10px] text-zinc-600 z-10 select-none">
        <span>&copy; {new Date().getFullYear()} BuildAI OS, Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
