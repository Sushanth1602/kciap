"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Cpu, Play, Loader, CheckCircle, FileCode } from "lucide-react";

type Phase = "planning" | "coding" | "testing" | "deploying";

interface LogMessage {
  sender: string;
  message: string;
  type: "info" | "success" | "warn";
}

const PHASE_LOGS: Record<Phase, LogMessage[]> = {
  planning: [
    { sender: "CEO", message: "Vision approved: SaaS subscription system.", type: "success" },
    { sender: "Product Manager", message: "PRD generated with database schemas and endpoints.", type: "info" },
    { sender: "Architect", message: "Generated OpenAPI specs for stripe webhook handler.", type: "info" },
  ],
  coding: [
    { sender: "Backend Developer", message: "Scaffolding API endpoint controllers in Go...", type: "info" },
    { sender: "Frontend Developer", message: "Creating billing components, styled with Tailwind.", type: "info" },
    { sender: "Database Admin", message: "Constructed schemas and migration scripts.", type: "success" },
  ],
  testing: [
    { sender: "QA Developer", message: "Executing 42 regression test assertions...", type: "info" },
    { sender: "Security Officer", message: "Dependencies scan complete: 0 vulnerabilities found.", type: "success" },
    { sender: "QA Developer", message: "All API assertions resolved successfully. 100% green.", type: "success" },
  ],
  deploying: [
    { sender: "DevOps Engineer", message: "Compiling Docker images and launching server hook...", type: "info" },
    { sender: "DevOps Engineer", message: "Rerouting ingress cluster balancer rules.", type: "info" },
    { sender: "DevOps Engineer", message: "Production deployment complete at buildai-os.com", type: "success" },
  ],
};

const PHASE_CODES: Record<Phase, string> = {
  planning: `// System Topology Plan
{
  "project": "stripe-billing-portal",
  "agents": ["ceo", "pm", "architect", "db"],
  "database": "postgresql",
  "dependencies": ["stripe", "@tanstack/react-query"],
  "deployment": "google-cloud-run"
}`,
  coding: `// app/api/billing/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { priceId, customerId } = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: "https://acme.com/success",
    cancel_url: "https://acme.com/cancel",
  });

  return NextResponse.json({ sessionId: session.id });
}`,
  testing: `// tests/billing.test.ts
import { test, expect } from "vitest";
import { stripe } from "@/lib/stripe";

test("Checkout Session Generation", async () => {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: "price_123", quantity: 1 }]
  });
  
  expect(session.id).toBeDefined();
  expect(session.status).toBe("open");
});`,
  deploying: `// deployment_config.yml
cluster:
  name: "buildai-prod-us-east"
  nodes: 12
  loadBalancer:
    provider: "gcp-ingress"
    ssl: true
  replicas: 4
status: "deployed"
url: "https://stripe-portal.buildai-os.com"`
};

export default function ProductPreview() {
  const [activePhase, setActivePhase] = useState<Phase>("planning");

  useEffect(() => {
    const phases: Phase[] = ["planning", "coding", "testing", "deploying"];
    const interval = setInterval(() => {
      setActivePhase((prev) => {
        const nextIdx = (phases.indexOf(prev) + 1) % phases.length;
        return phases[nextIdx];
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-24 bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-5xl px-6 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Interactive demo
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Watch the team collaborate.
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            A real-time visual simulation of the agent pipeline. See how CEO, PM, Developers, and DevOps plan, code, test, and release code in synchronization.
          </p>
        </div>

        {/* Browser Mockup */}
        <div className="w-full rounded-2xl border border-white/5 bg-[#0B0B0F]/90 shadow-2xl shadow-black/95 overflow-hidden flex flex-col h-[460px]">
          
          {/* Browser Header Bar */}
          <div className="h-12 border-b border-white/5 bg-[#050505] px-4 flex items-center justify-between">
            {/* Window Dots */}
            <div className="flex space-x-1.5 flex-shrink-0">
              <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {/* Simulated Address Bar */}
            <div className="bg-[#0B0B0F] border border-white/5 px-4 py-1.5 rounded-full text-[9px] font-mono text-zinc-500 flex items-center space-x-1.5 select-none max-w-[320px] w-full justify-center">
              <span>https://buildai-os.com/live/stripe-billing</span>
            </div>

            {/* Telemetry state */}
            <div className="text-[9px] font-bold text-zinc-650 flex items-center space-x-2 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="uppercase">simulated pipeline active</span>
            </div>
          </div>

          {/* Stepper Flow Header */}
          <div className="grid grid-cols-4 border-b border-white/5 text-center text-[10px] font-bold font-mono text-zinc-550 select-none bg-[#0B0B0F]">
            {(["planning", "coding", "testing", "deploying"] as Phase[]).map((phase) => {
              const isActive = activePhase === phase;
              return (
                <button
                  key={phase}
                  onClick={() => setActivePhase(phase)}
                  className={`py-3 border-r border-white/5 uppercase transition-colors relative ${
                    isActive ? "text-primary" : "hover:text-zinc-300"
                  }`}
                >
                  {phase}
                  {isActive && (
                    <motion.div
                      layoutId="active-phase-bar"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Browser Workspace Content */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-12 min-h-0 bg-[#050505]">
            
            {/* Editor Workspace Panel */}
            <div className="md:col-span-7 p-5 font-mono text-[9px] text-zinc-400 overflow-y-auto border-r border-white/5 select-text relative custom-scrollbar flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-3 flex items-center">
                  <FileCode className="h-3.5 w-3.5 text-zinc-500 mr-1.5" /> Code Sandbox Editor
                </span>
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activePhase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.3 }}
                    className="leading-relaxed"
                  >
                    {PHASE_CODES[activePhase]}
                  </motion.pre>
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <div className="border-t border-white/5 pt-3 mt-4 flex items-center justify-between text-[8px] text-zinc-600">
                <span>UTF-8</span>
                <span>TypeScript / React</span>
              </div>
            </div>

            {/* Console Log Panel */}
            <div className="md:col-span-5 p-5 font-mono text-[9px] text-zinc-400 overflow-y-auto bg-[#0B0B0F]/20 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block flex items-center">
                  <Terminal className="h-3.5 w-3.5 text-zinc-500 mr-1.5" /> Agent Collaboration Log
                </span>
                <div className="space-y-2.5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activePhase}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2.5"
                    >
                      {PHASE_LOGS[activePhase].map((log, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[8px] font-bold uppercase px-1 rounded ${
                              log.sender === "CEO"
                                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                : log.sender === "Product Manager"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : log.sender === "Architect"
                                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            }`}>
                              {log.sender}
                            </span>
                            <span className="text-zinc-600 text-[8px]">02:14:0{idx}</span>
                          </div>
                          <p className="text-zinc-350 leading-relaxed pl-0.5">{log.message}</p>
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Status display */}
              <div className="border-t border-white/5 pt-3 mt-4 flex items-center space-x-2 text-[9px]">
                {activePhase === "deploying" ? (
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Loader className="h-3.5 w-3.5 text-primary animate-spin" />
                )}
                <span className="font-bold text-white uppercase tracking-wider text-[8px]">
                  {activePhase === "planning" && "PM mapping requirements..."}
                  {activePhase === "coding" && "Frontend & Backend generating controllers..."}
                  {activePhase === "testing" && "Running API assertions..."}
                  {activePhase === "deploying" && "Deployment complete!"}
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
