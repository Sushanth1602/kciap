import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/backend/src/utils/supabase";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { data: artifacts, error } = await supabase
      .from("artifacts")
      .select("id, type, filename, content, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(artifacts || [], { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve artifacts" },
      { status: 550 }
    );
  }
}
