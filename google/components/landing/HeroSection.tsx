"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PremiumBackground from "@/components/shared/PremiumBackground";
import { supabase } from "@/backend/src/utils/supabase";

export default function HeroSection() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#050505] flex justify-center">
      {/* Premium Background Environment */}
      <PremiumBackground />

      {/* Large Neon Blur Background Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] h-[350px] bg-[#4F7CFF]/5 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[#8B5CF6]/3 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Centered Content Container */}
      <div className="mx-auto max-w-4xl px-6 text-center space-y-10 md:space-y-12">
        
        {/* Release Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 rounded-full border border-white/5 bg-[#0B0B0F]/80 px-4 py-1 text-[11px] text-zinc-400 backdrop-blur-md select-none"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="font-semibold tracking-wide uppercase text-[9px] text-[#4F7CFF]">public beta</span>
          <span className="text-zinc-600">|</span>
          <span>BuildAI OS v1.0.0 is officially live</span>
        </motion.div>

        {/* Large Typography Headline */}
        <div className="space-y-4 md:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl md:text-8xl leading-[1.05]"
          >
            Your AI Engineering Team. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-[#4F7CFF] font-black">
              Available 24/7.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed"
          >
            Turn a simple idea into a production-ready application using autonomous AI employees that collaborate like a real software company.
          </motion.p>
        </div>

        {/* Call to Actions (Get Started / Watch Demo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto select-none"
        >
          <button
            onClick={handleGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/95 text-sm font-bold text-[#050505] px-8 py-3.5 transition-all hover:scale-105 shadow-lg shadow-primary/10 cursor-pointer"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
          
          <button
            onClick={() => alert("Watch Demo Product Tour video (coming soon).")}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-sm font-bold text-white px-8 py-3.5 transition-all hover:scale-105 cursor-pointer"
          >
            Watch Demo
          </button>
        </motion.div>

      </div>
    </section>
  );
}
