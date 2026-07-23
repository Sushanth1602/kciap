"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CornerRightDown, Sparkles, Clock, AlertCircle } from "lucide-react";

export default function ComparisonTimeline() {
  return (
    <section id="why-buildai" className="w-full py-24 md:py-32 bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-5xl px-6 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Paradigm shift
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Why BuildAI OS?
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            A direct contrast between slow traditional hand-off procedures and modern autonomous company builds.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Traditional Development Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/5 bg-[#0B0B0F]/30 p-6 md:p-8 space-y-6"
          >
            <div className="flex items-center space-x-2 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
              <AlertCircle className="h-4 w-4" />
              <span>Traditional Development</span>
            </div>

            <div className="space-y-4 relative pl-4 border-l border-zinc-800">
              
              {/* Step 1 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-zinc-700" />
                <h4 className="text-xs font-bold text-zinc-400">1. Product Planning</h4>
                <p className="text-[10px] text-zinc-500">Drafting documentation, align stakeholders, mapping scope (weeks).</p>
              </div>

              {/* Step 2 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-zinc-700" />
                <h4 className="text-xs font-bold text-zinc-400">2. UI/UX Design</h4>
                <p className="text-[10px] text-zinc-500">Creating mockups, prototyping layouts, design reviews (weeks).</p>
              </div>

              {/* Step 3 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-zinc-700" />
                <h4 className="text-xs font-bold text-zinc-400">3. Engineering Build</h4>
                <p className="text-[10px] text-zinc-500">Writing logic, API controllers, setting up schemas (months).</p>
              </div>

              {/* Step 4 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-zinc-700" />
                <h4 className="text-xs font-bold text-zinc-400">4. QA & Vulnerability Tests</h4>
                <p className="text-[10px] text-zinc-500">Writing test assertions, code reviews, debugging (weeks).</p>
              </div>

              {/* Step 5 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-zinc-700" />
                <h4 className="text-xs font-bold text-zinc-400">5. Deployment Pipeline</h4>
                <p className="text-[10px] text-zinc-500">Docker setups, load balancer updates, cluster launches (days).</p>
              </div>

            </div>

            <div className="text-[9px] font-mono text-zinc-500 pt-2 border-t border-white/5 flex items-center space-x-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Average cycle duration: 3 to 6 months</span>
            </div>
          </motion.div>

          {/* BuildAI OS Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-primary/10 bg-primary/2 p-6 md:p-8 space-y-8 relative overflow-hidden"
          >
            {/* Glowing auroras */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

            <div className="flex items-center space-x-2 text-primary font-bold uppercase text-[10px] tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>BuildAI OS Pipeline</span>
            </div>

            <div className="space-y-6 relative pl-4 border-l border-primary/30">
              
              {/* Step 1 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
                <h4 className="text-sm font-bold text-white">1. Describe your idea.</h4>
                <p className="text-xs text-zinc-400">Input your specifications in natural language, attach files, or speak your request.</p>
              </div>

              {/* Path connector visual */}
              <div className="py-2 pl-2">
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="text-primary"
                >
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </motion.div>
              </div>

              {/* Step 2 */}
              <div className="space-y-1 relative">
                <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-success" />
                <h4 className="text-sm font-bold text-white flex items-center">
                  2. Done.
                </h4>
                <p className="text-xs text-zinc-400">AI company coordinates schemas, codebases, tests, and deploys production containers automatically.</p>
              </div>

            </div>

            <div className="text-[9px] font-mono text-primary pt-2 border-t border-primary/10 flex items-center space-x-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Average cycle duration: 5 to 10 minutes</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
