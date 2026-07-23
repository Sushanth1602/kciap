import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { supabase } from "../utils/supabase";
import { PreviewManager } from "./PreviewManager";

export class ProjectCompiler {
  private manager: PreviewManager;

  constructor() {
    this.manager = PreviewManager.getInstance();
  }

  /**
   * Loads code files from generated_files table or artifacts fallback
   */
  private async loadProjectFiles(projectId: string): Promise<{ path: string; content: string }[]> {
    const { data: filesData, error: filesError } = await supabase
      .from("generated_files")
      .select("path, content")
      .eq("project_id", projectId);

    if (!filesError && filesData && filesData.length > 0) {
      return filesData.map(f => ({
        path: f.path,
        content: f.content
      }));
    }

    // Fallback: load from artifacts where type = "code"
    const { data: artifactsData, error: artError } = await supabase
      .from("artifacts")
      .select("filename, content")
      .eq("project_id", projectId)
      .eq("type", "code");

    if (artError) {
      throw new Error(`Failed to load project files or artifacts: ${artError.message}`);
    }

    return (artifactsData || []).map(art => ({
      path: art.filename,
      content: art.content
    }));
  }

  /**
   * Compiles the project: writes files, runs npm install, and spawns the Next.js dev server
   */
  public async compileAndRun(projectId: string, projectTitle: string): Promise<string> {
    // 1. Check if preview is already running
    const existing = this.manager.getSession(projectId);
    if (existing && existing.status !== "failed") {
      return existing.url;
    }

    // 2. Allocate a free port
    const port = await this.manager.allocateFreePort();
    const url = `http://localhost:${port}`;

    // 3. Resolve generated path and write files to disk
    const generatedDir = path.resolve(process.cwd(), "workspace/generated", projectId);
    fs.mkdirSync(generatedDir, { recursive: true });

    const files = await this.loadProjectFiles(projectId);
    if (files.length === 0) {
      throw new Error("No files found to compile. Please generate the code first.");
    }

    for (const file of files) {
      const filePath = path.join(generatedDir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content, "utf8");
    }

    // Ensure package.json exists
    if (!files.some(f => f.path === "package.json")) {
      const defaultPackageJson = {
        name: projectTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        version: "0.1.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start"
        },
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          next: "14.2.0",
          tailwindcss: "^3",
          postcss: "^8"
        }
      };
      fs.writeFileSync(
        path.join(generatedDir, "package.json"),
        JSON.stringify(defaultPackageJson, null, 2),
        "utf8"
      );
    }

    // 4. Spawn dev compiler session
    // We register the compilation phase. We'll spawn a temporary install process,
    // then spawn the actual dev server process once dependencies are verified.
    this.manager.registerSession(projectId, null as any, port, url);
    this.manager.setStatus(projectId, "compiling");
    this.manager.addLog(projectId, `→ Initializing preview compilation sandbox in ${generatedDir}`, "system");
    this.manager.addLog(projectId, `→ Running npm install...`, "system");

    const installProc = spawn("npm", ["install"], { cwd: generatedDir, shell: true });

    installProc.stdout.on("data", (data) => {
      this.manager.addLog(projectId, data.toString(), "stdout");
    });

    installProc.stderr.on("data", (data) => {
      this.manager.addLog(projectId, data.toString(), "stderr");
    });

    installProc.on("close", (code) => {
      if (code !== 0) {
        this.manager.addLog(projectId, `✗ npm install failed with exit code ${code}`, "system");
        this.manager.setStatus(projectId, "failed");
        return;
      }

      this.manager.addLog(projectId, `✓ npm install completed successfully.`, "system");
      this.manager.addLog(projectId, `→ Launching Next.js dev server on port ${port}...`, "system");

      const devServer = spawn("npx", ["next", "dev", "-p", port.toString()], {
        cwd: generatedDir,
        shell: true,
        env: { ...process.env, PORT: port.toString() }
      });

      // Reregister with the actual active Next dev process
      this.manager.registerSession(projectId, devServer, port, url);

      devServer.stdout.on("data", (data) => {
        const output = data.toString();
        this.manager.addLog(projectId, output, "stdout");
        if (output.includes("Ready in") || output.includes("Ready") || output.includes("started server on")) {
          this.manager.setStatus(projectId, "ready");
          this.manager.addLog(projectId, `✓ Preview dev server ready at ${url}`, "system");
        }
      });

      devServer.stderr.on("data", (data) => {
        this.manager.addLog(projectId, data.toString(), "stderr");
      });

      devServer.on("close", (devCode) => {
        this.manager.addLog(projectId, `✗ Dev server terminated with exit code ${devCode}`, "system");
        this.manager.setStatus(projectId, "failed");
      });
    });

    return url;
  }
}
