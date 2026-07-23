"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Network, Shield, Users } from "lucide-react";
import PremiumBackground from "@/components/shared/PremiumBackground";

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] selection:bg-primary/20">
      {/* Dynamic particles background */}
      <PremiumBackground />

      {/* Floating Auroras */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Minimal Header */}
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

      {/* Centered Welcome Container */}
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-12 z-10">
        
        {/* Animated Mesh Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative h-44 w-44 rounded-full border border-white/5 bg-[#0B0B0F]/40 flex items-center justify-center backdrop-blur-sm shadow-2xl"
        >
          {/* Pulsing visual circles */}
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-25" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-4 rounded-full border border-secondary/15 animate-ping opacity-20" style={{ animationDuration: "4s" }} />

          {/* Central Logo node */}
          <div className="relative z-10 p-5 rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-lg">
            <Network className="h-10 w-10 text-primary animate-pulse" />
          </div>

          {/* Drifting surrounding role nodes */}
          <motion.div
            animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-3 left-4 p-2 rounded-lg border border-white/5 bg-[#0B0B0F] shadow-md text-zinc-400"
          >
            <Users className="h-4.5 w-4.5 text-secondary" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0], x: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 right-4 p-2 rounded-lg border border-white/5 bg-[#0B0B0F] shadow-md text-zinc-400"
          >
            <Cpu className="h-4.5 w-4.5 text-success" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 6, 0], x: [0, 6, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-14 -right-5 p-2 rounded-lg border border-white/5 bg-[#0B0B0F] shadow-md text-zinc-400"
          >
            <Shield className="h-4.5 w-4.5 text-[#4F7CFF]" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-4 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]"
          >
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-[#4F7CFF] font-black">
              BuildAI OS
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm text-zinc-450 leading-relaxed max-w-md mx-auto"
          >
            Let's build your AI engineering company in less than a minute. Specify models, stack parameters, and launch your agent cluster.
          </motion.p>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 w-full max-w-[240px]"
        >
          <Link
            href="/app/auth"
            className="w-full flex items-center justify-center py-3.5 rounded-full bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-102 hover:shadow-lg hover:shadow-primary/5 select-none"
          >
            <span>Continue Setup</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>

      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-[10px] text-zinc-600 z-10 select-none">
        <span>&copy; {new Date().getFullYear()} BuildAI OS, Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
