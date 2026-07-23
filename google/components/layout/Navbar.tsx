"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { supabase } from "@/backend/src/utils/supabase";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Agents", href: "#agents" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "#docs" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <motion.header
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div
          className={`flex items-center justify-between w-full max-w-5xl h-14 px-6 rounded-full border transition-all duration-300 ${
            scrolled
              ? "border-border bg-card/90 backdrop-blur-md shadow-lg shadow-black/40"
              : "border-border/40 bg-zinc-950/20 backdrop-blur-sm"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card transition-all duration-350 group-hover:border-primary/50">
              <div className="h-3 w-3 rounded-sm bg-primary transition-all duration-500 group-hover:rotate-45" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-primary">
              BuildAI <span className="font-light text-zinc-400">OS</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3.5 py-1 text-xs font-semibold text-zinc-450 hover:text-white transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </Link>
            ))}
          </nav>

          {/* Right CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-450 hover:text-white transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 px-4 h-8 text-xs font-bold text-[#050505] transition-all duration-200 shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-1.5 text-zinc-450 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-40 rounded-2xl border border-border bg-card/95 backdrop-blur-lg md:hidden overflow-hidden p-6 shadow-2xl"
          >
            <div className="space-y-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-4 space-y-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-zinc-450 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full rounded-full bg-primary py-2.5 text-sm font-bold text-[#050505] hover:bg-primary/95 transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
