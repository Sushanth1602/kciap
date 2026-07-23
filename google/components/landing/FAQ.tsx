"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does BuildAI OS replace a human software engineering team?",
    answer: "BuildAI OS coordinates a team of 10 specialized AI agents—including CEO, PM, Architect, Developers, QA, and DevOps. They converse asynchronously, validate code compilation, execute tests in isolated sandboxes, and manage release pipelines autonomously."
  },
  {
    question: "Do I own the source code built by the platform?",
    answer: "Yes, you retain 100% ownership of all generated codebases, database schemas, mockups, and deployment container files. All systems are written in clean TypeScript, React, Go, and Python to simplify future scaling."
  },
  {
    question: "Can I connect my company's custom documentation and API models?",
    answer: "Absolutely. Under the Pro and Enterprise tiers, you can feed documentation vector chunks directly into agent memory stores, allowing them to write code conforming to your internal API patterns or library guidelines."
  },
  {
    question: "What clouds are supported for automated deployments?",
    answer: "BuildAI OS supports Google Cloud Platform (Cloud Run, Kubernetes Engine), Amazon Web Services (Lambda, ECS, EKS), Vercel edge networks, and custom Docker container clusters out of the box."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="w-full py-24 md:py-32 bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-3xl px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Everything you need to know about the autonomous development environment.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-white/5 bg-[#0B0B0F]/60 overflow-hidden transition-all duration-300"
              >
                {/* Trigger question header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-white hover:text-primary transition-colors cursor-pointer select-none"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-zinc-500"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs text-zinc-450 leading-relaxed border-t border-white/5 bg-[#050505]/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
