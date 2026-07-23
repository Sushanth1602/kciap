import { NextRequest, NextResponse } from "next/server";
import { VersionService } from "@/backend/src/services/VersionService";

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

    const body = await request.json();
    const { versionId } = body;

    if (!versionId) {
      return NextResponse.json(
        { error: "Version ID or number is required for restoration" },
        { status: 400 }
      );
    }

    const versionService = new VersionService();
    await versionService.restoreVersion(projectId, versionId);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to restore version snapshot" },
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

    const { searchParams } = new URL(request.url);
    const versionId = searchParams.get("versionId") || "";

    if (!versionId) {
      return NextResponse.json(
        { error: "Version ID is required to fetch details" },
        { status: 400 }
      );
    }

    const versionService = new VersionService();
    const result = await versionService.getVersion(projectId, versionId);
    if (!result) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, version: result }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve version details" },
      { status: 500 }
    );
  }
}
