"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Plus,
  Terminal,
  HelpCircle,
  Layout,
  Server,
  Database,
  Cloud,
  Check
} from "lucide-react";
import PremiumBackground from "@/components/shared/PremiumBackground";

const SUGGESTIONS = [
  "CRM",
  "Marketplace",
  "AI SaaS",
  "Finance",
  "Healthcare",
  "Education",
  "Portfolio",
  "Internal Tool",
  "API",
  "Chatbot"
];

const FRONTEND_STACKS = ["Next.js", "React", "Vue"];
const BACKEND_STACKS = ["FastAPI", "Node.js", "Go"];
const DB_STACKS = ["PostgreSQL", "Supabase", "Firebase"];
const DEPLOY_STACKS = ["Cloud Run", "Vercel", "AWS"];

export default function NewProjectWizardPage() {
  const router = useRouter();
  
  // Prompt state
  const [prompt, setPrompt] = useState("");

  // Stack selection states
  const [frontend, setFrontend] = useState("Next.js");
  const [backend, setBackend] = useState("FastAPI");
  const [db, setDb] = useState("PostgreSQL");
  const [deploy, setDeploy] = useState("Cloud Run");

  // Dynamic AI parsing stats state
  const [aiAnalysis, setAiAnalysis] = useState({
    projectType: "SaaS",
    complexity: "Medium",
    estTime: "18 min",
    confidence: "98%"
  });

  // Automatically update AI understanding panel metrics based on prompt keywords
  useEffect(() => {
    const text = prompt.toLowerCase();
    let projectType = "SaaS";
    let complexity = "Medium";
    let estTime = "18 min";
    let confidence = "98%";

    if (!prompt.trim()) {
      setAiAnalysis({ projectType, complexity, estTime, confidence });
      return;
    }

    // Parse project category keywords
    if (text.includes("finance") || text.includes("billing") || text.includes("payment") || text.includes("bank")) {
      projectType = "Fintech Portal";
      complexity = "High";
      estTime = "24 min";
      confidence = "99%";
    } else if (text.includes("portfolio") || text.includes("resume") || text.includes("blog")) {
      projectType = "Portfolio View";
      complexity = "Low";
      estTime = "8 min";
      confidence = "97%";
    } else if (text.includes("marketplace") || text.includes("shop") || text.includes("store") || text.includes("ecommerce")) {
      projectType = "E-Commerce / Marketplace";
      complexity = "High";
      estTime = "32 min";
      confidence = "96%";
    } else if (text.includes("api") || text.includes("graphql") || text.includes("rest")) {
      projectType = "Web API Service";
      complexity = "Medium";
      estTime = "12 min";
      confidence = "98%";
    } else if (text.includes("health") || text.includes("doctor") || text.includes("patient") || text.includes("clinical")) {
      projectType = "Healthcare SaaS";
      complexity = "High";
      estTime = "28 min";
      confidence = "98%";
    } else if (text.includes("crm") || text.includes("customer") || text.includes("management")) {
      projectType = "CRM / Manager";
      complexity = "Medium";
      estTime = "15 min";
      confidence = "97%";
    } else if (text.includes("chatbot") || text.includes("ai chat") || text.includes("gpt") || text.includes("agent")) {
      projectType = "AI Agent Client";
      complexity = "High";
      estTime = "22 min";
      confidence = "95%";
    }

    // Automatically toggle stack parameters if typed
    if (text.includes("react")) setFrontend("React");
    if (text.includes("vue")) setFrontend("Vue");
    if (text.includes("next")) setFrontend("Next.js");

    if (text.includes("node") || text.includes("express") || text.includes("javascript backend")) setBackend("Node.js");
    if (text.includes("go") || text.includes("golang")) setBackend("Go");
    if (text.includes("fastapi") || text.includes("python backend")) setBackend("FastAPI");

    if (text.includes("supabase")) setDb("Supabase");
    if (text.includes("firebase") || text.includes("firestore")) setDb("Firebase");
    if (text.includes("postgres") || text.includes("sql")) setDb("PostgreSQL");

    if (text.includes("vercel")) setDeploy("Vercel");
    if (text.includes("aws") || text.includes("amazon")) setDeploy("AWS");
    if (text.includes("cloud run") || text.includes("gcp")) setDeploy("Cloud Run");

    setAiAnalysis({ projectType, complexity, estTime, confidence });
  }, [prompt]);

  const handleSuggestionClick = (sug: string) => {
    setPrompt(`Build a premium ${sug} system equipped with database synchronization, custom user dashboard widgets, and secure admin layouts.`);
  };

  const handleContinueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push("/app/projects/planning");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] selection:bg-primary/20">
      {/* Background elements */}
      <PremiumBackground />

      {/* Floating Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/3 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Header bar */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 z-10">
        <Link href="/dashboard" className="flex items-center space-x-2 group">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-[#0B0B0F] transition-all duration-350 group-hover:border-primary/50">
            <div className="h-3 w-3 rounded-sm bg-primary transition-all duration-500 group-hover:rotate-45" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
            BuildAI <span className="font-light text-zinc-400">OS</span>
          </span>
        </Link>
      </header>

      {/* Main split grid content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 flex items-center justify-center py-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Left Side: Inputs, Suggestions, Stack */}
          <div className="lg:col-span-8 space-y-8 text-left">
            
            {/* Steps Headers */}
            <div className="space-y-1 select-none">
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                What would you like to build?
              </h1>
              <p className="text-xs text-zinc-450 leading-relaxed">
                Describe your idea naturally. Our AI engineering team will handle the rest.
              </p>
            </div>

            {/* Prompt input area */}
            <div className="space-y-3">
              <div className="relative rounded-2xl border border-white/5 bg-[#0B0B0F]/90 shadow-2xl p-1.5 focus-within:border-primary/45 transition-all">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Build a SaaS platform for doctors with AI appointment scheduling, patient management, billing, analytics and mobile support..."
                  rows={6}
                  className="w-full p-3.5 bg-transparent text-xs text-white placeholder-zinc-550 outline-none border-none resize-none leading-relaxed"
                  autoFocus
                />
              </div>

              {/* Suggestions row capsules */}
              <div className="space-y-2 select-none">
                <span className="block text-[8px] font-bold text-zinc-650 uppercase tracking-widest">
                  Quick Suggestions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-2.5 py-1 rounded-full border border-white/5 bg-[#0B0B0F] hover:bg-white/5 text-[9px] font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Choose Stack Grid */}
            <div className="space-y-4 pt-2">
              <h2 className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest select-none">
                Choose Tech Stack
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Frontend */}
                <div className="space-y-2.5">
                  <span className="flex items-center text-[9px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                    <Layout className="h-3.5 w-3.5 text-primary mr-1.5" /> Frontend
                  </span>
                  <div className="space-y-1.5">
                    {FRONTEND_STACKS.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setFrontend(tech)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                          frontend === tech
                            ? "border-primary bg-primary/2 text-white"
                            : "border-white/5 bg-[#0B0B0F]/60 text-zinc-450 hover:text-white"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div className="space-y-2.5">
                  <span className="flex items-center text-[9px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                    <Server className="h-3.5 w-3.5 text-secondary mr-1.5" /> Backend
                  </span>
                  <div className="space-y-1.5">
                    {BACKEND_STACKS.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setBackend(tech)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                          backend === tech
                            ? "border-secondary bg-secondary/2 text-white"
                            : "border-white/5 bg-[#0B0B0F]/60 text-zinc-450 hover:text-white"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Database */}
                <div className="space-y-2.5">
                  <span className="flex items-center text-[9px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                    <Database className="h-3.5 w-3.5 text-success mr-1.5" /> Database
                  </span>
                  <div className="space-y-1.5">
                    {DB_STACKS.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setDb(tech)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                          db === tech
                            ? "border-success bg-success/2 text-white"
                            : "border-white/5 bg-[#0B0B0F]/60 text-zinc-450 hover:text-white"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deployment */}
                <div className="space-y-2.5">
                  <span className="flex items-center text-[9px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                    <Cloud className="h-3.5 w-3.5 text-[#4F7CFF] mr-1.5" /> Deployment
                  </span>
                  <div className="space-y-1.5">
                    {DEPLOY_STACKS.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => setDeploy(tech)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                          deploy === tech
                            ? "border-[#4F7CFF] bg-[#4F7CFF]/2 text-white"
                            : "border-white/5 bg-[#0B0B0F]/60 text-zinc-450 hover:text-white"
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Side: Live AI Understanding Panel */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest select-none text-left">
              AI Analysis Panel
            </h2>

            <div className="p-6 rounded-2xl border border-white/5 bg-[#0B0B0F]/85 shadow-2xl backdrop-blur-sm text-left relative overflow-hidden space-y-6">
              {/* Header metrics */}
              <div className="flex items-center space-x-2 select-none">
                <Terminal className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  Live Interpretation
                </span>
              </div>

              {/* Status List */}
              <div className="space-y-4 font-mono text-[10px] text-zinc-400">
                
                {/* Project Type */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Project Type</span>
                  <span className="text-white font-bold">{aiAnalysis.projectType}</span>
                </div>

                {/* Frontend */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Frontend Target</span>
                  <span className="text-primary font-bold">{frontend}</span>
                </div>

                {/* Backend */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Backend Target</span>
                  <span className="text-secondary font-bold">{backend}</span>
                </div>

                {/* Database */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Database Engine</span>
                  <span className="text-success font-bold">{db}</span>
                </div>

                {/* Deployment */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Deployment Route</span>
                  <span className="text-[#4F7CFF] font-bold">{deploy}</span>
                </div>

                {/* Complexity */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Complexity</span>
                  <span className={`font-bold ${
                    aiAnalysis.complexity === "High" ? "text-rose-400" : aiAnalysis.complexity === "Medium" ? "text-primary" : "text-success"
                  }`}>{aiAnalysis.complexity}</span>
                </div>

                {/* Est. time */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">Est. Deploy Time</span>
                  <span className="text-white font-bold">{aiAnalysis.estTime}</span>
                </div>

                {/* AI confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-550 font-bold uppercase tracking-wider text-[9px]">AI Confidence</span>
                  <span className="text-success font-bold flex items-center">
                    {aiAnalysis.confidence}
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Action bar */}
      <footer className="w-full border-t border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md py-4 z-10 flex justify-center">
        <div className="w-full max-w-5xl px-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="py-2 px-6 rounded-full border border-white/5 bg-[#050505] hover:bg-zinc-900 text-xs font-bold text-white transition-all cursor-pointer"
          >
            Cancel
          </Link>

          <button
            onClick={handleContinueSubmit}
            disabled={!prompt.trim()}
            className={`py-2 px-6 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              !prompt.trim()
                ? "bg-zinc-800 text-zinc-650 cursor-not-allowed border border-transparent"
                : "bg-primary hover:bg-primary/95 text-[#050505] hover:scale-[1.02] cursor-pointer"
            }`}
          >
            <span>Brief Team</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
