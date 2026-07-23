import { NextRequest, NextResponse } from "next/server";
import { GitHubService } from "@/backend/src/services/GitHubService";

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

    const githubService = new GitHubService();
    const result = await githubService.publishProject(projectId);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to publish project to GitHub" },
      { status: 500 }
    );
  }
}
