"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Database,
  Layout,
  Server,
  Cloud,
  BrainCircuit,
  Terminal,
  Activity,
  Check
} from "lucide-react";
import PremiumBackground from "@/components/shared/PremiumBackground";

type SetupStep = 1 | 2 | 3 | 4 | 5;

const SUGGESTIONS = [
  "Web App",
  "AI Agent",
  "SaaS",
  "Mobile App",
  "API",
  "Internal Tool"
];

const FRONTEND_STACKS = ["Next.js", "React", "Vue", "Angular"];
const BACKEND_STACKS = ["Node.js", "FastAPI", "Go", "Java"];
const DB_STACKS = ["PostgreSQL", "Supabase", "Firebase", "MongoDB"];
const DEPLOY_STACKS = ["Cloud Run", "Vercel", "AWS", "Azure"];

const MODELS = [
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    desc: "Optimized for massive context windows, multimodal analysis, and Google Cloud sync."
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    desc: "Outstanding reasoning, code generation accuracy, and formatting compliance."
  },
  {
    id: "gpt",
    name: "GPT-4o",
    provider: "OpenAI",
    desc: "Fast, robust problem solving, tool calling, and general purpose execution."
  },
  {
    id: "opensource",
    name: "Llama 3 / DeepSeek",
    provider: "Self-Hosted",
    desc: "Finetuned open-weights model, fully isolated for zero data retention compliance."
  }
];

