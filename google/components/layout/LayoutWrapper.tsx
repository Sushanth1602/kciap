"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname || "") || pathname?.startsWith("/app") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/workspace");

  return (
    <>
      {!isAuthPage && <Navbar />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
