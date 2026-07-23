"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const Tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for testing autonomous agent coordination workflows.",
    features: [
      "1 active workspace target",
      "Single agent execution thread",
      "Mock deploy container sandboxes",
      "Standard vector memory indexing"
    ],
    cta: "Start Free",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "Ideal for launching production apps and scaling deployments.",
    features: [
      "Unlimited active workspaces",
      "Parallel agent builds (10+ agents)",
      "One-click production deploy triggers",
      "Custom vector documentation feeds",
      "GPU NVIDIA H100 acceleration pool",
      "GitHub hooks repository sync"
    ],
    cta: "Start Building",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contracts",
    description: "Engineered for compliance, security, and scale.",
    features: [
      "Dedicated LLM fine-tuned context",
      "Private sandbox read-only clusters",
      "SOC2-compliant audit trails",
      "SLA container health guarantees",
      "Custom API pipeline hooks",
      "24/7 dedicated support agent"
    ],
    cta: "Contact Sales",
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-24 md:py-32 bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-5xl px-6 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Pricing
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Flexible plans for builders.
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            Select the scale that matches your engineering targets. Upgrade or downgrade plans at any sprint boundary.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative group ${
                tier.highlighted
                  ? "border-primary bg-primary/2 shadow-xl shadow-primary/5"
                  : "border-white/5 bg-[#0B0B0F]/60 hover:border-zinc-800"
              }`}
            >
              {/* Highlight badge indicator */}
              {tier.highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-0.5 text-[8px] font-extrabold text-[#050505] uppercase tracking-wider">
                  Recommended
                </span>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">{tier.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-normal min-h-[32px]">{tier.description}</p>
                </div>

                {/* Price block */}
                <div className="flex items-baseline space-x-1 border-b border-white/5 pb-6">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{tier.price}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">/ {tier.period}</span>
                </div>

                {/* Features checklist */}
                <ul className="space-y-3">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start text-[11px] text-zinc-400">
                      <Check className={`h-4.5 w-4.5 mr-2 flex-shrink-0 ${
                        tier.highlighted ? "text-primary" : "text-zinc-600"
                      }`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                className={`w-full mt-8 py-2.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2 ${
                  tier.highlighted
                    ? "bg-primary hover:bg-primary/95 text-[#050505]"
                    : "bg-[#050505] hover:bg-zinc-900 border border-white/5 text-white"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
