"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUpRight,
  Clock,
  Layers,
  Folder,
  Cpu,
  CloudLightning,
  Timer,
  Play,
  CheckCircle,
  GitBranch,
  CircleDot,
  Paperclip,
  Mic,
  Shield,
  Code,
  Monitor,
  Database,
  Lock,
  ArrowRight,
  Plus,
  X,
  Loader2,
  Check
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AIGenerationCenter from "@/components/dashboard/AIGenerationCenter";

// Reusable Counter component to animate numbers on entering viewport
function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalDuration = 1000;
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
}

const CHIPS = [
  "CRM",
  "AI SaaS",
  "Marketplace",
  "Healthcare",
  "Education",
  "Finance",
  "Portfolio",
  "Internal Tool"
];

const ACTIVITIES = [
  { label: "Project Created", time: "10 mins ago", status: "done" },
  { label: "Architecture Generated", time: "8 mins ago", status: "done" },
  { label: "Frontend Started", time: "5 mins ago", status: "active" },
  { label: "Backend Completed", time: "Pending", status: "pending" },
  { label: "Deployment Ready", time: "Pending", status: "pending" }
];

interface AgentPreview {
  role: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const AGENTS: AgentPreview[] = [
  { role: "CEO", name: "Aegis", icon: Shield, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { role: "Architect", name: "Nexus", icon: Cpu, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { role: "Frontend", name: "Pixel", icon: Monitor, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { role: "Backend", name: "Core", icon: Code, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { role: "QA", name: "Spec", icon: CheckCircle, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  { role: "DevOps", name: "Orbit", icon: CloudLightning, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" }
];

export default function DashboardPage() {
  const router = useRouter();

  // Prompt creation states
  const [prompt, setPrompt] = useState("");
  const [showGenerationCenter, setShowGenerationCenter] = useState(false);
  const [generationCompleted, setGenerationCompleted] = useState(false);
  const [interpretation, setInterpretation] = useState({
    type: "SaaS",
    stack: "Next.js + FastAPI",
    complexity: "Medium",
    buildTime: "18 min"
  });

  // Real backend project state
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Modal creation states
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [initialPrompt, setInitialPrompt] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load projects from database
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("sb-access-token") || ""}`
          }
        });
        if (response.ok) {
          const list = await response.json();
          setProjectsList(list);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadProjects();
  }, []);

  // Calculate dynamic keyword analysis matching
  useEffect(() => {
    const text = prompt.toLowerCase();
    let type = "SaaS";
    let stack = "Next.js + FastAPI";
    let complexity = "Medium";
    let buildTime = "18 min";

    if (!prompt.trim()) {
      setInterpretation({ type, stack, complexity, buildTime });
      return;
    }

    if (text.includes("finance") || text.includes("billing") || text.includes("payment")) {
      type = "Fintech Portal";
      complexity = "High";
      buildTime = "24 min";
    } else if (text.includes("portfolio") || text.includes("blog")) {
      type = "Portfolio Website";
      complexity = "Low";
      buildTime = "8 min";
    } else if (text.includes("marketplace") || text.includes("ecommerce")) {
      type = "E-Commerce";
      complexity = "High";
      buildTime = "32 min";
    } else if (text.includes("health") || text.includes("hospital") || text.includes("patient")) {
      type = "Healthcare SaaS";
      complexity = "High";
      buildTime = "28 min";
    } else if (text.includes("crm") || text.includes("management")) {
      type = "CRM Manager";
      complexity = "Medium";
      buildTime = "15 min";
    }

    if (text.includes("react")) stack = "React + Node.js";
    if (text.includes("vue")) stack = "Vue + FastAPI";
    if (text.includes("go") || text.includes("golang")) stack = "Next.js + Go";

    setInterpretation({ type, stack, complexity, buildTime });
  }, [prompt]);

  const handleSuggestionClick = (chip: string) => {
    setPrompt(`Build a premium ${chip} platform with user authentication, secure payment workflows, and real-time dashboard analytics.`);
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setInitialPrompt(prompt);
    setProjectName("");
    setProjectDesc("");
    setModalError(null);
    setShowNewProjectModal(true);
  };

  const handleNewProjectClick = () => {
    setProjectName("");
    setProjectDesc("");
    setInitialPrompt("");
    setModalError(null);
    setShowNewProjectModal(true);
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectDesc.trim() || !initialPrompt.trim()) {
      setModalError("All fields are required.");
      return;
    }

    setModalLoading(true);
    setModalError(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("sb-access-token") || ""}`
        },
        body: JSON.stringify({
          title: projectName.trim(),
          prompt: `${projectDesc.trim()}\n\nInitial Prompt:\n${initialPrompt.trim()}`
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create project.");
      }

      setToastMessage("Project Created Successfully!");
      setTimeout(() => setToastMessage(null), 3000);

      setShowNewProjectModal(false);
      setProjectName("");
      setProjectDesc("");
      setInitialPrompt("");

      // Redirect to /workspace?id=<projectId>
      router.push(`/workspace?id=${result.projectId}`);
    } catch (err: any) {
      setModalError(err.message || "An unexpected API error occurred.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-10 bg-[#050505] text-white">
        
        {/* Page Heading Title */}
        <div className="flex items-center justify-between select-none text-left flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Good Afternoon 👋
            </h1>
            <p className="text-xs text-zinc-400 font-medium">
              Welcome back to BuildAI OS. Your AI engineering team is ready to build.
            </p>
          </div>
          <button
            onClick={handleNewProjectClick}
            className="py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/95 text-[#050505] text-xs font-bold transition-all hover:scale-102 flex items-center space-x-1.5 shadow-md shadow-primary/5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Dashboard grid columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left: prompt creator and projects list */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Build With AI */}
            <div className="space-y-4 text-left">
              <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none">
                Build With AI
              </h2>

              {/* Large Premium Prompt Card */}
              <div className="rounded-2xl border border-white/5 bg-[#0B0B0F]/70 shadow-2xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                
                {/* Prompt Card Left (Inputs, text area, actions) */}
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 select-none">
                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" /> What would you like to build today?
                    </h3>
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      Describe your application naturally. Our AI engineering team will plan, design, build and deploy it.
                    </p>
                  </div>

                  {/* Auto-growing Textarea Input */}
                  <div className="relative rounded-xl border border-white/5 bg-[#050505]/60 focus-within:border-primary/45 transition-all p-1.5">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Example: Build a hospital management SaaS with authentication, AI appointment scheduling, analytics and mobile support."
                      rows={Math.max(3, Math.min(6, Math.floor(prompt.length / 45) + 1))}
                      className="w-full p-2 bg-transparent text-[11px] text-white placeholder-zinc-550 outline-none border-none resize-none leading-relaxed select-text"
                    />
                  </div>

                  {/* Suggestion pills row */}
                  <div className="space-y-1.5 select-none">
                    <span className="block text-[8px] font-bold text-zinc-650 uppercase tracking-widest">
                      Suggestions
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleSuggestionClick(chip)}
                          className="px-2 py-0.5 rounded-full border border-white/5 bg-[#050505] hover:bg-white/5 text-[9px] font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer toolbar row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 flex-wrap gap-2 select-none">
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => alert("Attach local design specs / mockup file (mock).")}
                        className="p-1.5 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 text-zinc-440 hover:text-white transition-colors cursor-pointer"
                        title="Attach file"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => alert("Voice input activation (mock).")}
                        className="p-1.5 rounded-lg border border-white/5 bg-[#050505] hover:bg-white/5 text-zinc-440 hover:text-white transition-colors cursor-pointer"
                        title="Voice dictation"
                      >
                        <Mic className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className={`py-1.5 px-4 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5 ${
                        !prompt.trim()
                          ? "bg-zinc-800 text-zinc-650 cursor-not-allowed"
                          : "bg-primary hover:bg-primary/95 text-[#050505] hover:scale-102 cursor-pointer shadow-md shadow-primary/5"
                      }`}
                    >
                      <span>Generate Project</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Card Right Panel (AI team preview or AI interpretation output) */}
                <div className="w-full md:w-[220px] border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 flex flex-col justify-between flex-shrink-0">
                  <AnimatePresence mode="wait">
                    {!prompt.trim() ? (
                      /* AI Team Preview state */
                      <motion.div
                        key="team-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3.5 w-full text-left"
                      >
                        <div className="flex items-center space-x-1.5 select-none">
                          <CircleDot className="h-3.5 w-3.5 text-success animate-pulse" />
                          <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-wider">
                            AI Team Preview
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                          {AGENTS.map((agent) => {
                            const Icon = agent.icon;
                            return (
                              <div
                                key={agent.role}
                                className="flex items-center justify-between p-1.5 rounded-lg border border-white/5 bg-[#050505]/40 select-none"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`p-1 rounded bg-[#050505] border border-white/5 ${agent.color}`}>
                                    <Icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-[10px] font-bold text-white">{agent.role}</span>
                                </div>
                                <span className="text-[8px] font-mono font-bold text-success bg-success/10 border border-success/20 px-1 py-0.5 rounded uppercase leading-none scale-90">
                                  Ready
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : (
                      /* Live AI Interpretation output */
                      <motion.div
                        key="ai-interpretation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3.5 w-full text-left font-mono text-[9px] text-zinc-400"
                      >
                        <div className="flex items-center space-x-1.5 select-none">
                          <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                          <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">
                            AI Interpretation
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="border-b border-white/5 pb-1.5">
                            <span className="text-zinc-550 uppercase tracking-wider text-[8px] block">Project Type</span>
                            <span className="text-white font-bold text-[10px]">{interpretation.type}</span>
                          </div>
                          <div className="border-b border-white/5 pb-1.5">
                            <span className="text-zinc-550 uppercase tracking-wider text-[8px] block">Recommended Stack</span>
                            <span className="text-primary font-bold text-[10px]">{interpretation.stack}</span>
                          </div>
                          <div className="border-b border-white/5 pb-1.5">
                            <span className="text-zinc-550 uppercase tracking-wider text-[8px] block">Complexity</span>
                            <span className={`font-bold text-[10px] ${
                              interpretation.complexity === "High" ? "text-rose-400" : interpretation.complexity === "Medium" ? "text-primary" : "text-success"
                            }`}>{interpretation.complexity}</span>
                          </div>
                          <div>
                            <span className="text-zinc-550 uppercase tracking-wider text-[8px] block">Est. Build Time</span>
                            <span className="text-white font-bold text-[10px]">{interpretation.buildTime}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>

            {/* Section 2: Recent Projects */}
            <div className="space-y-4 text-left">
              <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none">
                Recent Projects
              </h2>

              <div className="space-y-3">
                {loadingProjects ? (
                  <div className="py-8 text-center text-xs text-zinc-550 font-mono animate-pulse">
                    Loading your projects from Supabase...
                  </div>
                ) : projectsList.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-555 font-mono">
                    No active projects. Click "New Project" to start!
                  </div>
                ) : (
                  projectsList.map((proj, idx) => (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="p-5 rounded-xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-zinc-800 transition-colors"
                    >
                      <div className="space-y-2 text-left">
                        <div className="flex items-center space-x-2.5">
                          <h3 className="text-xs font-bold text-white tracking-tight">{proj.title}</h3>
                          <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                            Next.js • FastAPI
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-3 text-[9px] text-zinc-500 font-mono">
                          <span className="flex items-center gap-1">
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              proj.status.includes("Reviewer") || proj.status === "completed"
                                ? "bg-success"
                                : "bg-primary animate-pulse"
                            }`} />
                            {proj.status}
                          </span>
                          <span>•</span>
                          <span>Created {new Date(proj.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 justify-between sm:justify-end flex-shrink-0">
                        <button
                          onClick={() => router.push(`/workspace?id=${proj.id}`)}
                          className="py-1.5 px-4 rounded-lg bg-[#050505] border border-white/5 hover:border-zinc-700 text-[10px] font-bold text-white transition-all cursor-pointer select-none"
                        >
                          Open Workspace
                        </button>
                      </div>

                    </motion.div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Column Right: Stats & Activity Timeline */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Section 4: Workspace Statistics */}
            <div className="space-y-4 text-left">
              <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none">
                Workspace Statistics
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Projects", value: projectsList.length, icon: Folder, color: "text-primary" },
                  { label: "AI Agents", value: 10, icon: Cpu, color: "text-secondary" },
                  { label: "Deployments", value: 24, icon: CloudLightning, color: "text-success" },
                  { label: "Hours Saved", value: 132, icon: Timer, color: "text-amber-400" }
                ].map((stat, idx) => {
                  const StatIcon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="p-4 rounded-xl border border-white/5 bg-[#0B0B0F]/60 text-left space-y-2 relative overflow-hidden"
                    >
                      <StatIcon className={`h-4 w-4 ${stat.color} opacity-80`} />
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                          {stat.label}
                        </span>
                        <span className="text-xl font-extrabold text-white tracking-tight font-mono">
                          <Counter value={stat.value} />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Recent Activity (Timeline) */}
            <div className="space-y-4 text-left">
              <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none">
                Recent Activity
              </h2>

              <div className="p-5 rounded-xl border border-white/5 bg-[#0B0B0F]/60 text-left relative overflow-hidden">
                <div className="space-y-5 relative pl-4 border-l border-white/5 font-mono text-[9px]">
                  <div className="absolute top-1 bottom-1 left-[-1px] w-[2px] bg-gradient-to-b from-primary via-primary/40 to-transparent" />

                  {ACTIVITIES.map((act) => (
                    <div key={act.label} className="space-y-1 relative">
                      <span className={`absolute -left-[21px] top-1 h-2 w-2 rounded-full border border-background ${
                        act.status === "done"
                          ? "bg-success"
                          : act.status === "active"
                          ? "bg-primary animate-pulse"
                          : "bg-zinc-800"
                      }`} />

                      <h4 className="text-[11px] font-bold text-white leading-tight">
                        {act.label}
                      </h4>
                      <p className="text-[9px] text-zinc-500 font-mono">
                        {act.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* New Project Dialog Modal Overlay */}
      <AnimatePresence>
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-white/5 bg-[#0B0B0F]/95 p-6 space-y-5 shadow-2xl relative text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1.5 select-none">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-primary" /> Create New Project
                </h3>
                <p className="text-[11px] text-zinc-500 leading-normal">
                  Configure your new software project details below to brief the AI engineering team.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitProject} className="space-y-4">
                {/* Error Banner */}
                {modalError && (
                  <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-bold font-mono">
                    {modalError}
                  </div>
                )}

                {/* Project Name */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Example: E-Commerce Store"
                    className="w-full p-3 rounded-xl border border-white/5 bg-[#050505]/60 text-xs text-white placeholder-zinc-550 focus:border-primary/45 outline-none transition-all"
                  />
                </div>

                {/* Project Description */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Project Description
                  </label>
                  <input
                    type="text"
                    required
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    placeholder="Example: A premium digital marketplace with Stripe integration."
                    className="w-full p-3 rounded-xl border border-white/5 bg-[#050505]/60 text-xs text-white placeholder-zinc-550 focus:border-primary/45 outline-none transition-all"
                  />
                </div>

                {/* Initial Prompt */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Initial Prompt
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={initialPrompt}
                    onChange={(e) => setInitialPrompt(e.target.value)}
                    placeholder="Describe specific features: user auth, real-time messaging, database schema..."
                    className="w-full p-3 rounded-xl border border-white/5 bg-[#050505]/60 text-xs text-white placeholder-zinc-550 focus:border-primary/45 outline-none transition-all resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="px-4 py-2 rounded-xl border border-white/5 bg-[#050505] hover:bg-white/5 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/95 disabled:bg-zinc-800 text-[#050505] disabled:text-zinc-650 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-md shadow-primary/5"
                  >
                    {modalLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <span>Brief Team</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl border border-success/20 bg-success/5 backdrop-blur-md text-success text-xs font-bold shadow-lg"
          >
            <Check className="h-4 w-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
