"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  Shield,
  FileText,
  Cpu,
  Database,
  Monitor,
  Code,
  CheckCircle,
  Lock,
  CloudLightning,
  Eye,
  Terminal,
  Loader2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight
} from "lucide-react";

// Types
interface AIGenerationCenterProps {
  prompt: string;
  interpretation: {
    type: string;
    stack: string;
    complexity: string;
    buildTime: string;
  };
  onClose: () => void;
  onComplete: () => void;
}

interface Agent {
  id: string;
  role: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgGradient: string;
  tasks: {
    idle: string;
    working: string;
    completed: string;
  };
  confidence: number;
}

// 10 Agents in the system
const AGENT_LIST: Agent[] = [
  {
    id: "ceo",
    role: "CEO Agent",
    name: "Aegis",
    icon: Shield,
    iconColor: "text-indigo-400 border-indigo-500/30",
    bgGradient: "from-indigo-650/20 to-indigo-950/20",
    tasks: {
      idle: "Awaiting instructions...",
      working: "Aligning product vision and architecture constraints...",
      completed: "Product strategy and objectives approved."
    },
    confidence: 99
  },
  {
    id: "pm",
    role: "Product Manager",
    name: "Scribe",
    icon: FileText,
    iconColor: "text-purple-400 border-purple-500/30",
    bgGradient: "from-purple-650/20 to-purple-950/20",
    tasks: {
      idle: "Awaiting PRD requirements...",
      working: "Defining user stories, epics, and requirements specifications...",
      completed: "Product Requirements Document (PRD) drafted."
    },
    confidence: 97
  },
  {
    id: "architect",
    role: "Software Architect",
    name: "Nexus",
    icon: Cpu,
    iconColor: "text-emerald-400 border-emerald-500/30",
    bgGradient: "from-emerald-650/20 to-emerald-950/20",
    tasks: {
      idle: "Awaiting PRD...",
      working: "Designing microservices structure and system boundaries...",
      completed: "System blueprints and block diagrams compiled."
    },
    confidence: 98
  },
  {
    id: "database",
    role: "Database Engineer",
    name: "Schema",
    icon: Database,
    iconColor: "text-blue-400 border-blue-500/30",
    bgGradient: "from-blue-650/20 to-blue-950/20",
    tasks: {
      idle: "Awaiting architecture...",
      working: "Designing tables, relation schemas, and index files...",
      completed: "PostgreSQL schemas & indexing plans generated."
    },
    confidence: 96
  },
  {
    id: "frontend",
    role: "Frontend Engineer",
    name: "Pixel",
    icon: Monitor,
    iconColor: "text-cyan-400 border-cyan-500/30",
    bgGradient: "from-cyan-650/20 to-cyan-950/20",
    tasks: {
      idle: "Awaiting blueprints...",
      working: "Scaffolding Tailwind component tree and global theme...",
      completed: "Tailwind UI page views engineered."
    },
    confidence: 95
  },
  {
    id: "backend",
    role: "Backend Engineer",
    name: "Core",
    icon: Code,
    iconColor: "text-teal-400 border-teal-500/30",
    bgGradient: "from-teal-650/20 to-teal-950/20",
    tasks: {
      idle: "Awaiting schemas...",
      working: "Drafting REST APIs, endpoints, and route controllers...",
      completed: "FastAPI endpoint handlers compiled."
    },
    confidence: 97
  },
  {
    id: "qa",
    role: "QA Engineer",
    name: "Spec",
    icon: CheckCircle,
    iconColor: "text-rose-400 border-rose-500/30",
    bgGradient: "from-rose-650/20 to-rose-950/20",
    tasks: {
      idle: "Awaiting codebase build...",
      working: "Formulating end-to-end endpoint tests and mocks...",
      completed: "Unit and integration test suites complete."
    },
    confidence: 98
  },
  {
    id: "security",
    role: "Security Engineer",
    name: "Sentinel",
    icon: Lock,
    iconColor: "text-amber-400 border-amber-500/30",
    bgGradient: "from-amber-650/20 to-amber-950/20",
    tasks: {
      idle: "Awaiting test reports...",
      working: "Auditing auth tokens, CORS, and sanitizing inputs...",
      completed: "Security vulnerabilities validation passed."
    },
    confidence: 99
  },
  {
    id: "devops",
    role: "DevOps Engineer",
    name: "Orbit",
    icon: CloudLightning,
    iconColor: "text-orange-400 border-orange-500/30",
    bgGradient: "from-orange-650/20 to-orange-950/20",
    tasks: {
      idle: "Awaiting packages...",
      working: "Preparing Docker files & cloud build pipeline integrations...",
      completed: "CI/CD deployment configurations generated."
    },
    confidence: 96
  },
  {
    id: "reviewer",
    role: "Reviewer",
    name: "Judge",
    icon: Eye,
    iconColor: "text-fuchsia-400 border-fuchsia-500/30",
    bgGradient: "from-fuchsia-650/20 to-fuchsia-950/20",
    tasks: {
      idle: "Awaiting build completion...",
      working: "Running final system compliance score assessments...",
      completed: "Build successfully validated. Final Quality Score: 98%."
    },
    confidence: 98
  }
];

