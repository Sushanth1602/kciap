"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Sparkles, ChevronDown } from "lucide-react";
import { supabase } from "@/backend/src/utils/supabase";

export default function Topbar() {
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || user.user_metadata?.full_name || "User");
      }
    };
    fetchUser();
  }, []);

  const handleSearchClick = () => {
    alert("Global search / Command palette triggers (mock).");
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0B0B0F]/85 backdrop-blur-md px-6 flex items-center justify-between w-full select-none">
      
      {/* Left side: Workspace Display info */}
      <div className="flex items-center space-x-2.5">
        <span className="text-[11px] font-bold text-zinc-450">Acme Workspace</span>
        <div className="flex items-center space-x-1 py-1 px-2.5 rounded-full border border-white/5 bg-[#050505] text-[10px] font-bold text-white hover:border-zinc-800 transition-colors cursor-pointer">
          <span>Production</span>
          <ChevronDown className="h-3 w-3 text-zinc-500" />
        </div>
      </div>

      {/* Center: Styled Global Search trigger button */}
      <div className="max-w-md w-full px-4 hidden md:block">
        <button
          onClick={handleSearchClick}
          className="w-full flex items-center justify-between px-3.5 h-9 rounded-lg border border-white/5 bg-[#050505]/60 hover:bg-[#050505] hover:border-zinc-800 text-[11px] font-bold text-zinc-500 hover:text-zinc-400 transition-all cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-3.5 w-3.5 text-zinc-500" />
            <span>Search or command agents...</span>
          </div>
          <span className="text-[9px] font-mono bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-zinc-500">
            ⌘K
          </span>
        </button>
      </div>

      {/* Right side: Telemetry actions & avatar */}
      <div className="flex items-center space-x-4">
        
        {/* Credits usage chip */}
        <div className="inline-flex items-center space-x-1.5 py-1 px-3 rounded-full border border-primary/10 bg-primary/2 text-primary text-[10px] font-bold">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>1,250 credits</span>
        </div>

        {/* Notifications alarm */}
        <button className="p-2 rounded-lg border border-white/5 bg-[#050505]/40 hover:bg-white/5 text-zinc-450 hover:text-white transition-all cursor-pointer relative">
          <Bell className="h-4 w-4" />
          {/* Active notification indicator */}
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-zinc-400 font-medium select-none hidden sm:inline-block">
            {userEmail}
          </span>
          <div className="h-7 w-7 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center text-[10px] font-bold text-secondary cursor-pointer hover:scale-105 transition-transform select-none">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

      </div>

    </header>
  );
}
