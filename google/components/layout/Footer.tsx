import React from "react";
import Link from "next/link";
import { MessageSquare, ArrowUpRight } from "lucide-react";

const GithubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-[#050505] py-16 flex justify-center">
      <div className="w-full max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-white/5">
          
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/5 bg-[#0B0B0F]">
                <div className="h-3 w-3 rounded-sm bg-primary" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                BuildAI <span className="font-light text-zinc-400">OS</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-450 max-w-sm leading-relaxed">
              Your entire software company, powered by AI. Transform ideas into production-ready software systems with collaborating agent teams.
            </p>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2">
              {["Features", "Agents", "Enterprise", "Pricing"].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-xs text-zinc-450 hover:text-white transition-colors duration-200">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support/Docs Column */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-white tracking-wider uppercase">Resources</h4>
            <ul className="space-y-2">
              {["Documentation", "API Reference", "Status", "Changelog"].map((item) => (
                <li key={item}>
                  <Link href={`#${item.replace(" ", "-").toLowerCase()}`} className="text-xs text-zinc-450 hover:text-white transition-colors duration-200 flex items-center group">
                    {item}
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-zinc-550 order-2 md:order-1">
            <span>&copy; {currentYear} BuildAI OS, Inc. All rights reserved.</span>
            <span className="hidden md:inline text-zinc-800">|</span>
            <Link href="#privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>

          {/* Socials */}
          <div className="flex items-center space-x-4 order-1 md:order-2">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/5 hover:border-zinc-800 bg-[#0B0B0F] text-zinc-400 hover:text-white transition-all duration-200" aria-label="GitHub">
              <GithubIcon />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/5 hover:border-zinc-800 bg-[#0B0B0F] text-zinc-400 hover:text-white transition-all duration-200" aria-label="Discord">
              <MessageSquare className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-white/5 hover:border-zinc-800 bg-[#0B0B0F] text-zinc-400 hover:text-white transition-all duration-200" aria-label="Twitter">
              <TwitterIcon />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
