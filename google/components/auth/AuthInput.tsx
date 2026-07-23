"use client";

import React from "react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function AuthInput({ label, error, id, ...props }: AuthInputProps) {
  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={id} className="block text-[10px] font-bold text-zinc-550 uppercase tracking-wider select-none">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-xs text-white placeholder-zinc-500 bg-[#0B0B0F]/90 outline-none transition-all duration-200 focus:bg-[#050505] ${
          error
            ? "border-red-500/40 focus:border-red-500/80 focus:shadow-red-500/5"
            : "border-white/5 focus:border-primary/45 focus:shadow-primary/5"
        }`}
        {...props}
      />
      {error && (
        <p className="text-[10px] font-medium text-red-400 mt-1 pl-1">
          {error}
        </p>
      )}
    </div>
  );
}
