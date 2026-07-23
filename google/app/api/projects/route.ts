import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/backend/src/services/ProjectService";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zlfiikupyoqihphvoyzx.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_oI4K6wqCfPKc9XASTu6l_w_VWPM1IYh";

// Helper to resolve authenticated user from Bearer Authorization header
async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
  if (!token) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const { data: { user } } = await client.auth.getUser(token);
  return user ? user.id : null;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { title, prompt } = body;

    // Route validations
    if (title === undefined || title === null || String(title).trim() === "") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }
    if (prompt === undefined || prompt === null || String(prompt).trim() === "") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const projectService = new ProjectService();
    const project = await projectService.createProject(title, prompt, userId);

    return NextResponse.json(
      {
        success: true,
        projectId: project.id,
        project
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const projectService = new ProjectService();
    const allProjects = await projectService.getProjects();
    const userProjects = allProjects.filter((p) => p.user_id === userId);

    return NextResponse.json(userProjects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
