"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, HelpCircle } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="w-full py-20 relative overflow-hidden bg-[#050505] flex justify-center">
      <div className="w-full max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-3xl border border-white/5 bg-[#0B0B0F]/60 px-6 py-12 md:p-16 text-center overflow-hidden subtle-glow"
        >
          {/* Background visuals */}
          <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-white/5 bg-[#050505] px-3.5 py-1 text-[10px] text-zinc-400 mb-6 relative z-10 select-none">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span>Developer first platform</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl max-w-xl mx-auto relative z-10 leading-tight">
            Ready to replace your software team?
          </h2>
          
          <p className="mt-4 text-xs text-zinc-450 max-w-md mx-auto relative z-10 leading-relaxed">
            Bring your vision to life today. No complex environment setup, no package dependency headaches. Just code.
          </p>

          {/* CTA Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/95 px-6 h-10 text-xs font-bold text-[#050505] transition-all duration-200 hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </a>
          </div>

          {/* Security details bottom line */}
          <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] text-zinc-550 relative z-10 select-none">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>No credit card required to start</span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
