"use client";

import React from "react";
import { Cpu } from "lucide-react";

export default function StatusBar() {
  return (
    <footer className="h-8 border-t border-white/5 bg-[#0B0B0F] px-6 flex items-center justify-between w-full select-none font-mono text-[9px] text-zinc-550">
      
      {/* Left: Connection sync state */}
      <div className="flex items-center space-x-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
        </span>
        <span className="font-bold uppercase tracking-wider text-[8px]">system online</span>
        <span className="text-zinc-700">|</span>
        <span className="text-zinc-500">Connected</span>
      </div>

      {/* Center: Current Workspace indicator */}
      <div className="hidden sm:block">
        <span>Workspace: </span>
        <span className="text-white font-bold">Acme AI</span>
      </div>

      {/* Right: Selected compiler model & build version */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Cpu className="h-3 w-3 text-zinc-500" />
          <span>Gemini 1.5 Pro</span>
        </div>
        <span className="text-zinc-700">|</span>
        <span>v1.0.0-beta</span>
      </div>

    </footer>
  );
}
