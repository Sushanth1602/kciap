"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Eye,
  Play,
  Pause,
  ArrowRight,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import PremiumBackground from "@/components/shared/PremiumBackground";

interface Agent {
  role: string;
  name: string;
  task: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  confidence: number;
}

const AGENTS: Agent[] = [
  { role: "CEO", name: "Aegis", task: "Understanding Business Vision", icon: Shield, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", confidence: 99 },
  { role: "Product Manager", name: "Scribe", task: "Generating PRD Specifications", icon: FileText, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", confidence: 98 },
  { role: "Software Architect", name: "Nexus", task: "Designing System Architecture", icon: Cpu, color: "text-purple-400 bg-purple-500/10 border-purple-500/20", confidence: 96 },
  { role: "Database Engineer", name: "Query", task: "Creating Relational Schemas", icon: Database, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", confidence: 97 },
  { role: "Frontend Engineer", name: "Pixel", task: "Planning Component Tree Layouts", icon: Monitor, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", confidence: 95 },
  { role: "Backend Engineer", name: "Core", task: "Designing API Endpoint Specs", icon: Code, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20", confidence: 98 },
  { role: "QA Engineer", name: "Spec", task: "Writing Regression Test Plans", icon: CheckSquare, color: "text-rose-400 bg-rose-500/10 border-rose-500/20", confidence: 97 },
  { role: "Security Engineer", name: "Sentinel", task: "Reviewing compliance Risk Audits", icon: Lock, color: "text-teal-400 bg-teal-500/10 border-teal-500/20", confidence: 99 },
  { role: "DevOps Engineer", name: "Orbit", task: "Planning Deployment YAML scripts", icon: CloudLightning, color: "text-orange-400 bg-orange-500/10 border-orange-500/20", confidence: 96 },
  { role: "Reviewer", name: "Judge", task: "Checking Overall Quality Checklist", icon: Eye, color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20", confidence: 99 }
];

interface ChatMessage {
  sender: string;
  role: string;
  message: string;
  time: string;
}

const CHAT_TEMPLATES: Record<number, ChatMessage> = {
  0: { sender: "Aegis", role: "CEO", message: "Workspace params verified. Project vision approved. PM starting specifications.", time: "12:10:02" },
  1: { sender: "Scribe", role: "Product Manager", message: "Analyzing prompt parameters. Drafting user stories and database criteria.", time: "12:10:06" },
  2: { sender: "Nexus", role: "Software Architect", message: "PRD mapping received. Setting up modular container blueprints.", time: "12:10:10" },
  3: { sender: "Query", role: "Database Engineer", message: "Constructing relational indexing schemas and PostgreSQL constraints.", time: "12:10:14" },
  4: { sender: "Pixel", role: "Frontend Engineer", message: "Scaffolding Client layout maps. Awaiting API endpoint lists.", time: "12:10:18" },
  5: { sender: "Core", role: "Backend Engineer", message: "API specs established. REST web hooks endpoint details finalized.", time: "12:10:22" },
  6: { sender: "Spec", role: "QA Engineer", message: "Endpoint schemas locked. Commencing regression test validations setup.", time: "12:10:26" },
  7: { sender: "Sentinel", role: "Security Engineer", message: "Dependencies verified. Sandbox compliance scan complete: 0 warnings.", time: "12:10:30" },
  8: { sender: "Orbit", role: "DevOps Engineer", message: "Structuring cloud runtime hooks. Ingress balancer configs completed.", time: "12:10:34" },
  9: { sender: "Judge", role: "Reviewer", message: "All agent blueprints verify. Pipeline completed. Workspace ready.", time: "12:10:38" }
};

export default function PlanningPage() {
  const router = useRouter();

  // Simulation controls
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Editable Project details states
  const [projName, setProjName] = useState("AI SaaS Project");
  const [stack, setStack] = useState("Next.js • FastAPI");
  const [dbName, setDbName] = useState("PostgreSQL");
  const [deployTarget, setDeployTarget] = useState("Cloud Run");
  const [complexity, setComplexity] = useState("Medium");
  const [estTime, setEstTime] = useState("18 min");

  // Chats list state
  const [chats, setChats] = useState<ChatMessage[]>([
    { sender: "System OS", role: "Kernel", message: "Initializing agent collaboration logs stream...", time: "12:10:00" }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Increment timer & progress loop
  useEffect(() => {
    if (isPaused || progress >= 100) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });

      setElapsed((prev) => prev + 1.5);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPaused, progress]);

  // Synchronize dynamic chats additions as progress steps change
  useEffect(() => {
    const stepIdx = Math.min(Math.floor(progress / 10), 9);
    const template = CHAT_TEMPLATES[stepIdx];

    if (template && !chats.some((c) => c.message === template.message)) {
      setChats((prev) => [...prev, template]);
    }
  }, [progress, chats]);

  // Scroll collaboration logs feed to bottom automatically
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const activeAgentIndex = Math.min(Math.floor(progress / 10), 9);

  // Get status label of artifact cards dynamically
  const getArtifactStatus = (startRange: number, endRange: number) => {
    if (progress < startRange) return "Pending";
    if (progress >= startRange && progress < endRange) return "Generating";
    return "Completed";
  };

  const handleContinue = () => {
    if (progress < 100) return;
    alert("Deploying project code compilation to /dashboard!");
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] selection:bg-primary/20">
      {/* Background patterns */}
      <PremiumBackground />

      {/* Header bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 bg-[#050505]/40 select-none">
        
        {/* Project phase details */}
        <div className="text-left space-y-1 w-full sm:w-auto">
          <span className="text-[9px] font-mono text-zinc-550 uppercase tracking-widest block">
            ACTIVE PIPELINE PHASE
          </span>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center">
            {progress === 100 ? (
              <span className="flex items-center text-success">
                <CheckCircle2 className="h-4.5 w-4.5 mr-2" /> Compilation Ready
              </span>
            ) : (
              <span className="flex items-center">
                <Activity className="h-4 w-4 text-primary animate-pulse mr-2" />
                {AGENTS[activeAgentIndex].task}
              </span>
            )}
          </h1>
        </div>

        {/* Global Progress telemetry bar */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <div className="text-right font-mono text-[10px] text-zinc-400">
            <span>Overall Progress: </span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-40 h-2 bg-[#0B0B0F] border border-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="text-right font-mono text-[10px] text-zinc-400">
            <span>ETA: </span>
            <span className="text-white font-bold">{Math.max(30 - Math.round(progress * 0.3), 0)}s</span>
          </div>
        </div>

      </header>

      {/* Main three column viewport */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Project Details (Left) */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none text-left">
            Project Specs
          </h2>
          
          <div className="p-5 rounded-xl border border-white/5 bg-[#0B0B0F]/60 backdrop-blur-sm text-left space-y-4">
            
            {/* Project Name Input */}
            <div className="space-y-1">
              <label className="block text-[8px] font-bold text-zinc-550 uppercase tracking-wider">Project Name</label>
              <input
                type="text"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] text-white bg-[#050505] focus:border-primary/45 outline-none font-bold"
              />
            </div>

            {/* Tech Stack Input */}
            <div className="space-y-1">
              <label className="block text-[8px] font-bold text-zinc-550 uppercase tracking-wider">Tech Stack</label>
              <input
                type="text"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] text-white bg-[#050505] focus:border-primary/45 outline-none font-bold"
              />
            </div>

            {/* Database Input */}
            <div className="space-y-1">
              <label className="block text-[8px] font-bold text-zinc-550 uppercase tracking-wider">Database</label>
              <input
                type="text"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] text-white bg-[#050505] focus:border-primary/45 outline-none font-bold"
              />
            </div>

            {/* Deployment Target Input */}
            <div className="space-y-1">
              <label className="block text-[8px] font-bold text-zinc-550 uppercase tracking-wider">Deployment</label>
              <input
                type="text"
                value={deployTarget}
                onChange={(e) => setDeployTarget(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] text-white bg-[#050505] focus:border-primary/45 outline-none font-bold"
              />
            </div>

            {/* Estimated time / Complexity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-zinc-550 uppercase tracking-wider">Complexity</label>
                <input
                  type="text"
                  value={complexity}
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] text-white bg-[#050505] focus:border-primary/45 outline-none font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[8px] font-bold text-zinc-550 uppercase tracking-wider">Time</label>
                <input
                  type="text"
                  value={estTime}
                  onChange={(e) => setEstTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-white/5 text-[10px] text-white bg-[#050505] focus:border-primary/45 outline-none font-bold"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Column 2: Agent Timeline (Center) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none text-left">
            Pipeline Mesh
          </h2>

          <div className="relative border-l border-white/5 pl-6 ml-4 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar text-left">
            {AGENTS.map((agent, idx) => {
              const AgentIcon = agent.icon;
              const isActive = activeAgentIndex === idx && progress < 100;
              const isCompleted = activeAgentIndex > idx || progress === 100;

              return (
                <div key={agent.role} className="relative">
                  {/* Step node check icon */}
                  <span className={`absolute -left-[30px] top-1.5 h-4 w-4 rounded-full border flex items-center justify-center text-[7px] font-mono transition-all ${
                    isCompleted
                      ? "bg-success border-success text-[#050505]"
                      : isActive
                      ? "bg-primary border-primary text-[#050505] animate-pulse"
                      : "bg-[#050505] border-white/5 text-zinc-650"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </span>

                  {/* Agent card container */}
                  <div className={`p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/2 shadow-lg shadow-primary/5"
                      : "border-white/5 bg-[#0B0B0F]/45 opacity-60"
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border flex-shrink-0 ${agent.color}`}>
                          <AgentIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-xs font-bold text-white leading-none">{agent.role}</h4>
                            <span className="text-[8px] font-mono text-zinc-500">ID: {agent.name.toLowerCase()}</span>
                          </div>
                          <p className="text-[9px] text-zinc-450 leading-relaxed mt-1">{agent.task}</p>
                        </div>
                      </div>

                      {/* Right stats indicators */}
                      <div className="text-right font-mono text-[8px] text-zinc-550 flex flex-col justify-between h-8 flex-shrink-0 select-none">
                        <span>CONFIDENCE: <strong className="text-white">{agent.confidence}%</strong></span>
                        <span>ELAPSED: <strong className="text-white">{(elapsed / (idx + 1.2)).toFixed(1)}s</strong></span>
                      </div>
                    </div>

                    {/* Progress animation showing active steps */}
                    {isActive && (
                      <div className="mt-3.5 space-y-1">
                        <div className="w-full h-1 bg-[#050505] border border-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary"
                            animate={{ width: ["0%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </div>
                        <span className="text-[8px] font-mono text-primary font-bold uppercase tracking-wider block">
                          Synthesizing parameters...
                        </span>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Live Collaboration logs (Right) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none text-left">
            Collaboration Stream
          </h2>

          <div className="h-[500px] p-5 rounded-xl border border-white/5 bg-[#0B0B0F]/65 backdrop-blur-sm flex flex-col justify-between font-mono text-[9px] overflow-hidden">
            
            {/* Logs list viewport */}
            <div className="flex-grow overflow-y-auto space-y-3.5 custom-scrollbar pr-1 select-text">
              <AnimatePresence>
                {chats.map((c, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-1 text-left"
                  >
                    <div className="flex items-center space-x-1.5 select-none">
                      <span className="text-primary font-bold">{c.sender}</span>
                      <span className="text-[7px] text-zinc-550 font-bold uppercase tracking-wider px-1 rounded bg-white/5 border border-white/5 leading-normal">
                        {c.role}
                      </span>
                      <span className="text-zinc-650 text-[7px]">{c.time}</span>
                    </div>
                    <p className="text-zinc-350 leading-relaxed pl-0.5">
                      {c.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Status footer */}
            <div className="border-t border-white/5 pt-3 mt-4 flex items-center space-x-2 select-none text-zinc-600 text-[8px]">
              <Terminal className="h-3.5 w-3.5 text-zinc-550 animate-pulse" />
              <span className="uppercase font-bold tracking-wider">
                {progress === 100 ? "Collaboration completed." : "Streaming live agent dialog..."}
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* Generated Artifacts Status Cards (Bottom Section) */}
      <section className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/5 select-none">
        <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest text-left mb-4">
          Generated Artifacts
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: "PRD Document", start: 10, end: 20 },
            { name: "Architecture Diagram", start: 20, end: 35 },
            { name: "ER Diagram Schema", start: 30, end: 50 },
            { name: "API Specification", start: 50, end: 70 },
            { name: "Component Tree Layout", start: 70, end: 85 },
            { name: "Sprint Execution Plan", start: 85, end: 100 }
          ].map((art) => {
            const status = getArtifactStatus(art.start, art.end);
            return (
              <div
                key={art.name}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                  status === "Completed"
                    ? "border-success/20 bg-success/2"
                    : status === "Generating"
                    ? "border-primary/20 bg-primary/2"
                    : "border-white/5 bg-[#0B0B0F]/40 opacity-50"
                }`}
              >
                <h4 className="text-[10px] font-bold text-white truncate">{art.name}</h4>
                <div className="flex items-center justify-between text-[9px] font-mono font-medium">
                  <span className={`uppercase text-[8px] ${
                    status === "Completed" ? "text-success font-bold" : status === "Generating" ? "text-primary animate-pulse font-bold" : "text-zinc-650"
                  }`}>
                    {status}
                  </span>
                  {status === "Generating" && <Activity className="h-3 w-3 text-primary animate-spin" />}
                  {status === "Completed" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Actions footer */}
      <footer className="w-full border-t border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md py-4 z-10 flex justify-center select-none">
        <div className="w-full max-w-7xl px-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="py-2 px-6 rounded-full border border-white/5 bg-[#050505] hover:bg-zinc-900 text-xs font-bold text-white transition-all cursor-pointer"
          >
            Cancel
          </Link>

          <div className="flex items-center space-x-3">
            {/* Pause / Resume action */}
            {progress < 100 && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="py-2 px-4 rounded-full border border-white/5 hover:border-zinc-800 bg-[#050505] text-xs font-bold text-white transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                <span>{isPaused ? "Resume Planning" : "Pause Planning"}</span>
              </button>
            )}

            {/* Launch workspace button */}
            <button
              onClick={handleContinue}
              disabled={progress < 100}
              className={`py-2 px-6 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                progress < 100
                  ? "bg-zinc-850 text-zinc-650 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/95 text-[#050505] hover:scale-[1.02] cursor-pointer"
              }`}
            >
              <span>Continue to Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
