"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Cpu,
  CloudLightning,
  Activity,
  FileCode,
  GitBranch,
  Lock,
  Layers,
  ChevronRight
} from "lucide-react";

export default function FeaturesPreview() {
  return (
    <section id="features" className="w-full py-24 md:py-32 bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-5xl px-6 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Capabilities
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Engineered for high autonomy.
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            Every feature is fine-tuned to remove human overhead. Your AI team coordinates plans, resolves code discrepancies, and manages deployments directly.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Autonomous Planning (Double Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -3 }}
            className="md:col-span-2 p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Autonomous Planning
              </h3>
              <p className="text-xs text-zinc-450 leading-relaxed max-w-md">
                CEO, PM, and Architect collaborate to outline project specs, draft dynamic database schemas, and output complete OpenAPI requirements before writing a single line of code.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Parallel AI Agents (Single Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -3 }}
            className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-secondary">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-secondary transition-colors">
                Parallel AI Agents
              </h3>
              <p className="text-xs text-zinc-455 leading-relaxed">
                Frontend and Backend developers construct views and APIs in sync, bypassing linear handoffs.
              </p>
            </div>
          </motion.div>

          {/* Card 3: One Click Deployment (Single Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -3 }}
            className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-success">
                <CloudLightning className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-success transition-colors">
                One Click Deployment
              </h3>
              <p className="text-xs text-zinc-455 leading-relaxed">
                Package assets, run assertions, map domain DNS configurations, and launch containers instantly.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Live Collaboration (Double Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -3 }}
            className="md:col-span-2 p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                Live Collaboration
              </h3>
              <p className="text-xs text-zinc-450 leading-relaxed max-w-md">
                Specialized agents exchange status checks instantly over an isolated event log, auditing conflicts and sync operations automatically to guarantee compilation success.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Memory Engine (Single Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -3 }}
            className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-zinc-400">
                <FileCode className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                Memory Engine
              </h3>
              <p className="text-xs text-zinc-455 leading-relaxed">
                Vector semantic store records details, maintaining framework updates across sprint boundaries.
              </p>
            </div>
          </motion.div>

          {/* Card 6: Version Control (Single Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -3 }}
            className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-zinc-400">
                <GitBranch className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                Version Control
              </h3>
              <p className="text-xs text-zinc-455 leading-relaxed">
                Reviewer agent triggers code checks on Git branches, resolving merge discrepancies cleanly.
              </p>
            </div>
          </motion.div>

          {/* Card 7: Cloud Native (Single Width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -3 }}
            className="p-6 md:p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-800 transition-all duration-300 group min-h-[220px]"
          >
            <div className="space-y-3">
              <div className="p-2 bg-white/5 border border-white/5 rounded-lg w-fit text-zinc-400">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-white transition-colors">
                Cloud Native
              </h3>
              <p className="text-xs text-zinc-455 leading-relaxed">
                Target serverless clusters natively (GCP Cloud Run, AWS Lambda, Kubernetes Ingress balancer).
              </p>
            </div>
          </motion.div>

          {/* Card 8: Enterprise Ready (Triple Width Footer Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -3 }}
            className="md:col-span-3 p-8 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col md:flex-row md:items-center justify-between hover:border-zinc-800 transition-all duration-300 group gap-6"
          >
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <Lock className="h-4 w-4" />
                <span className="uppercase tracking-wider text-[10px]">Security Standard</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Enterprise-grade sandbox environments
              </h3>
              <p className="text-xs text-zinc-450 leading-relaxed">
                All software operations run inside read-only isolated sandboxes with obfuscated secrets, secure tokens access checks, and SOC2-compliant system log trails.
              </p>
            </div>
            
            <a
              href="#pricing"
              className="inline-flex items-center justify-center h-10 px-5 rounded-full border border-border bg-[#050505] hover:bg-zinc-900 text-xs font-bold text-white transition-all duration-200 hover:scale-105 whitespace-nowrap self-start md:self-auto"
            >
              Learn More <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
