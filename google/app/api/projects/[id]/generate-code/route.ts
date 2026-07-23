import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/backend/src/utils/supabase";
import { GeminiService } from "@/backend/src/services/GeminiService";
import { ProjectService } from "@/backend/src/services/ProjectService";

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

    // Try loading from generated_files first
    const { data: filesData, error: filesError } = await supabase
      .from("generated_files")
      .select("path, content, language, created_at")
      .eq("project_id", projectId);

    if (!filesError && filesData && filesData.length > 0) {
      const formatted = filesData.map(f => ({
        path: f.path,
        content: f.content,
        language: f.language
      }));
      return NextResponse.json(formatted, { status: 200 });
    }

    // Fallback: load from artifacts where type = "code"
    const { data: artifactsData, error: artError } = await supabase
      .from("artifacts")
      .select("filename, content, created_at")
      .eq("project_id", projectId)
      .eq("type", "code");

    if (artError) {
      throw artError;
    }

    const formatted = (artifactsData || []).map(art => {
      const ext = art.filename.split(".").pop()?.toLowerCase() || "";
      const language = ["tsx", "ts", "js", "jsx"].includes(ext)
        ? "typescript"
        : ext === "css"
        ? "css"
        : ext === "json"
        ? "json"
        : ext === "md"
        ? "markdown"
        : ext === "html"
        ? "html"
        : "text";

      return {
        path: art.filename,
        content: art.content,
        language
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to load generated code files" },
      { status: 550 }
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

    // 1. Load Project Details
    const projectService = new ProjectService();
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // 2. Load Design Artifacts
    const { data: artifacts, error: artError } = await supabase
      .from("artifacts")
      .select("type, filename, content")
      .eq("project_id", projectId);

    const artifactsText = (artifacts || [])
      .map(art => `Artifact [${art.filename}]:\n${art.content}`)
      .join("\n\n");

    // 3. Load Conversation History
    const { data: dbMessages, error: msgError } = await supabase
      .from("messages")
      .select("role, content")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    const conversationHistoryText = (dbMessages || [])
      .map(m => `${m.role === "user" ? "User" : m.role}: ${m.content}`)
      .join("\n\n");

    // 4. Generate Application Code with Gemini
    const systemPrompt = `You are the Senior Staff Software Engineer of BuildAI OS.
Generate a complete, fully functional Next.js/Tailwind CSS frontend application based on the user's project specification, design artifacts, and conversation history.

You MUST generate the following exact list of files:
- package.json
- README.md
- .env.example
- tailwind.config.ts
- tsconfig.json
- app/layout.tsx
- app/page.tsx
- app/globals.css
- components/Header.tsx
- components/Sidebar.tsx
- components/Button.tsx
- lib/utils.ts

You must format your response as a single, valid raw JSON object mapping file path strings to their corresponding code content strings.
Do not wrap your response in markdown code blocks like \`\`\`json. Output ONLY the raw JSON string.

Example JSON output format:
{
  "package.json": "{ \\"name\\": \\"app\\", ... }",
  "app/page.tsx": "use client;\\nexport default function Page() { ... }"
}`;

    const userPrompt = `Project specifications:
Title: ${project.title}
Base Prompt: ${project.prompt}

Design specs:
${artifactsText}

Conversation logs:
${conversationHistoryText}`;

    const geminiService = new GeminiService();
    const geminiOutput = await geminiService.generate(systemPrompt, userPrompt);

    // Parse the JSON representation of files
    let fileMap: { [path: string]: string } = {};
    try {
      const cleanJson = geminiOutput.replace(/```json/g, "").replace(/```/g, "").trim();
      fileMap = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse code generation JSON, using fallback files template.");
      // Fallback templates to prevent failure
      fileMap = {
        "package.json": JSON.stringify({
          name: project.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          version: "1.0.0",
          private: true,
          scripts: { dev: "next dev", build: "next build", start: "next start" },
          dependencies: { next: "14.0.0", react: "18.2.0", "react-dom": "18.2.0", tailwindcss: "3.3.0" }
        }, null, 2),
        "README.md": `# ${project.title}\n\nGenerated autonomously by BuildAI OS.\n\n## Get Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,
        ".env.example": "NEXT_PUBLIC_API_URL=https://api.example.com",
        "tailwind.config.ts": "export default { content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'] };",
        "tsconfig.json": "{ \"compilerOptions\": { \"target\": \"es5\", \"lib\": [\"dom\", \"dom.iterable\", \"esnext\"] } }",
        "app/layout.tsx": `import React from "react";\nimport "./globals.css";\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <html>\n      <body>{children}</body>\n    </html>\n  );\n}`,
        "app/page.tsx": `"use client";\nimport React from "react";\nimport Header from "@/components/Header";\nexport default function Page() {\n  return (\n    <div className="min-h-screen bg-black text-white">\n      <Header />\n      <main className="p-8 text-center">\n        <h1 className="text-3xl font-bold">${project.title}</h1>\n        <p className="text-zinc-400 mt-2">${project.prompt}</p>\n      </main>\n    </div>\n  );\n}`,
        "app/globals.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
        "components/Header.tsx": `import React from "react";\nexport default function Header() {\n  return (\n    <header className="h-16 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-900">\n      <span className="font-bold">${project.title}</span>\n    </header>\n  );\n}`,
        "components/Sidebar.tsx": `import React from "react";\nexport default function Sidebar() {\n  return <aside className="w-64 border-r border-zinc-800 p-4">Navigation</aside>;\n}`,
        "components/Button.tsx": `import React from "react";\nexport default function Button({ label }: { label: string }) {\n  return <button className="px-4 py-2 bg-blue-600 rounded">{label}</button>;\n}`,
        "lib/utils.ts": `export function cn(...classes: string[]) { return classes.filter(Boolean).join(" "); }`
      };
    }

    const generatedFiles = Object.entries(fileMap).map(([path, content]) => {
      const ext = path.split(".").pop()?.toLowerCase() || "";
      const language = ["tsx", "ts", "js", "jsx"].includes(ext)
        ? "typescript"
        : ext === "css"
        ? "css"
        : ext === "json"
        ? "json"
        : ext === "md"
        ? "markdown"
        : ext === "html"
        ? "html"
        : "text";

      return {
        path,
        content,
        language
      };
    });

    // 5. Store files in Supabase
    // Try saving in generated_files table first
    const { error: insertErr } = await supabase.from("generated_files").insert(
      generatedFiles.map(f => ({
        project_id: projectId,
        path: f.path,
        content: f.content,
        language: f.language,
        created_at: new Date().toISOString()
      }))
    );

    // Fallback: If generated_files table doesn't exist, store as code artifacts
    if (insertErr && (insertErr.message.includes("Could not find the table") || insertErr.code === "PGRST205")) {
      console.log("Saving generated files to artifacts fallback table...");
      for (const f of generatedFiles) {
        const { data: existing } = await supabase
          .from("artifacts")
          .select("id")
          .eq("project_id", projectId)
          .eq("filename", f.path)
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase
            .from("artifacts")
            .update({ content: f.content, type: "code", created_at: new Date().toISOString() })
            .eq("id", existing[0].id);
        } else {
          await supabase.from("artifacts").insert([
            {
              project_id: projectId,
              type: "code",
              filename: f.path,
              content: f.content,
              created_at: new Date().toISOString()
            }
          ]);
        }
      }
    }

    try {
      const { VersionService } = require("@/backend/src/services/VersionService");
      const versionService = new VersionService();
      await versionService.createVersion(projectId, `Code Generation: ${generatedFiles.length} files compiled`);
    } catch (vErr: any) {
      console.warn("Failed to automatically capture post-code-gen version snapshot:", vErr.message);
    }

    return NextResponse.json({
      success: true,
      files: generatedFiles
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate application code" },
      { status: 550 }
    );
  }
}
