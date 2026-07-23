import { NextRequest, NextResponse } from "next/server";
import { AgentOrchestrator } from "@/backend/src/services/AgentOrchestrator";

export async function POST(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { id: projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    const orchestrator = new AgentOrchestrator();
    const projectService = orchestrator.getProjectService();

    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Run orchestrator pipeline
    const result = await orchestrator.orchestrate(projectId, project.prompt);

    try {
      const { VersionService } = require("@/backend/src/services/VersionService");
      const versionService = new VersionService();
      await versionService.createVersion(projectId, "Orchestrator Pipeline Generation Run");
    } catch (vErr: any) {
      console.warn("Failed to automatically capture post-pipeline-run version snapshot:", vErr.message);
    }

    return NextResponse.json(
      {
        success: true,
        artifacts: result.artifacts,
        status: "Completed"
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Pipeline execution failed" },
      { status: 500 }
    );
  }
}