// Collaboration log message templates
const logTriggers = [
  { p: 2, sender: "CEO", message: "Understanding business goals..." },
  { p: 5, sender: "CEO", message: "Drafting primary project goals and architecture constraints." },
  { p: 10, sender: "CEO", message: "Goal definitions locked. Handing off to Product Manager." },
  { p: 12, sender: "PM", message: "Generating product requirements..." },
  { p: 16, sender: "PM", message: "Generating standard User Personas and Epics." },
  { p: 20, sender: "PM", message: "PRD complete. Architecture validation required." },
  { p: 22, sender: "Architect", message: "Choosing Next.js + FastAPI..." },
  { p: 26, sender: "Architect", message: "Selecting stack: Next.js frontend with FastAPI backend." },
  { p: 30, sender: "Architect", message: "Blueprints exported." },
  { p: 32, sender: "Database", message: "Creating PostgreSQL schema..." },
  { p: 36, sender: "Database", message: "Generating database entity models and database indexes." },
  { p: 40, sender: "Database", message: "DDL statements exported to migration scripts." },
  { p: 42, sender: "Frontend", message: "Planning component tree..." },
  { p: 44, sender: "Backend", message: "Designing REST APIs..." },
  { p: 48, sender: "Backend", message: "Implementing standard JWT auth hooks." },
  { p: 52, sender: "Frontend", message: "Implementing interactive pages and state providers." },
  { p: 60, sender: "Frontend", message: "Codebase compiled. Dispatching to QA." },
  { p: 62, sender: "QA", message: "Preparing test strategy..." },
  { p: 66, sender: "QA", message: "Formulating code coverage reports (Target: >90%)." },
  { p: 70, sender: "QA", message: "Integration testing completed." },
  { p: 72, sender: "Security", message: "Reviewing authentication..." },
  { p: 76, sender: "Security", message: "Verifying CORS policies, headers, and input sanitization." },
  { p: 80, sender: "Security", message: "Compliance audit passed." },
  { p: 82, sender: "DevOps", message: "Preparing Cloud Run deployment..." },
  { p: 86, sender: "DevOps", message: "Syncing cloud engine configurations (Vercel + Google Cloud Run)." },
  { p: 90, sender: "DevOps", message: "Deployment verification success." },
  { p: 92, sender: "Reviewer", message: "Performing final code review & quality scoring..." },
  { p: 96, sender: "Reviewer", message: "Quality assurance checks verified." },
  { p: 98, sender: "Reviewer", message: "Quality score 98%." },
  { p: 100, sender: "SYSTEM", message: "Compilation completed successfully. Ready to launch." }
];

