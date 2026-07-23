"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AppDashboardPlaceholderPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-mono text-[9px] text-zinc-500 uppercase tracking-widest animate-pulse">
      Initializing Dashboard Shell...
    </div>
  );
}
