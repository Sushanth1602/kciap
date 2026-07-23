"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import {
  Shield,
  FileText,
  Cpu,
  Monitor,
  Database,
  CheckSquare,
  CloudLightning,
  Clock,
  Terminal,
  Activity,
  Award,
} from "lucide-react";

interface Agent {
  id: string;
  role: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  avatarInitials: string;
  description: string;
  tasks: string[];
  dependencies: string[];
  confidence: string;
  estCompletion: string;
}

interface LogEvent {
  id: string;
  agentRole: string;
  message: string;
  time: string;
  color: "success" | "warning" | "primary" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
}

// Custom Counter Component that animates metrics on viewport entry
function MetricCounter({
  value,
  suffix = "",
  prefix = "",
  decimalPlaces = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimalPlaces?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.4,
      ease: [0.25, 0.1, 0.25, 1], // apple/linear cubic easing
      onUpdate(latest) {
        setCurrentVal(latest);
      },
    });
    return () => controls.stop();
  }, [value, inView]);

  const formatted = currentVal.toLocaleString([], {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return (
    <span ref={ref} className="font-extrabold text-white tracking-tight">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export default function AIMissionControl() {
  const [activeStep, setActiveStep] = useState(3); // Start at coding (step 3) for the initial requested snapshot
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Running state trackers for live-updating metrics
  const [tasksCompleted, setTasksCompleted] = useState(42);
  const [linesOfCode, setLinesOfCode] = useState(12504);
  const [deploymentsCount, setDeploymentsCount] = useState(8);

  const [logs, setLogs] = useState<LogEvent[]>([
    {
      id: "seed-1",
      agentRole: "CEO",
      message: "CEO approved product vision & roadmap.",
      time: "4m ago",
      color: "success",
      icon: Shield,
    },
    {
      id: "seed-2",
      agentRole: "Product Manager",
      message: "PM generated structured user stories.",
      time: "3m ago",
      color: "success",
      icon: FileText,
    },
    {
      id: "seed-3",
      agentRole: "Architect",
      message: "Architect designing PostgreSQL schemas.",
      time: "2m ago",
      color: "success",
      icon: Cpu,
    },
    {
      id: "seed-4",
      agentRole: "Backend",
      message: "Backend started generating REST endpoints.",
      time: "1m ago",
      color: "warning",
      icon: Database,
    },
    {
      id: "seed-5",
      agentRole: "Frontend",
      message: "Frontend building UI layout components.",
      time: "just now",
      color: "primary",
      icon: Monitor,
    },
  ]);

  const agents: Agent[] = [
    {
      id: "ceo",
      role: "CEO Agent",
      name: "Strategy Orchestrator",
      icon: Shield,
      avatarInitials: "CEO",
      description: "Defines product strategy, decomposes prompts into organizational deliverables, and checks compliance milestones.",
      tasks: ["Deconstructing prompts into milestones", "Approving final release build constraints"],
      dependencies: ["User requirements", "Competitive landscape"],
      confidence: "99.2%",
      estCompletion: "45s",
    },
    {
      id: "pm",
      role: "Product Manager",
      name: "Requirements Planner",
      icon: FileText,
      avatarInitials: "PM",
      description: "Translates product requirements into structured technical specifications, blueprints, and database layouts.",
      tasks: ["Mapping user stories to features", "Drafting system PRD documentation"],
      dependencies: ["CEO vision document", "Scoping deliverables"],
      confidence: "98.1%",
      estCompletion: "1m 15s",
    },
    {
      id: "architect",
      role: "Software Architect",
      name: "System Blueprint Designer",
      icon: Cpu,
      avatarInitials: "SA",
      description: "Designs API contracts, maps data layers, selects third-party integrations, and enforces structural patterns.",
      tasks: ["Modeling DB schema and constraints", "Defining REST route interfaces"],
      dependencies: ["PRD specifications", "API schema requirements"],
      confidence: "98.8%",
      estCompletion: "1m 40s",
    },
    {
      id: "frontend",
      role: "Frontend Engineer",
      name: "UI Systems Compiler",
      icon: Monitor,
      avatarInitials: "FE",
      description: "Generates responsive, interactive UI pages using modern frameworks and configures page routing layouts.",
      tasks: ["Compiling Tailwind layouts", "Structuring interactive page components"],
      dependencies: ["Architect system blueprints", "Mock endpoint schemes"],
      confidence: "97.5%",
      estCompletion: "3m 20s",
    },
    {
      id: "backend",
      role: "Backend Engineer",
      name: "API & Core Developer",
      icon: Database,
      avatarInitials: "BE",
      description: "Builds database migrations, route handlers, logic modules, and sets up middleware layers.",
      tasks: ["Scaffolding database schema queries", "Writing endpoint controller logic"],
      dependencies: ["API route definitions", "PostgreSQL database schemas"],
      confidence: "98.4%",
      estCompletion: "2m 50s",
    },
    {
      id: "qa",
      role: "QA Engineer",
      name: "Security & Test Validator",
      icon: CheckSquare,
      avatarInitials: "QA",
      description: "Runs unit, integration, and end-to-end tests inside a containerized sandbox, checking security logs.",
      tasks: ["Running automated Playwright validations", "Checking edge case boundaries"],
      dependencies: ["Frontend system builds", "Backend REST endpoints"],
      confidence: "99.9%",
      estCompletion: "2m 10s",
    },
    {
      id: "deploy",
      role: "DevOps Engineer",
      name: "Release Automator",
      icon: CloudLightning,
      avatarInitials: "DE",
      description: "Packages the application into containers, configures environments, and handles production deployment pipelines.",
      tasks: ["Packaging Docker service container", "Uploading serverless cloud variables"],
      dependencies: ["QA test suite signoff", "Release build artifacts"],
      confidence: "99.5%",
      estCompletion: "1m 30s",
    },
  ];

  // 9-Stage Natural Pipeline Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => {
        const nextStep = (prevStep + 1) % 9;
        
        let newLog: LogEvent;
        
        switch (nextStep) {
          case 0:
            newLog = {
              id: Math.random().toString(),
              agentRole: "CEO",
              message: "CEO approved product vision and roadmap.",
              time: "just now",
              color: "success",
              icon: Shield,
            };
            break;
          case 1:
            newLog = {
              id: Math.random().toString(),
              agentRole: "Product Manager",
              message: "PM generated technical user stories.",
              time: "just now",
              color: "success",
              icon: FileText,
            };
            break;
          case 2:
            newLog = {
              id: Math.random().toString(),
              agentRole: "Architect",
              message: "Architect designing PostgreSQL schemas.",
              time: "just now",
              color: "warning",
              icon: Cpu,
            };
            break;
          case 3:
            newLog = {
              id: Math.random().toString(),
              agentRole: "Frontend",
              message: "Frontend building UI layout components.",
              time: "just now",
              color: "primary",
              icon: Monitor,
            };
            // Add lines of code when development begins
            setLinesOfCode((prev) => prev + Math.floor(Math.random() * 150 + 100));
            break;
          case 4:
            newLog = {
              id: Math.random().toString(),
              agentRole: "Backend",
              message: "Backend exposing database REST endpoints.",
              time: "just now",
              color: "primary",
              icon: Database,
            };
            setLinesOfCode((prev) => prev + Math.floor(Math.random() * 200 + 120));
            break;
          case 5:
            newLog = {
              id: Math.random().toString(),
              agentRole: "QA",
              message: "QA executing automated test suite.",
              time: "just now",
              color: "warning",
              icon: CheckSquare,
            };
            break;
          case 6:
            newLog = {
              id: Math.random().toString(),
              agentRole: "System Check",
              message: "Security scanning dependencies and modules.",
              time: "just now",
              color: "neutral",
              icon: Activity,
            };
            break;
          case 7:
            newLog = {
              id: Math.random().toString(),
              agentRole: "DevOps",
              message: "DevOps deploying container image to Cloud Run.",
              time: "just now",
              color: "warning",
              icon: CloudLightning,
            };
            break;
          case 8:
            newLog = {
              id: Math.random().toString(),
              agentRole: "DevOps",
              message: "Reviewer approved release. App live on Cloud Run.",
              time: "just now",
              color: "success",
              icon: Award,
            };
            // Update metrics on complete cycles
            setTasksCompleted((prev) => prev + 1);
            setDeploymentsCount((prev) => prev + 1);
            break;
          default:
            newLog = {
              id: Math.random().toString(),
              agentRole: "System",
              message: "Cycle synced.",
              time: "just now",
              color: "neutral",
              icon: Activity,
            };
        }

        setLogs((prevLogs) => [newLog, ...prevLogs.filter(log => log.message !== newLog.message).slice(0, 10)]);
        return nextStep;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Compute status labels based on active 9-stage loop
  const getAgentStatus = (agentId: string) => {
    // 0: CEO roadmap, 1: PM specs, 2: Architect DB, 3: FE dashboard, 4: BE APIs, 5: QA tests, 6: Sec scan, 7: Deploying, 8: Release Live
    if (agentId === "ceo") {
      if (activeStep === 0) return { label: "Approving Vision...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 65 };
      if (activeStep > 0) return { label: "Approved Vision", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    if (agentId === "pm") {
      if (activeStep === 0) return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
      if (activeStep === 1) return { label: "Creating PRD...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 50 };
      if (activeStep > 1) return { label: "PRD Completed", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    if (agentId === "architect") {
      if (activeStep < 2) return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
      if (activeStep === 2) return { label: "Designing...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 45 };
      if (activeStep > 2) return { label: "Architecture Complete", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    if (agentId === "frontend") {
      if (activeStep < 3) return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
      if (activeStep === 3) return { label: "Building Dashboard...", color: "text-[#4F8CFF]", iconColor: "bg-[#4F8CFF]/5 border-[#4F8CFF]/15", progress: 75 };
      if (activeStep > 3) return { label: "UI Build Ready", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    if (agentId === "backend") {
      if (activeStep < 4) {
        if (activeStep === 3) return { label: "Compiling Models...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 30 };
        return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
      }
      if (activeStep === 4) return { label: "Generating APIs...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 60 };
      if (activeStep > 4) return { label: "APIs Integrated", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    if (agentId === "qa") {
      if (activeStep < 5) return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
      if (activeStep === 5) return { label: "Testing endpoints...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 70 };
      if (activeStep === 6) return { label: "Security Scanning...", color: "text-[#4F8CFF]", iconColor: "bg-[#4F8CFF]/5 border-[#4F8CFF]/15", progress: 85 };
      if (activeStep > 6) return { label: "100% Tests Passed", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    if (agentId === "deploy") {
      if (activeStep < 7) return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
      if (activeStep === 7) return { label: "Preparing Cloud Run...", color: "text-[#F59E0B]", iconColor: "bg-[#F59E0B]/5 border-[#F59E0B]/15", progress: 50 };
      if (activeStep === 8) return { label: "Deployed to Cloud", color: "text-[#22C55E]", iconColor: "bg-[#22C55E]/5 border-[#22C55E]/15", progress: 100 };
      return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
    }
    return { label: "Waiting", color: "text-zinc-500", iconColor: "bg-zinc-900/40 border-border/40", progress: 0 };
  };

  const getStepStatusDot = (statusLabel: string) => {
    if (statusLabel.includes("Waiting")) return "⚪";
    if (statusLabel.includes("Building") || statusLabel.includes("Ready") || statusLabel.includes("Scanning")) return "🔵";
    if (statusLabel.includes("Creating") || statusLabel.includes("Generating") || statusLabel.includes("Testing") || statusLabel.includes("Preparing") || statusLabel.includes("Designing") || statusLabel.includes("Approving") || statusLabel.includes("Compiling")) return "🟡";
    return "🟢";
  };

  // Node active statuses mapping
  const isNodeActive = (nodeId: string) => {
    if (activeStep === 0 || activeStep === 8) return nodeId === "ceo";
    if (activeStep === 1) return nodeId === "pm";
    if (activeStep === 2) return nodeId === "architect";
    if (activeStep === 3) return nodeId === "frontend";
    if (activeStep === 4) return nodeId === "backend";
    if (activeStep === 5 || activeStep === 6) return nodeId === "qa";
    if (activeStep === 7) return nodeId === "deploy";
    return false;
  };

  const isConnectionPulsing = (fromId: string, toId: string) => {
    if (fromId === "ceo" && toId === "pm") return activeStep === 0;
    if (fromId === "pm" && toId === "architect") return activeStep === 1;
    if (fromId === "architect" && toId === "frontend") return activeStep === 2;
    if (fromId === "architect" && toId === "backend") return activeStep === 2;
    if (fromId === "frontend" && toId === "qa") return activeStep === 3;
    if (fromId === "backend" && toId === "qa") return activeStep === 4;
    if (fromId === "qa" && toId === "deploy") return activeStep === 5 || activeStep === 6;
    return false;
  };

  // Workflow nodes
  const graphNodes = [
    { id: "ceo", x: 500, y: 55, label: "CEO" },
    { id: "pm", x: 500, y: 145, label: "PM" },
    { id: "architect", x: 500, y: 235, label: "Architect" },
    { id: "frontend", x: 340, y: 355, label: "Frontend" },
    { id: "backend", x: 660, y: 355, label: "Backend" },
    { id: "qa", x: 500, y: 475, label: "QA" },
    { id: "deploy", x: 500, y: 565, label: "Deploy" },
  ];

  const activeInspectAgent = hoveredNode ? agents.find((a) => a.id === hoveredNode) : null;

  return (
    <div id="mission-control" className="w-full pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title separator */}
      <div className="flex items-center justify-center space-x-4 mb-10">
        <span className="h-px w-16 bg-border/40" />
        <span className="text-[10px] font-mono font-extrabold tracking-[0.2em] text-zinc-500 uppercase">AI Mission Control</span>
        <span className="h-px w-16 bg-border/40" />
      </div>

      {/* Main card container */}
      <div className="relative rounded-3xl border border-border bg-[#111111] p-6 md:p-8 lg:p-12 shadow-2xl overflow-hidden max-w-[1200px] mx-auto subtle-glow hover:border-zinc-800 transition-all duration-300">
        {/* Subtle grid background inside dashboard */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          
          {/* Left Panel: Vertical Timeline of Agents */}
          <div className="flex flex-col border border-border/40 bg-zinc-950/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Clock className="h-3.5 w-3.5 mr-2 text-primary" />
                Collaborative Pipeline
              </span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </div>

            <div className="space-y-4.5 flex-1 overflow-y-auto max-h-[460px] pr-1">
              {agents.map((agent) => {
                const status = getAgentStatus(agent.id);
                const isActive = isNodeActive(agent.id);
                const dot = getStepStatusDot(status.label);

                return (
                  <div
                    key={agent.id}
                    className={`flex items-start space-x-3 rounded-xl border p-3.5 transition-all duration-300 ${
                      isActive
                        ? "bg-zinc-900/50 border-primary/30 shadow-sm"
                        : "bg-card/30 border-border/20"
                    }`}
                  >
                    {/* Avatar circular block */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-[10px] font-mono font-bold transition-all duration-300 ${status.iconColor}`}
                    >
                      {agent.avatarInitials}
                    </div>

                    {/* Agent text info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-extrabold text-white truncate">
                          {agent.role}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-600 whitespace-nowrap">
                          {isActive ? "active" : "standby"}
                        </span>
                      </div>

                      <div className="flex items-center text-[10px] font-mono">
                        <span className="mr-1">{dot}</span>
                        <span className={status.color}>{status.label}</span>
                      </div>

                      {/* Eased Progress Bar */}
                      <div className="h-1 w-full bg-zinc-800/60 rounded overflow-hidden mt-1.5">
                        <motion.div
                          className={`h-full ${
                            isActive ? "bg-primary" : status.progress === 100 ? "bg-emerald-500" : "bg-zinc-700"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${status.progress}%` }}
                          transition={{ ease: [0.25, 0.1, 0.25, 1], duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Panel: Interactive Workflow Graph */}
          <div className="flex flex-col border border-border/40 bg-zinc-950/20 rounded-2xl p-6 shadow-sm md:col-span-2 lg:col-span-1 min-h-[440px] justify-between relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Activity className="h-3.5 w-3.5 mr-2 text-primary" />
                Workflow Topology
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Inspect</span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full aspect-[4/4] sm:aspect-[4.5/3.8] lg:aspect-[4/4.5] flex-1">
              <svg
                viewBox="0 0 1000 640"
                className="absolute inset-0 w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* CONNECTIONS (CEO -> PM) */}
                <path d="M 500 85 L 500 115" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                {isConnectionPulsing("ceo", "pm") && (
                  <motion.path
                    d="M 500 85 L 500 115"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }} // slower connection pulse
                  />
                )}

                {/* CONNECTIONS (PM -> Architect) */}
                <path d="M 500 175 L 500 205" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                {isConnectionPulsing("pm", "architect") && (
                  <motion.path
                    d="M 500 175 L 500 205"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                )}

                {/* CONNECTIONS (Architect -> Frontend / Backend) */}
                <path d="M 500 265 C 500 295, 340 295, 340 325" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                <path d="M 500 265 C 500 295, 660 295, 660 325" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                {isConnectionPulsing("architect", "frontend") && (
                  <motion.path
                    d="M 500 265 C 500 295, 340 295, 340 325"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                )}
                {isConnectionPulsing("architect", "backend") && (
                  <motion.path
                    d="M 500 265 C 500 295, 660 295, 660 325"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                )}

                {/* CONNECTIONS (Frontend / Backend -> QA) */}
                <path d="M 340 385 C 340 415, 500 415, 500 445" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                <path d="M 660 385 C 660 415, 500 415, 500 445" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                {isConnectionPulsing("frontend", "qa") && (
                  <motion.path
                    d="M 340 385 C 340 415, 500 415, 500 445"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                )}
                {isConnectionPulsing("backend", "qa") && (
                  <motion.path
                    d="M 660 385 C 660 415, 500 415, 500 445"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                )}

                {/* CONNECTIONS (QA -> Deploy) */}
                <path d="M 500 505 L 500 535" stroke="#27272A" strokeWidth="2.5" strokeOpacity="0.4" />
                {isConnectionPulsing("qa", "deploy") && (
                  <motion.path
                    d="M 500 505 L 500 535"
                    stroke="#4F8CFF"
                    strokeWidth="2.5"
                    strokeDasharray="4, 12"
                    animate={{ strokeDashoffset: [0, -32] }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                )}

                {/* Nodes rendering */}
                {graphNodes.map((node) => {
                  const isActive = isNodeActive(node.id);
                  const isHovered = hoveredNode === node.id;
                  const agentData = agents.find((a) => a.id === node.id)!;
                  const Icon = agentData.icon;

                  return (
                    <g key={node.id}>
                      {/* Subtly glowing back ring */}
                      {isActive && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="31"
                          className="fill-none stroke-primary/20 stroke-[3px] animate-pulse"
                        />
                      )}

                      {/* Interactive target */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="26"
                        className="cursor-pointer fill-[#141416] stroke-border/60 hover:stroke-primary transition-all duration-300"
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />

                      {/* Icon */}
                      <g className="pointer-events-none">
                        <foreignObject
                          x={node.x - 9}
                          y={node.y - 9}
                          width="18"
                          height="18"
                        >
                          <Icon className={`h-4.5 w-4.5 transition-colors duration-300 ${isActive ? "text-primary" : "text-zinc-500"}`} />
                        </foreignObject>
                      </g>

                      {/* Label overlay below nodes */}
                      <text
                        x={node.x}
                        y={node.y + 40}
                        textAnchor="middle"
                        className="text-[9px] font-mono font-bold tracking-wider fill-zinc-500 pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Inspect Overlay Information Card Panel */}
            <div className="mt-4 border border-border/60 bg-zinc-950/80 rounded-2xl p-4 min-h-[140px] flex flex-col justify-center relative overflow-hidden shadow-inner">
              <AnimatePresence mode="wait">
                {activeInspectAgent ? (
                  <motion.div
                    key={activeInspectAgent.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded uppercase">INSPECT</span>
                        <span className="text-xs font-bold text-white">{activeInspectAgent.role}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        Conf: {activeInspectAgent.confidence}
                      </span>
                    </div>
                    
                    <p className="text-[10px] text-zinc-400 leading-normal">
                      {activeInspectAgent.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-border/40 text-[9px] font-mono text-zinc-500">
                      <div>
                        <strong className="text-zinc-400">Dependencies:</strong>
                        <div className="truncate text-[8px] mt-0.5">{activeInspectAgent.dependencies.join(", ")}</div>
                      </div>
                      <div>
                        <strong className="text-zinc-400">Est. Cycle:</strong>
                        <div className="text-[8px] text-primary mt-0.5">{activeInspectAgent.estCompletion}</div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs text-zinc-500 py-6 font-mono leading-relaxed max-w-[240px] mx-auto"
                  >
                    Hover over any workflow node to inspect execution details
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel: Continuous Activity Feed */}
          <div className="flex flex-col border border-border/40 bg-zinc-950/20 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Terminal className="h-3.5 w-3.5 mr-2 text-primary" />
                Live Activity Log
              </span>
              <span className="text-[9px] bg-zinc-900 border border-border/60 px-2 py-0.5 rounded text-zinc-500 font-mono">
                Streaming
              </span>
            </div>

            {/* Scrollable event log list */}
            <div className="space-y-3 flex-1 overflow-y-hidden max-h-[460px] pr-1 select-none">
              <AnimatePresence initial={false}>
                {logs.map((log) => {
                  const Icon = log.icon;
                  const borderClass =
                    log.color === "success"
                      ? "border-[#22C55E]/15 bg-[#22C55E]/5 text-[#22C55E]"
                      : log.color === "warning"
                      ? "border-[#F59E0B]/15 bg-[#F59E0B]/5 text-[#F59E0B]"
                      : log.color === "primary"
                      ? "border-[#4F8CFF]/15 bg-[#4F8CFF]/5 text-[#4F8CFF]"
                      : "border-border/30 bg-zinc-900/50 text-zinc-400";

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: -15, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className={`flex items-start space-x-2.5 rounded-xl border p-3 ${borderClass}`}
                    >
                      <div className="h-5.5 w-5.5 shrink-0 flex items-center justify-center rounded bg-zinc-950/60 border border-border/40">
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-[10px] font-semibold text-white tracking-tight leading-tight truncate">
                          {log.agentRole}
                        </p>
                        <p className="text-[10px] text-zinc-300 leading-normal">
                          {log.message}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 whitespace-nowrap">
                        {log.time}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Bottom Panel: Metrics Cards */}
        <div className="mt-10 pt-8 border-t border-border/60 grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
          {[
            { label: "Agents Active", value: 10, decimalPlaces: 0, suffix: "", sub: "Scoping agent threads" },
            { label: "Tasks Completed", value: tasksCompleted, decimalPlaces: 0, suffix: "", sub: "Milestone outputs" },
            { label: "Lines of Code", value: linesOfCode, decimalPlaces: 0, suffix: "", sub: "Incremental compiled" },
            { label: "Deployments", value: deploymentsCount, decimalPlaces: 0, suffix: "", sub: "Production releases" },
            { label: "Success Rate", value: 99.4, decimalPlaces: 1, suffix: "%", sub: "Lints & tests passed" },
          ].map((metric, idx) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: "easeOut" }}
              className="rounded-xl border border-border/60 bg-zinc-950/20 p-4 flex flex-col justify-between hover:border-zinc-800 transition-colors duration-200"
            >
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                {metric.label}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight block">
                <MetricCounter value={metric.value} suffix={metric.suffix} decimalPlaces={metric.decimalPlaces} />
              </div>
              <span className="text-[9px] text-zinc-500 block mt-1.5 font-mono">
                {metric.sub}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
