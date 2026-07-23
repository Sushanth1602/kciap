import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/backend/src/services/ProjectService";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zlfiikupyoqihphvoyzx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_oI4K6wqCfPKc9XASTu6l_w_VWPM1IYh";

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  if (!token) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  try {
    const { data: { user } } = await client.auth.getUser(token);
    return user ? user.id : null;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const projectService = new ProjectService();
    const project = await projectService.getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // If the project has an owner, check authorization
    if (project.user_id) {
      const userId = await getUserIdFromRequest(request);
      if (userId !== project.user_id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        project
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
