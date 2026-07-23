"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatarLetter: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "We launched our Stripe-integrated billing manager using BuildAI OS in less than an hour. The backend code was fully compiled and clean.",
    author: "Elena Rostova",
    role: "VP of Engineering",
    company: "SvelteLabs",
    avatarLetter: "E"
  },
  {
    quote: "As a startup founder, this is a game changer. I described my requirements once, and the AI PM and developers built my entire user analytics app.",
    author: "Marc Verney",
    role: "Founder & CEO",
    company: "Veloce API",
    avatarLetter: "M"
  },
  {
    quote: "The quality check and sandbox constraints are extremely rigorous. BuildAI OS is the only platform we trust with complex vector search utilities.",
    author: "Sanjay Kumar",
    role: "Director of Product",
    company: "Helix Health",
    avatarLetter: "S"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-24 md:py-32 bg-[#050505] flex justify-center border-b border-white/5">
      <div className="w-full max-w-5xl px-6 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2 select-none">
            Testimonials
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Trusted by creators.
          </h2>
          <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
            See how tech companies and individual creators accelerate their cycles using autonomous engineering.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl border border-white/5 bg-[#0B0B0F]/60 flex flex-col justify-between hover:border-zinc-805 transition-all duration-300 relative group"
            >
              {/* Quote Icon watermark */}
              <Quote className="absolute top-6 right-6 h-8 w-8 text-zinc-900 group-hover:text-primary/5 transition-colors duration-300 pointer-events-none -z-10" />

              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{test.quote}"
              </p>

              {/* Author info */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {test.avatarLetter}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none">
                    {test.author}
                  </h4>
                  <span className="text-[9px] text-zinc-500 font-medium mt-1 block">
                    {test.role}, <span className="text-zinc-400">{test.company}</span>
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
