import { NextResponse } from "next/server";
import { supabase } from "@/backend/src/utils/supabase";
import { validateEnv } from "@/backend/src/utils/envValidate";

export async function GET() {
  try {
    // 1. Check environment variables
    validateEnv();

    // 2. Query basic DB table to check connectivity
    const { error } = await supabase.from("projects").select("id").limit(1);
    if (error) {
      throw new Error(`Database ping failed: ${error.message}`);
    }

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime()
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error.message || "Unknown health error"
    }, { status: 500 });
  }
}
