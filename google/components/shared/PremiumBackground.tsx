"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function PremiumBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate a fixed set of subtle particles to avoid hydration mismatches
    const generated: Particle[] = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 10 + 15, // 15s to 25s
      delay: Math.random() * -20, // negative delay so they start at different states
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 bg-background">
      
      {/* 1. Subtle Ambient Moving Radial Glows */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square rounded-full bg-primary/3 blur-[140px]"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-15%] right-[-10%] w-[55%] aspect-square rounded-full bg-[#4F8CFF]/2 blur-[150px]"
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 2. Premium Dotted Mask Grid */}
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.25]" />
      
      {/* 3. Extremely Faint Moving Linear Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-90" />

      {/* 4. Tiny Animated Drifting Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-zinc-600/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100 - (p.y / 100) * 100], // float upwards out of container
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
