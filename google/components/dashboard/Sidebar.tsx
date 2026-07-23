"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Sparkles,
  Sliders,
  Rocket,
  BookOpen,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Network,
  LogOut
} from "lucide-react";
import { supabase } from "@/backend/src/utils/supabase";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "AI Agents", href: "/dashboard/agents", icon: Sparkles },
  { label: "Mission Control", href: "/dashboard/mission-control", icon: Sliders },
  { label: "Deployments", href: "/dashboard/deployments", icon: Rocket },
  { label: "Knowledge", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: User }
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("SignOut error:", err);
    }
    localStorage.removeItem("sb-access-token");
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    router.push("/");
  };

  return (
    <motion.aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col justify-between border-r border-white/5 bg-[#0B0B0F]/90 backdrop-blur-md transition-all duration-300 ${
        collapsed ? "w-16" : "w-[280px]"
      }`}
      animate={{ width: collapsed ? 64 : 280 }}
    >
      {/* Top Sidebar Headings */}
      <div className="space-y-6">
        
        {/* Logo and Collapse Toggle */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/5">
          <Link href="/" className="flex items-center space-x-2.5 overflow-hidden group select-none">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-[#050505] transition-all group-hover:border-primary/50 flex-shrink-0">
              <div className="h-3 w-3 rounded-sm bg-primary transition-all duration-500 group-hover:rotate-45" />
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xs font-bold tracking-tight text-white whitespace-nowrap"
              >
                BuildAI <span className="font-light text-zinc-400">OS</span>
              </motion.span>
            )}
          </Link>

          {/* Collapse Button */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1 rounded-md border border-white/5 hover:bg-white/5 text-zinc-550 hover:text-white transition-colors cursor-pointer"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Workspace Display */}
        <div className="px-3">
          <div className={`p-2 rounded-xl border border-white/5 bg-[#050505]/40 flex items-center justify-between ${
            collapsed ? "justify-center" : ""
          }`}>
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="h-6 w-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 font-mono text-[10px] font-bold">
                A
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="overflow-hidden whitespace-nowrap text-left"
                >
                  <h4 className="text-[11px] font-bold text-white leading-none">Acme AI</h4>
                  <span className="text-[8px] text-zinc-550 font-mono mt-0.5 block">WORKSPACE</span>
                </motion.div>
              )}
            </div>

            {!collapsed && (
              <Network className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0 mr-1" />
            )}
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="px-2 space-y-1">
          {SIDEBAR_LINKS.map((link, idx) => {
            const LinkIcon = link.icon;
            const isActive = pathname === link.href;

            return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden group ${
                    isActive
                      ? "bg-primary/5 text-primary border border-primary/10"
                      : "text-zinc-450 hover:text-white border border-transparent"
                  }`}
                >
                  <LinkIcon className="h-4 w-4 flex-shrink-0" />
                  
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap"
                    >
                      {link.label}
                    </motion.span>
                  )}
                </Link>

                {/* Collapsed Hover Tooltips */}
                <AnimatePresence>
                  {collapsed && hoveredIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-16 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg border border-white/5 bg-[#0B0B0F] shadow-xl text-[10px] font-bold text-white whitespace-nowrap pointer-events-none z-40"
                    >
                      {link.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer / Expand & Logout Buttons */}
      <div className="border-t border-white/5 p-2 space-y-1">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden group text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 cursor-pointer ${
            collapsed ? "justify-center" : ""
          }`}
          title="Logout"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {collapsed && (
          <div className="h-10 flex items-center justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="p-1 rounded-md border border-white/5 hover:bg-white/5 text-zinc-550 hover:text-white transition-colors cursor-pointer"
              aria-label="Expand Sidebar"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