export default function AIGenerationCenter({
  prompt,
  interpretation,
  onClose,
  onComplete
}: AIGenerationCenterProps) {
  const [progress, setProgress] = useState(0);
  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activeAgentRef = useRef<HTMLDivElement>(null);

  // Helper: Get project name from prompt
  const getProjectName = (text: string) => {
    if (!text) return "AI Agent Sandbox";
    let clean = text.trim().replace(/^(build|create|make|generate)\s+(a|an|the)?\s+/i, "");
    clean = clean.split(/[.,;]/)[0];
    const words = clean.split(/\s+/).slice(0, 4);
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  };

  const projectName = getProjectName(prompt);

  // Simulate progress pipeline
  useEffect(() => {
    if (progress >= 100) {
      onComplete();
      return;
    }

    const intervalTime = isSpeedUp ? 60 : 250; // Speed up toggle
    const timer = setTimeout(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [progress, isSpeedUp, onComplete]);

  // Determine current active phase name
  const getCurrentPhase = () => {
    if (progress === 0) return "Initializing...";
    if (progress <= 10) return "Planning Phase (CEO)";
    if (progress <= 20) return "Requirements definition (PM)";
    if (progress <= 30) return "Architecture Design (Architect)";
    if (progress <= 40) return "Database engineering (DB)";
    if (progress <= 60) return "Frontend & Backend Development";
    if (progress <= 70) return "Testing and Quality Assurance (QA)";
    if (progress <= 80) return "Security Inspection (Sec)";
    if (progress <= 90) return "DevOps compilation (Ops)";
    if (progress < 100) return "Final code review (Reviewer)";
    return "Generation Completed";
  };

  // Estimate remaining time (seconds)
  const getEstTimeRemaining = () => {
    if (progress >= 100) return "Completed";
    const totalStepsRemaining = 100 - progress;
    const stepTime = isSpeedUp ? 0.06 : 0.25;
    const seconds = Math.ceil(totalStepsRemaining * stepTime);
    return `${seconds}s remaining`;
  };

  // Derive agent active states
  const getAgentState = (agentId: string) => {
    const activeRanges: { [key: string]: { start: number; end: number } } = {
      ceo: { start: 0, end: 10 },
      pm: { start: 10, end: 20 },
      architect: { start: 20, end: 30 },
      database: { start: 30, end: 40 },
      frontend: { start: 40, end: 60 },
      backend: { start: 40, end: 60 },
      qa: { start: 60, end: 70 },
      security: { start: 70, end: 80 },
      devops: { start: 80, end: 90 },
      reviewer: { start: 90, end: 100 }
    };

    const range = activeRanges[agentId];
    if (!range) return { status: "Idle" as const, cardProgress: 0 };

    if (progress > range.end) {
      return { status: "Completed" as const, cardProgress: 100 };
    } else if (progress > range.start && progress <= range.end) {
      const activeDuration = range.end - range.start;
      const currentElapsed = progress - range.start;
      const cardProgress = Math.round((currentElapsed / activeDuration) * 100);
      return { status: "Working" as const, cardProgress };
    } else {
      return { status: "Idle" as const, cardProgress: 0 };
    }
  };

  // Derive Artifact states
  const getArtifactState = (artifactId: string) => {
    // Requirements
    if (artifactId === "prd") {
      if (progress <= 10) return "Pending";
      if (progress <= 20) return "Generating";
      return "Complete";
    }
    // Architecture
    if (artifactId === "architecture") {
      if (progress <= 20) return "Pending";
      if (progress <= 30) return "Generating";
      return "Complete";
    }
    // Database Schema
    if (artifactId === "database") {
      if (progress <= 30) return "Pending";
      if (progress <= 40) return "Generating";
      return "Complete";
    }
    // API Contract
    if (artifactId === "api") {
      if (progress <= 40) return "Pending";
      if (progress <= 60) return "Generating"; // backend runs 40-60
      return "Complete";
    }
    // UI Component Tree
    if (artifactId === "components") {
      if (progress <= 40) return "Pending";
      if (progress <= 60) return "Generating"; // frontend runs 40-60
      return "Complete";
    }
    // Test Plan
    if (artifactId === "test") {
      if (progress <= 60) return "Pending";
      if (progress <= 80) return "Generating"; // QA & Security run 60-80
      return "Complete";
    }
    // Deployment Plan
    if (artifactId === "deployment") {
      if (progress <= 80) return "Pending";
      if (progress <= 90) return "Generating"; // DevOps runs 80-90
      return "Complete";
    }
    return "Pending";
  };

  // Filter logs that are triggered by progress
  const visibleLogs = logTriggers.filter(log => log.p <= progress);

  // Auto scroll logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleLogs.length]);

  // Scroll active agent card into view
  useEffect(() => {
    if (activeAgentRef.current) {
      activeAgentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [progress]);

  // Project Summary dynamic statistics
  const summaryDb = prompt.toLowerCase().includes("mongo")
    ? "MongoDB"
    : prompt.toLowerCase().includes("sqlite")
    ? "SQLite"
    : prompt.toLowerCase().includes("supabase")
    ? "Supabase"
    : "PostgreSQL";

  const summaryDeploy = prompt.toLowerCase().includes("aws")
    ? "AWS ECS"
    : prompt.toLowerCase().includes("gcp") || prompt.toLowerCase().includes("google cloud")
    ? "Google Cloud Run"
    : "Vercel / Cloud Run";

  const summaryEstFiles = interpretation.complexity === "High" ? 34 : interpretation.complexity === "Medium" ? 18 : 9;
  const summaryEstComps = interpretation.complexity === "High" ? 22 : interpretation.complexity === "Medium" ? 12 : 5;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#050505]/85 backdrop-blur-xl text-white font-sans overflow-hidden p-6 select-none animate-in fade-in duration-300">
      
      {/* Header bar */}
      <header className="h-16 flex items-center justify-between border-b border-white/5 pb-4 mb-5 flex-shrink-0">
        
        {/* Project Context */}
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(79,124,255,0.1)]">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="space-y-0.5 text-left">
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white tracking-tight">{projectName}</h2>
              <span className="text-[8px] font-mono text-zinc-500 border border-white/5 bg-white/2 px-1.5 py-0.5 rounded uppercase">
                Mission Control
              </span>
            </div>
            <p className="text-[10px] text-zinc-455 font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span>Phase: {getCurrentPhase()}</span>
            </p>
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div className="flex items-center space-x-8">
          
          {/* Progress Bar Container */}
          <div className="flex flex-col space-y-1.5 text-right w-64">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>Overall Progress</span>
              <span className="text-white font-extrabold">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-[#050505] border border-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex flex-col space-y-0.5 text-left bg-white/2 border border-white/5 px-3 py-1.5 rounded-lg font-mono">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider">Est. Remaining</span>
            <span className="text-xs text-white font-bold">{getEstTimeRemaining()}</span>
          </div>

          {/* Developer speed up option */}
          {progress < 100 && (
            <button
              onClick={() => setIsSpeedUp(!isSpeedUp)}
              className={`px-2 py-1 rounded text-[8px] font-mono border transition-all cursor-pointer ${
                isSpeedUp
                  ? "bg-secondary/20 border-secondary/40 text-secondary"
                  : "bg-white/2 border-white/5 text-zinc-500 hover:text-white"
              }`}
            >
              🚀 Speed Up Sim
            </button>
          )}

          {/* Close trigger */}
          <button
            onClick={onClose}
            disabled={progress < 100}
            className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
              progress < 100
                ? "bg-zinc-900 border-zinc-800 text-zinc-650 cursor-not-allowed"
                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-zinc-700 text-zinc-350 hover:text-white cursor-pointer"
            }`}
            title={progress < 100 ? "Generation in progress" : "Close Mission Control"}
          >
            <X className="h-4.5 w-4.5" />
          </button>

        </div>
      </header>

      {/* Middle Workspace: Left (Summary), Center (AI Team), Right (Logs) */}
      <div className="flex-grow grid grid-cols-12 gap-5 min-h-0 mb-5">
        
        {/* 1. LEFT PANEL: Project Summary */}
        <section className="col-span-3 flex flex-col space-y-4 min-h-0 bg-[#0B0B0F]/60 border border-white/5 rounded-2xl p-5 text-left overflow-y-auto custom-scrollbar">
          
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5">
            <Layers className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Project Specification
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            {/* User Prompt */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Original Prompt</span>
              <div className="p-3 bg-[#050505] rounded-xl border border-white/5 max-h-36 overflow-y-auto text-[11px] text-zinc-350 leading-relaxed font-sans scrollbar-thin select-text">
                "{prompt}"
              </div>
            </div>

            {/* Spec Details grid */}
            <div className="space-y-3 pt-2">
              
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Project Type</span>
                <span className="text-white font-extrabold">{interpretation.type || "SaaS Portal"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Target Stack</span>
                <span className="text-primary font-extrabold">{interpretation.stack || "Next.js + FastAPI"}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Database engine</span>
                <span className="text-indigo-400 font-extrabold font-mono">{summaryDb}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Deployment Host</span>
                <span className="text-emerald-400 font-extrabold font-mono">{summaryDeploy}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Complexity level</span>
                <span className={`font-extrabold uppercase px-1.5 py-0.5 rounded text-[9px] font-mono ${
                  interpretation.complexity === "High"
                    ? "bg-rose-500/10 border border-rose-500/20 text-rose-450"
                    : interpretation.complexity === "Low"
                    ? "bg-success/10 border border-success/20 text-success"
                    : "bg-primary/10 border border-primary/20 text-primary"
                }`}>
                  {interpretation.complexity || "Medium"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Est. codebase files</span>
                <span className="text-white font-extrabold font-mono">{summaryEstFiles} Files</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Est. UI Components</span>
                <span className="text-white font-extrabold font-mono">{summaryEstComps} Components</span>
              </div>

            </div>
          </div>
        </section>

        {/* 2. CENTER PANEL: AI Engineering Team Workflow */}
        <section className="col-span-6 flex flex-col min-h-0 bg-[#0B0B0F]/60 border border-white/5 rounded-2xl p-5 text-left relative overflow-hidden">
          
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5 mb-3.5 flex-shrink-0">
            <Cpu className="h-4 w-4 text-secondary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              AI Engineering Team Pipeline
            </h3>
            <span className="ml-auto text-[8px] font-mono text-zinc-550">
              Sequence of 10 Autonomous Subagents
            </span>
          </div>

          {/* Timeline scrollable wrapper */}
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 py-1 flex flex-col space-y-3 relative">
            
            <AnimatePresence initial={false}>
              {AGENT_LIST.map((agent, index) => {
                const { status, cardProgress } = getAgentState(agent.id);
                const AgentIcon = agent.icon;
                const isActive = status === "Working";
                const isCompleted = status === "Completed";
                const isIdle = status === "Idle";

                // Choose message based on state
                const currentTask = isCompleted
                  ? agent.tasks.completed
                  : isActive
                  ? agent.tasks.working
                  : agent.tasks.idle;

                return (
                  <div
                    key={agent.id}
                    ref={isActive ? activeAgentRef : null}
                    className={`relative p-3.5 rounded-xl border transition-all duration-300 ${
                      isCompleted
                        ? "border-success/15 bg-success/2"
                        : isActive
                        ? "border-primary/30 bg-primary/2 shadow-[0_0_15px_rgba(79,124,255,0.05)]"
                        : "border-white/5 bg-[#050505]/20 opacity-50"
                    }`}
                  >
                    
                    {/* Visual Connection Line between items */}
                    {index < AGENT_LIST.length - 1 && (
                      <div className="absolute bottom-[-14px] left-[26px] w-[1px] h-3.5 border-l border-dashed border-white/10 z-0" />
                    )}

                    <div className="flex items-center justify-between gap-4 relative z-10">
                      
                      {/* Left Block: Avatar & Agent Identity */}
                      <div className="flex items-center space-x-3 w-[180px] flex-shrink-0">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border bg-[#050505] flex-shrink-0 transition-colors ${
                          isCompleted
                            ? "border-success/30 text-success"
                            : isActive
                            ? "border-primary/40 text-primary animate-pulse"
                            : "border-white/5 text-zinc-550"
                        }`}>
                          <AgentIcon className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left space-y-0.5">
                          <h4 className="text-[11px] font-bold text-white leading-none">
                            {agent.role}
                          </h4>
                          <span className="text-[8px] font-mono text-zinc-500">
                            Agent: {agent.name}
                          </span>
                        </div>
                      </div>

                      {/* Center Block: Active Working Progress Bar / Task message */}
                      <div className="flex-grow text-left space-y-1">
                        <p className={`text-[10px] truncate leading-none ${
                          isCompleted ? "text-success font-medium" : isActive ? "text-zinc-200" : "text-zinc-500 font-mono"
                        }`}>
                          {currentTask}
                        </p>
                        
                        {isActive && (
                          <div className="w-full h-1 bg-[#050505] rounded-full overflow-hidden border border-white/5 mt-1.5">
                            <motion.div
                              className="h-full bg-primary"
                              initial={{ width: "0%" }}
                              animate={{ width: `${cardProgress}%` }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Right Block: Metadata Score, Status badge & Time */}
                      <div className="w-[120px] flex-shrink-0 flex items-center justify-end space-x-2 text-right">
                        
                        <div className="flex flex-col space-y-0.5 select-none font-mono">
                          <span className="text-[8px] text-zinc-500 leading-none uppercase">Confidence</span>
                          <span className={`text-[9px] font-bold leading-none ${
                            isCompleted ? "text-success" : isActive ? "text-primary" : "text-zinc-500"
                          }`}>
                            {agent.confidence}%
                          </span>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider leading-none ${
                            isCompleted
                              ? "bg-success/10 border border-success/20 text-success"
                              : isActive
                              ? "bg-primary/10 border border-primary/20 text-primary animate-pulse"
                              : "bg-white/2 border border-white/5 text-zinc-550"
                          }`}>
                            {status}
                          </span>
                          
                          {isActive && (
                            <span className="text-[8px] font-mono text-zinc-550 leading-none">
                              {cardProgress}%
                            </span>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </AnimatePresence>

          </div>
        </section>

        {/* 3. RIGHT PANEL: Live Collaboration Feed */}
        <section className="col-span-3 flex flex-col min-h-0 bg-[#0B0B0F]/60 border border-white/5 rounded-2xl p-5 text-left">
          
          <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5 mb-3.5 flex-shrink-0">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Collaboration Feed
            </h3>
          </div>

          {/* Console feed body */}
          <div className="flex-grow bg-[#050505] border border-white/5 rounded-xl p-4 overflow-y-auto font-mono text-[10px] space-y-3.5 custom-scrollbar pr-2 select-text">
            {visibleLogs.length === 0 ? (
              <div className="text-zinc-600 italic">Initializing live feed connection...</div>
            ) : (
              visibleLogs.map((log, idx) => {
                const isSystem = log.sender === "SYSTEM";
                const isReviewer = log.sender === "Reviewer";
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="leading-relaxed border-l border-zinc-800 pl-2.5 py-0.5"
                  >
                    <div className="flex items-center space-x-1.5 mb-0.5">
                      <span className={`text-[8px] font-bold uppercase px-1 py-0.2 rounded ${
                        isSystem
                          ? "bg-rose-500/10 text-rose-450"
                          : isReviewer
                          ? "bg-fuchsia-500/10 text-fuchsia-400"
                          : "bg-white/5 text-zinc-450"
                      }`}>
                        {log.sender}
                      </span>
                      <span className="text-[8px] text-zinc-650">[{log.p}%]</span>
                    </div>
                    <p className={`text-[10px] ${
                      isSystem
                        ? "text-success font-medium"
                        : isReviewer && log.message.includes("98%")
                        ? "text-fuchsia-400 font-medium"
                        : "text-zinc-355"
                    }`}>
                      {log.message}
                    </p>
                  </motion.div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </section>

      </div>

      {/* Bottom Panel: Artifacts Progress Cards */}
      <section className="h-40 flex-shrink-0 bg-[#0B0B0F]/60 border border-white/5 rounded-2xl p-5 text-left flex flex-col justify-between">
        
        {/* Section Title */}
        <div className="flex items-center space-x-2 border-b border-white/5 pb-2 flex-shrink-0">
          <Clock className="h-4 w-4 text-emerald-450" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Pipeline Output Artifacts
          </h3>
          <span className="ml-auto text-[8px] font-mono text-zinc-550">
            Real-time Compilation Deliverables
          </span>
        </div>

        {/* Deliverables cards row */}
        <div className="grid grid-cols-7 gap-3 mt-3 flex-grow min-h-0">
          {[
            { id: "prd", name: "Product Requirements" },
            { id: "architecture", name: "Architecture Diagram" },
            { id: "database", name: "Database Schema" },
            { id: "api", name: "API Contract" },
            { id: "components", name: "UI Component Tree" },
            { id: "test", name: "Test Plan" },
            { id: "deployment", name: "Deployment Plan" }
          ].map(artifact => {
            const status = getArtifactState(artifact.id);
            const isPending = status === "Pending";
            const isGenerating = status === "Generating";
            const isComplete = status === "Complete";

            return (
              <div
                key={artifact.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between text-left transition-all duration-300 relative overflow-hidden ${
                  isComplete
                    ? "border-success/20 bg-success/2 shadow-[0_0_12px_rgba(34,197,94,0.02)]"
                    : isGenerating
                    ? "border-primary/25 bg-primary/2 animate-pulse"
                    : "border-white/5 bg-[#050505]/40 opacity-50"
                }`}
              >
                {/* Artifact Label */}
                <h4 className="text-[10px] font-bold text-white leading-tight font-sans">
                  {artifact.name}
                </h4>

                {/* Bottom Status metadata */}
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[8px] font-mono font-bold uppercase tracking-wider leading-none ${
                    isComplete
                      ? "text-success"
                      : isGenerating
                      ? "text-primary animate-pulse"
                      : "text-zinc-650"
                  }`}>
                    {status}
                  </span>

                  {isGenerating && (
                    <Loader2 className="h-3 w-3 text-primary animate-spin" />
                  )}
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="h-3.5 w-3.5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success"
                    >
                      <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Floating Complete action button at 100% */}
      <AnimatePresence>
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[10000] flex items-center space-x-3 bg-[#0B0B0F]/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-md"
          >
            <div className="text-left select-none">
              <h4 className="text-xs font-bold text-white">Generation Successful!</h4>
              <p className="text-[9px] text-zinc-450">All 10 agents compiled their assets successfully.</p>
            </div>
            <button
              onClick={onClose}
              className="py-2 px-5 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-[#050505] transition-all hover:scale-102 flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-primary/20"
            >
              <span>Close & View Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