export default function OnboardingSetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SetupStep>(1);

  // Form states
  const [workspaceName, setWorkspaceName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedFrontend, setSelectedFrontend] = useState("Next.js");
  const [selectedBackend, setSelectedBackend] = useState("Node.js");
  const [selectedDb, setSelectedDb] = useState("PostgreSQL");
  const [selectedDeploy, setSelectedDeploy] = useState("Cloud Run");
  const [selectedModel, setSelectedModel] = useState("gemini");
  
  // Terminal init animation progress
  const [initTasks, setInitTasks] = useState([
    { label: "Creating Workspace Sandbox", status: "pending" },
    { label: "Initializing 10 Specialized AI Team Employees", status: "pending" },
    { label: "Drafting Architecture blueprints", status: "pending" }
  ]);

  const handleNextStep = () => {
    if (currentStep === 1 && !workspaceName.trim()) {
      alert("Please provide a name for your workspace.");
      return;
    }
    if (currentStep === 2 && !projectDescription.trim()) {
      alert("Please describe what you are building.");
      return;
    }

    if (currentStep === 4) {
      // Trigger mock compilation delay for step 5
      setCurrentStep(5);
      runTelemetryAnimation();
      return;
    }

    setCurrentStep((prev) => (prev + 1) as SetupStep);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev - 1) as SetupStep);
  };

  const runTelemetryAnimation = () => {
    // Sequentially mark tasks as successful
    setTimeout(() => {
      setInitTasks((prev) =>
        prev.map((t, idx) => (idx === 0 ? { ...t, status: "done" } : t))
      );
    }, 800);

    setTimeout(() => {
      setInitTasks((prev) =>
        prev.map((t, idx) => (idx === 1 ? { ...t, status: "done" } : t))
      );
    }, 1800);

    setTimeout(() => {
      setInitTasks((prev) =>
        prev.map((t, idx) => (idx === 2 ? { ...t, status: "done" } : t))
      );
    }, 2800);
  };

  const handleLaunch = () => {
    router.push("/app/dashboard");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#050505] selection:bg-primary/20">
      {/* Background Visual Elements */}
      <PremiumBackground />

      {/* Floating Ambient Aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/3 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />

      {/* Header bar */}
      <header className="w-full max-w-5xl mx-auto px-6 py-6 z-10 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-[#0B0B0F] transition-all duration-350 group-hover:border-primary/50">
            <div className="h-3 w-3 rounded-sm bg-primary transition-all duration-500 group-hover:rotate-45" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
            BuildAI <span className="font-light text-zinc-400">OS</span>
          </span>
        </Link>

        {/* Global Progress Indicator */}
        <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-550 font-bold">
          <span>PROGRESS</span>
          <div className="w-24 h-1.5 bg-[#050505] border border-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${(currentStep / 5) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-primary">{currentStep * 20}%</span>
        </div>
      </header>

      {/* Main setup wizard frame */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-6 flex items-center justify-center py-6 z-10">
        <div className="w-full flex flex-col items-center">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`w-full rounded-2xl border border-white/5 bg-[#0B0B0F]/85 shadow-2xl p-6 md:p-8 backdrop-blur-md relative ${
                currentStep === 3 ? "max-w-4xl" : "max-w-[480px]"
              }`}
            >
              {/* Step indicator node */}
              <div className="text-center space-y-1 mb-6 select-none">
                <span className="text-[9px] font-bold font-mono text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                  Step {currentStep} of 5
                </span>
              </div>

              {/* Step 1 Content: Workspace Name */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1.5 text-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      What should we call your workspace?
                    </h2>
                    <p className="text-[11px] text-zinc-450 leading-relaxed max-w-[280px] mx-auto">
                      Name your workspace. Typically this is the name of your startup, app, or organization.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-wider">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder="Acme AI"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-white/5 text-xs text-white placeholder-zinc-500 bg-[#050505] outline-none focus:border-primary/45 focus:shadow-primary/5 transition-all"
                      autoFocus
                    />
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Step 2 Content: Project Description */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1.5 text-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      What are you building?
                    </h2>
                    <p className="text-[11px] text-zinc-450 leading-relaxed max-w-[320px] mx-auto">
                      Describe your software requirements in plain English. Your AI employees will model their plans from this prompt.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="e.g. Build a SaaS billing dashboard with Stripe. It should let users sign up, upgrade tiers, and view real-time API logs..."
                      rows={5}
                      className="w-full p-3.5 rounded-lg border border-white/5 text-xs text-white placeholder-zinc-500 bg-[#050505] outline-none focus:border-primary/45 transition-all resize-none leading-relaxed"
                      autoFocus
                    />

                    {/* Suggestions capsules */}
                    <div className="space-y-2">
                      <span className="block text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                        suggestions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setProjectDescription(`Create a premium ${item.toLowerCase()} system equipped with custom admin dashboards, database integrations, and robust user settings workflows.`)}
                            className="px-2.5 py-1 rounded-full border border-white/5 bg-[#050505] hover:bg-white/5 text-[9px] font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handlePrevStep}
                      className="py-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Content: Stack Selection (Large Grid) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1.5 text-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Choose your preferred stack
                    </h2>
                    <p className="text-[11px] text-zinc-450 leading-relaxed">
                      Select frontend, backend, database, and deployment setups. Your AI developers will compile software mapping to this stack.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-2">
                    
                    {/* Frontend Group */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                        <Layout className="h-3.5 w-3.5 text-primary" />
                        <span>Frontend</span>
                      </div>
                      <div className="space-y-2">
                        {FRONTEND_STACKS.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setSelectedFrontend(tech)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                              selectedFrontend === tech
                                ? "border-primary bg-primary/2 text-white"
                                : "border-white/5 bg-[#050505] hover:border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Backend Group */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                        <Server className="h-3.5 w-3.5 text-secondary" />
                        <span>Backend</span>
                      </div>
                      <div className="space-y-2">
                        {BACKEND_STACKS.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setSelectedBackend(tech)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                              selectedBackend === tech
                                ? "border-secondary bg-secondary/2 text-white"
                                : "border-white/5 bg-[#050505] hover:border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Database Group */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                        <Database className="h-3.5 w-3.5 text-success" />
                        <span>Database</span>
                      </div>
                      <div className="space-y-2">
                        {DB_STACKS.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setSelectedDb(tech)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                              selectedDb === tech
                                ? "border-success bg-success/2 text-white"
                                : "border-white/5 bg-[#050505] hover:border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Deployment Group */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-zinc-550 uppercase tracking-wider select-none">
                        <Cloud className="h-3.5 w-3.5 text-[#4F7CFF]" />
                        <span>Deployment</span>
                      </div>
                      <div className="space-y-2">
                        {DEPLOY_STACKS.map((tech) => (
                          <button
                            key={tech}
                            onClick={() => setSelectedDeploy(tech)}
                            className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold transition-all duration-200 cursor-pointer ${
                              selectedDeploy === tech
                                ? "border-[#4F7CFF] bg-[#4F7CFF]/2 text-white"
                                : "border-white/5 bg-[#050505] hover:border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <button
                      onClick={handlePrevStep}
                      className="px-5 py-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-xs font-bold text-white transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 Content: AI Model Selection */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1.5 text-center">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Choose your AI model
                    </h2>
                    <p className="text-[11px] text-zinc-450 leading-relaxed">
                      Select the primary model model provider driving your engineering teams.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer group ${
                          selectedModel === model.id
                            ? "border-primary bg-primary/2"
                            : "border-white/5 bg-[#050505] hover:border-zinc-800"
                        }`}
                      >
                        <div className="space-y-1.5 pr-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white">{model.name}</span>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">
                              {model.provider}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-450 leading-relaxed max-w-sm">
                            {model.desc}
                          </p>
                        </div>

                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                          selectedModel === model.id
                            ? "border-primary bg-primary text-[#050505]"
                            : "border-white/10 group-hover:border-zinc-700"
                        }`}>
                          {selectedModel === model.id && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Actions row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handlePrevStep}
                      className="py-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-xs font-bold text-[#050505] transition-all hover:scale-[1.01] flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>Initialize Team</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5 Content: Ready & Launch */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-2 text-center select-none">
                    <div className="flex justify-center mb-1">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-3 rounded-full border border-success/20 bg-success/5 text-success"
                      >
                        <BrainCircuit className="h-8 w-8 animate-pulse" />
                      </motion.div>
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Workspace Ready
                    </h2>
                    <p className="text-[11px] text-zinc-450 leading-relaxed">
                      AI employees initialized. Your engineering sandbox environment environment is configured.
                    </p>
                  </div>

                  {/* Initialization Task Logs */}
                  <div className="space-y-3 p-4 rounded-xl border border-white/5 bg-[#050505] font-mono text-[9px]">
                    <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1 flex items-center select-none">
                      <Terminal className="h-3.5 w-3.5 text-zinc-500 mr-1.5 animate-pulse" /> System Logs Stream
                    </span>
                    <div className="space-y-2">
                      {initTasks.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between text-zinc-400 py-0.5">
                          <span className="flex items-center">
                            <span className={`h-1.5 w-1.5 rounded-full mr-2 ${
                              t.status === "done" ? "bg-success" : "bg-primary animate-ping"
                            }`} />
                            {t.label}
                          </span>
                          <span className={`font-bold uppercase text-[8px] ${
                            t.status === "done" ? "text-success" : "text-primary animate-pulse"
                          }`}>
                            {t.status === "done" ? "✓ Done" : "loading..."}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Stack display */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-white/5 bg-[#050505]/40 text-[10px] text-zinc-400">
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Configured Stack</span>
                      <p className="text-white font-medium">{selectedFrontend} + {selectedBackend}</p>
                    </div>
                    <div>
                      <span className="block text-[8px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Target Engine</span>
                      <p className="text-white font-medium uppercase">{selectedModel}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLaunch}
                    disabled={initTasks.some((t) => t.status === "pending")}
                    className={`w-full py-3 rounded-lg text-xs font-bold text-[#050505] transition-all flex items-center justify-center space-x-1.5 ${
                      initTasks.some((t) => t.status === "pending")
                        ? "bg-zinc-800 text-zinc-650 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/95 hover:scale-[1.01] cursor-pointer"
                    }`}
                  >
                    <span>Launch Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-6 text-center text-[10px] text-zinc-600 z-10 select-none">
        <span>&copy; {new Date().getFullYear()} BuildAI OS, Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
