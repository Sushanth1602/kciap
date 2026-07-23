"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Cpu,
  Monitor,
  Database,
  CheckSquare,
  CloudLightning,
} from "lucide-react";

interface NodeData {
  id: string;
  role: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
  status: string;
  desc: string;
}

export default function HeroVisual() {
  const [activeStep, setActiveStep] = useState(0);

  const nodes: NodeData[] = [
    {
      id: "ceo",
      role: "CEO",
      name: "Strategy Agent",
      icon: Shield,
      x: 400,
      y: 50,
      status: "Idle",
      desc: "Deconstructing prompt...",
    },
    {
      id: "pm",
      role: "Product Manager",
      name: "PRD Agent",
      icon: FileText,
      x: 400,
      y: 150,
      status: "Idle",
      desc: "Mapping requirements...",
    },
    {
      id: "architect",
      role: "Architect",
      name: "System Agent",
      icon: Cpu,
      x: 400,
      y: 250,
      status: "Idle",
      desc: "Creating data schemas...",
    },
    {
      id: "frontend",
      role: "Frontend",
      name: "UI Agent",
      icon: Monitor,
      x: 260,
      y: 370,
      status: "Idle",
      desc: "Assembling React app...",
    },
    {
      id: "backend",
      role: "Backend",
      name: "API Agent",
      icon: Database,
      x: 540,
      y: 370,
      status: "Idle",
      desc: "Scaffolding DB models...",
    },
    {
      id: "qa",
      role: "QA Engineer",
      name: "Test Agent",
      icon: CheckSquare,
      x: 400,
      y: 490,
      status: "Idle",
      desc: "Validating edge cases...",
    },
    {
      id: "deploy",
      role: "Deployment",
      name: "DevOps Agent",
      icon: CloudLightning,
      x: 400,
      y: 590,
      status: "Idle",
      desc: "Pushing production build...",
    },
  ];

  // Map step index to node IDs that should be "active"
  const stepToNodeIds = [
    ["ceo"],
    ["pm"],
    ["architect"],
    ["frontend", "backend"],
    ["qa"],
    ["deploy"],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isNodeActive = (nodeId: string) => {
    return stepToNodeIds[activeStep].includes(nodeId);
  };

  const getNodeStatus = (node: NodeData) => {
    if (isNodeActive(node.id)) {
      return node.desc;
    }
    return "Standby";
  };

  // Helper to check if connection path is currently active (pulsing)
  const isConnectionActive = (fromId: string, toId: string) => {
    const currentActiveNodes = stepToNodeIds[activeStep];
    const nextActiveNodes = stepToNodeIds[(activeStep + 1) % 6];
    
    // An connection is active if data is flowing from the current active node(s) to the next
    if (fromId === "ceo" && toId === "pm") return currentActiveNodes.includes("ceo");
    if (fromId === "pm" && toId === "architect") return currentActiveNodes.includes("pm");
    if (fromId === "architect" && (toId === "frontend" || toId === "backend")) {
      return currentActiveNodes.includes("architect");
    }
    if ((fromId === "frontend" || fromId === "backend") && toId === "qa") {
      return currentActiveNodes.includes("frontend") || currentActiveNodes.includes("backend");
    }
    if (fromId === "qa" && toId === "deploy") return currentActiveNodes.includes("qa");
    
    return false;
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl border border-border bg-card/40 rounded-2xl p-6 md:p-8 subtle-glow overflow-hidden select-none">
      
      {/* Visual Canvas Card Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono text-zinc-400">Agent Network Orchestrator</span>
        </div>
        <div className="flex items-center space-x-1.5 bg-zinc-900 border border-border px-2 py-1 rounded-md">
          <span className="text-[10px] font-mono text-zinc-500">Pipeline Status:</span>
          <span className="text-[10px] font-mono text-primary font-medium uppercase">
            {activeStep === 3 ? "Coding" : activeStep === 5 ? "Deploying" : "Planning"}
          </span>
        </div>
      </div>

      {/* SVG Canvas for lines and node rendering */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4.5/3.5] lg:aspect-[8/6.5]">
        <svg
          viewBox="0 0 800 680"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* CONNECTIONS (CEO -> PM) */}
          <path d="M 400 110 L 400 150" stroke="#27272A" strokeWidth="2" />
          {isConnectionActive("ceo", "pm") && (
            <motion.path
              d="M 400 110 L 400 150"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            />
          )}

          {/* CONNECTIONS (PM -> Architect) */}
          <path d="M 400 210 L 400 250" stroke="#27272A" strokeWidth="2" />
          {isConnectionActive("pm", "architect") && (
            <motion.path
              d="M 400 210 L 400 250"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            />
          )}

          {/* CONNECTIONS (Architect -> Frontend / Backend) */}
          <path d="M 400 310 C 400 340, 260 340, 260 370" stroke="#27272A" strokeWidth="2" />
          <path d="M 400 310 C 400 340, 540 340, 540 370" stroke="#27272A" strokeWidth="2" />
          {isConnectionActive("architect", "frontend") && (
            <motion.path
              d="M 400 310 C 400 340, 260 340, 260 370"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
            />
          )}
          {isConnectionActive("architect", "backend") && (
            <motion.path
              d="M 400 310 C 400 340, 540 340, 540 370"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
            />
          )}

          {/* CONNECTIONS (Frontend / Backend -> QA) */}
          <path d="M 260 430 C 260 460, 400 460, 400 490" stroke="#27272A" strokeWidth="2" />
          <path d="M 540 430 C 540 460, 400 460, 400 490" stroke="#27272A" strokeWidth="2" />
          {isConnectionActive("frontend", "qa") && (
            <motion.path
              d="M 260 430 C 260 460, 400 460, 400 490"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
            />
          )}
          {isConnectionActive("backend", "qa") && (
            <motion.path
              d="M 540 430 C 540 460, 400 460, 400 490"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1.2 }}
            />
          )}

          {/* CONNECTIONS (QA -> Deploy) */}
          <path d="M 400 550 L 400 590" stroke="#27272A" strokeWidth="2" />
          {isConnectionActive("qa", "deploy") && (
            <motion.path
              d="M 400 550 L 400 590"
              stroke="#4F8CFF"
              strokeWidth="2"
              strokeDasharray="4, 8"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
            />
          )}

          {/* Render Nodes inside foreignObject */}
          {nodes.map((node) => {
            const active = isNodeActive(node.id);
            return (
              <foreignObject
                key={node.id}
                x={node.x - 90}
                y={node.y}
                width="180"
                height="64"
                className="overflow-visible"
              >
                <motion.div
                  className={`flex h-16 w-[180px] items-center rounded-xl border px-3 transition-all duration-300 ${
                    active
                      ? "border-primary bg-zinc-900 shadow-md shadow-primary/5"
                      : "border-border bg-card/85"
                  }`}
                  animate={active ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {/* Icon Block */}
                  {(() => {
                    const Icon = node.icon;
                    return (
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-300 ${
                          active
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-zinc-800/40 border-border text-zinc-400"
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 ${active ? "text-primary" : "text-zinc-400"}`} />
                      </div>
                    );
                  })()}

                  {/* Info Text */}
                  <div className="ml-3 flex flex-col justify-center text-left">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">
                      {node.role}
                    </span>
                    <span className="text-xs font-semibold text-white truncate max-w-[110px]">
                      {node.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono truncate max-w-[110px] mt-0.5 ${
                        active ? "text-primary" : "text-zinc-500"
                      }`}
                    >
                      {getNodeStatus(node)}
                    </span>
                  </div>

                  {/* Top pulsing node pointer */}
                  {active && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                    </span>
                  )}
                </motion.div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {/* Process Walkthrough Info Panel */}
      <div className="mt-6 border-t border-border/40 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
        <span>Active Stage: <strong className="text-white font-medium">{stepToNodeIds[activeStep].map(id => id.toUpperCase()).join(" + ")}</strong></span>
        <span>Automatic execution is running loop cycle</span>
      </div>
    </div>
  );
}
