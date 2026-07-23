import { NextRequest, NextResponse } from "next/server";
import { VersionService } from "@/backend/src/services/VersionService";

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

    const versionService = new VersionService();
    const versions = await versionService.listVersions(projectId);

    return NextResponse.json(versions, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to retrieve project versions list" },
      { status: 500 }
    );
  }
}

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
    const { summary } = body;

    const versionService = new VersionService();
    const version = await versionService.createVersion(projectId, summary);

    return NextResponse.json({ success: true, version }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create version snapshot" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
        { error: "Version ID is required for deletion" },
        { status: 400 }
      );
    }

    const versionService = new VersionService();
    await versionService.deleteVersion(projectId, versionId);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete version snapshot" },
      { status: 500 }
    );
  }
}
