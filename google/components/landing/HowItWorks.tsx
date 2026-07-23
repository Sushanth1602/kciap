"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Rocket } from "lucide-react";

interface Step {
  num: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Describe your idea.",
    description: "Enter your product requirements in plain text. Specify UI structures, database parameters, or general software goals.",
    details: ["Natural language parsing", "Feature breakdown audits", "Immediate architecture plan"],
    icon: <Terminal className="h-4 w-4 text-primary" />,
  },
  {
    num: "02",
    title: "AI company builds everything.",
    description: "Your autonomous agent team plans models, compiles React codebases, runs unit test runs, and formats static schemas.",
    details: ["Parallel developer agents", "Automated code generation", "Continuous sync audits"],
    icon: <Cpu className="h-4 w-4 text-secondary" />,
  },
  {
    num: "03",
    title: "Deploy instantly.",
    description: "Launch production container images to GCP, AWS, or Vercel edge networks in one click, fully configured with SSL.",
    details: ["One-click deploy hooks", "Zero handoff setups", "SSL configuration & DNS mapping"],
    icon: <Rocket className="h-4 w-4 text-success" />,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 md:py-32 relative bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-5xl px-6">
        
        {/* Section Header */}
        <div className="max-w-xl mb-16">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Workflow
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            From prompt to production in minutes.
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            Replace complex handoffs and manual dev setup. BuildAI OS manages the entire development cycle autonomously.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/5 bg-[#0B0B0F]/60 p-6 md:p-8 relative flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Number node */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-zinc-800 font-mono group-hover:text-primary transition-colors">
                    {step.num}
                  </span>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    {step.icon}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-450 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Bullet list of details */}
              <div className="mt-6 pt-4 border-t border-white/5 space-y-2 text-[10px] text-zinc-500 font-medium">
                {step.details.map((detail) => (
                  <div key={detail} className="flex items-center">
                    <span className="h-1 w-1 bg-zinc-700 rounded-full mr-2 group-hover:bg-primary transition-colors" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
