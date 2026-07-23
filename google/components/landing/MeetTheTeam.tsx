"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Cpu,
  Monitor,
  Code,
  Database,
  CheckSquare,
  Lock,
  CloudLightning,
  Eye
} from "lucide-react";

interface Agent {
  role: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  avatarColor: string;
  description: string;
  currentTask: string;
}

const AGENTS: Agent[] = [
  {
    role: "CEO",
    name: "Aegis",
    icon: Shield,
    avatarColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    description: "Orchestrates corporate vision, aligns roadmaps, and approves releases.",
    currentTask: "Analyzing Sprint 14 backlog and aligning deployment goals."
  },
  {
    role: "Product Manager",
    name: "Scribe",
    icon: FileText,
    avatarColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description: "Generates requirements, drafts specifications, and maps user flows.",
    currentTask: "Writing user authentication PRD specifications."
  },
  {
    role: "Architect",
    name: "Nexus",
    icon: Cpu,
    avatarColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description: "Plans systems topologies, models DB schemas, and maps endpoints.",
    currentTask: "Mapping distributed Graph database relations."
  },
  {
    role: "Frontend Engineer",
    name: "Pixel",
    icon: Monitor,
    avatarColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    description: "Constructs responsive views, manages states, and refines animations.",
    currentTask: "Integrating framer-motion transitions in layouts."
  },
  {
    role: "Backend Engineer",
    name: "Core",
    icon: Code,
    avatarColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    description: "Generates services logic, processes APIs, and builds workers.",
    currentTask: "Refactoring Go connection pooling routines."
  },
  {
    role: "Database Admin",
    name: "Query",
    icon: Database,
    avatarColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    description: "Optimizes indexing plans, runs migrations, and handles replication.",
    currentTask: "Analyzing slow execution plans in database logs."
  },
  {
    role: "QA Engineer",
    name: "Spec",
    icon: CheckSquare,
    avatarColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    description: "Writes assertions, runs regression tests, and reports security bugs.",
    currentTask: "Running Safari cookie token auth regression assertions."
  },
  {
    role: "Security Officer",
    name: "Sentinel",
    icon: Lock,
    avatarColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    description: "Audits vulnerability scanners, reviews keys, and monitors clusters.",
    currentTask: "Auditing package JSON imports for active CVE-2026 threats."
  },
  {
    role: "DevOps Engineer",
    name: "Orbit",
    icon: CloudLightning,
    avatarColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    description: "Coordinates Docker assets, configures K8s cluster rules, and manages SSL.",
    currentTask: "Updating deployment scripts configurations for staging nodes."
  },
  {
    role: "Reviewer",
    name: "Judge",
    icon: Eye,
    avatarColor: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
    description: "Approves git pull requests, inspects code styles, and enforces rules.",
    currentTask: "Enforcing TypeScript typing compliance on client hooks."
  }
];

export default function MeetTheTeam() {
  return (
    <section id="agents" className="w-full py-24 md:py-32 bg-[#050505] flex justify-center border-b border-white/5 overflow-hidden">
      <div className="w-full max-w-5xl px-6 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Collaborators
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Meet your AI engineering company.
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            Ten autonomous specialized agents working in absolute coordination. Each possesses a focused role, custom workflows, and dedicated execution targets.
          </p>
        </div>

        {/* Horizontal sliding row / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AGENTS.map((agent, idx) => {
            const AgentIcon = agent.icon;
            return (
              <motion.div
                key={agent.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: (idx % 5) * 0.1 }}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between p-5 rounded-xl border border-white/5 bg-[#0B0B0F]/45 hover:bg-[#0B0B0F]/90 hover:border-zinc-800 transition-all duration-300 subtle-glow-hover"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-lg border w-fit ${agent.avatarColor}`}>
                    <AgentIcon className="h-4 w-4" />
                  </div>

                  {/* Headers */}
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      {agent.role}
                    </h3>
                    <span className="text-[9px] font-mono text-zinc-500">
                      ID: {agent.name.toLowerCase()}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-zinc-455 leading-normal">
                    {agent.description}
                  </p>
                </div>

                {/* Current operational state */}
                <div className="mt-6 pt-3 border-t border-white/5 text-[9px]">
                  <span className="block text-[7px] text-zinc-650 font-bold uppercase tracking-wider mb-1">
                    Active task
                  </span>
                  <p className="text-zinc-400 font-medium leading-relaxed truncate group-hover:text-clip group-hover:whitespace-normal">
                    {agent.currentTask}
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
