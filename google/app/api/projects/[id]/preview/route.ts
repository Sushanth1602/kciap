import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/backend/src/services/ProjectService";
import { ProjectCompiler } from "@/backend/src/services/ProjectCompiler";

export async function POST(
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

    const projectService = new ProjectService();
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const compiler = new ProjectCompiler();
    
    // Launch compile and run asynchronously so it does not block the POST response
    const urlPromise = compiler.compileAndRun(projectId, project.title);

    // Resolve URL (it registers session and port instantly, even if build is running)
    const url = await urlPromise;

    return NextResponse.json({
      success: true,
      url
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to start preview runner" },
      { status: 500 }
    );
  }
}
