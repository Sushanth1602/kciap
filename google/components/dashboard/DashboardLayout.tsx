"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatusBar from "./StatusBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white relative">
      {/* Left Navigation Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Right main workspace columns */}
      <div
        className="flex-grow flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: collapsed ? 64 : 280 }}
      >
        {/* Topbar Utility */}
        <Topbar />

        {/* Dynamic page main content viewport */}
        <main className="flex-grow flex flex-col bg-[#050505] overflow-y-auto relative">
          {children}
        </main>

        {/* Status bar */}
        <StatusBar />
      </div>
    </div>
  );
}
