import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/backend/src/services/ProjectService";
import { DeploymentService } from "@/backend/src/services/DeploymentService";

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

    // Resolve published GitHub Repository URL
    const repoUrl = project.tech_stack?.github_url;
    if (!repoUrl) {
      return NextResponse.json(
        { error: "Please publish the project repository to GitHub first before deploying." },
        { status: 400 }
      );
    }

    const deploymentService = new DeploymentService();
    const result = await deploymentService.triggerVercelDeployment(projectId, repoUrl);

    return NextResponse.json({
      success: true,
      deploymentUrl: result.deploymentUrl,
      status: result.status,
      deploymentId: result.deploymentId
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to trigger Vercel deployment" },
      { status: 500 }
    );
  }
}

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

    const projectService = new ProjectService();
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const deploymentId = project.tech_stack?.vercel_deployment_id;
    if (!deploymentId) {
      return NextResponse.json(
        { error: "No active Vercel deployment session found." },
        { status: 400 }
      );
    }

    const deploymentService = new DeploymentService();
    const result = await deploymentService.getDeploymentStatus(projectId, deploymentId);

    return NextResponse.json({
      success: true,
      deploymentUrl: result.deploymentUrl,
      status: result.status,
      logs: result.logs
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to poll Vercel deployment status" },
      { status: 500 }
    );
  }
}
