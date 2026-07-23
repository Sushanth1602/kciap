import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/backend/src/utils/supabase";
import { ProjectService } from "@/backend/src/services/ProjectService";
import JSZip from "jszip";

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

    // 1. Load project details
    const projectService = new ProjectService();
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 2. Load generated files
    let files: { path: string; content: string }[] = [];

    const { data: filesData, error: filesError } = await supabase
      .from("generated_files")
      .select("path, content")
      .eq("project_id", projectId);

    if (!filesError && filesData && filesData.length > 0) {
      files = filesData.map(f => ({
        path: f.path,
        content: f.content
      }));
    } else {
      // Fallback: load from artifacts where type = "code"
      const { data: artifactsData, error: artError } = await supabase
        .from("artifacts")
        .select("filename, content")
        .eq("project_id", projectId)
        .eq("type", "code");

      if (artError) {
        throw artError;
      }

      files = (artifactsData || []).map(art => ({
        path: art.filename,
        content: art.content
      }));
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No generated files found for this project." },
        { status: 400 }
      );
    }

    // 3. Generate ZIP archive
    const zip = new JSZip();
    for (const file of files) {
      zip.file(file.path, file.content);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // 4. Return ZIP response with attachment headers
    const safeTitle = project.title.replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `${safeTitle}.zip`;

    return new Response(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to download code zip" },
      { status: 550 }
    );
  }
}
