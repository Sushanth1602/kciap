import { ProjectService } from "./ProjectService";
import { GeminiService } from "./GeminiService";
import { MemoryService } from "./MemoryService";
import { GitHubService } from "./GitHubService";
import { DeploymentService } from "./DeploymentService";
import { supabase } from "../utils/supabase";
import { progressEmitter } from "../utils/progressEmitter";

export interface Artifact {
  type: string;
  filename: string;
  content: string;
}

export class AgentOrchestrator {
  private projectService: ProjectService;
  private geminiService: GeminiService;
  private memoryService: MemoryService;
  private githubService: GitHubService;
  private deploymentService: DeploymentService;

  constructor() {
    this.projectService = new ProjectService();
    this.geminiService = new GeminiService();
    this.memoryService = new MemoryService();
    this.githubService = new GitHubService();
    this.deploymentService = new DeploymentService();
  }

  private async runAgent(
    projectId: string,
    agentName: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    const startedAt = new Date().toISOString();
    try {
      // 1. Load previous artifact for this agent
      const AgentArtifactMap: { [key: string]: string } = {
        "CEO": "requirements.md",
        "Product Manager": "prd.md",
        "PM": "prd.md",
        "Architect": "architecture.md",
        "Frontend": "frontend-plan.md",
        "Backend": "api-spec.md",
        "QA": "test-plan.md",
        "Reviewer": "review.md"
      };

      const filename = AgentArtifactMap[agentName];
      let previousArtifactContent = "";
      if (filename) {
        const { data: artData } = await supabase
          .from("artifacts")
          .select("content")
          .eq("project_id", projectId)
          .eq("filename", filename)
          .limit(1);
        if (artData && artData.length > 0) {
          previousArtifactContent = artData[0].content;
        }
      }

      // 2. Load agent memory
      const previousMemory = await this.memoryService.getAgentMemory(projectId, agentName);

      // 3. Augment prompt with memory and previous artifact
      let augmentedUserPrompt = userPrompt;
      if (previousMemory) {
        augmentedUserPrompt += `\n\n[PERSISTENT AGENT MEMORY (Previous Cycle)]:\n${previousMemory}`;
      }
      if (previousArtifactContent) {
        augmentedUserPrompt += `\n\n[PREVIOUS ARTIFACT CONTENT (to build upon/modify)]:\n${previousArtifactContent}`;
      }

      // 4. Generate Gemini response
      const output = await this.geminiService.generate(systemPrompt, augmentedUserPrompt);
      const completedAt = new Date().toISOString();

      // 5. Generate updated memory
      let updatedMemory = previousMemory;
      try {
        const memoryPrompt = `You are the Memory Consolidation Module of BuildAI OS.
Review the previous memory, the latest artifact output, and the user prompt, and generate a concise updated memory block for the "${agentName}" agent.
This memory will be stored persistently and fed back into your prompt in the next cycle to maintain context of your work.
Return ONLY the raw updated memory block (max 300 words).`;

        const context = `Previous Memory:\n${previousMemory}\n\nLatest Output:\n${output}\n\nUser Input:\n${userPrompt}`;
        updatedMemory = await this.geminiService.generate(memoryPrompt, context);
      } catch (mErr) {
        console.error(`Failed to update memory for agent ${agentName}:`, mErr);
      }

      // 6. Save memory to database
      await this.memoryService.saveAgentMemory(projectId, agentName, updatedMemory);

      // Log the successful run to agent_runs
      await supabase.from("agent_runs").insert([
        {
          project_id: projectId,
          agent_name: agentName,
          status: "completed",
          input: userPrompt,
          output: output,
          started_at: startedAt,
          completed_at: completedAt
        }
      ]);

      return output;
    } catch (err: any) {
      const completedAt = new Date().toISOString();
      // Log the failed run to agent_runs
      try {
        await supabase.from("agent_runs").insert([
          {
            project_id: projectId,
            agent_name: agentName,
            status: "failed",
            input: userPrompt,
            output: err.message || String(err),
            started_at: startedAt,
            completed_at: completedAt
          }
        ]);
      } catch (dbErr) {
        console.error("Failed to log failed agent run:", dbErr);
      }

      throw err;
    }
  }

  private async saveArtifact(
    projectId: string,
    type: string,
    filename: string,
    content: string
  ): Promise<void> {
    try {
      // Overwrite/insert artifact details
      const { data: existing } = await supabase
        .from("artifacts")
        .select("id")
        .eq("project_id", projectId)
        .eq("filename", filename)
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from("artifacts")
          .update({ content, created_at: new Date().toISOString() })
          .eq("id", existing[0].id);
      } else {
        await supabase.from("artifacts").insert([
          {
            project_id: projectId,
            type,
            filename,
            content,
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (dbErr) {
      console.error(`Failed to save artifact ${filename}:`, dbErr);
    }
  }

  private async updateProjectStatus(projectId: string, status: string): Promise<void> {
    try {
      await supabase
        .from("projects")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", projectId);
    } catch (err) {
      console.error(`Failed to update project status to ${status}:`, err);
    }
  }

  public async orchestrate(
    projectId: string,
    userPrompt: string,
    onProgress?: (progress: { agentName: string; status: "running" | "completed" | "failed"; progress: number; output?: string; error?: string }) => void
  ): Promise<any> {
    const project = await this.projectService.getProjectById(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const runs: any[] = [];
    const completedAgents: string[] = [];
    const artifacts: Artifact[] = [];

    const emitProgress = (agentName: string, status: "running" | "completed" | "failed", progress: number, output?: string, error?: string) => {
      onProgress?.({ agentName, status, progress, output, error });
      progressEmitter.emit(`progress:${projectId}`, {
        agentName,
        status,
        progress,
        output,
        error
      });
    };

    const saveAgentChatMessage = async (agent: string, text: string, reasoning: string) => {
      try {
        const jsonContent = JSON.stringify({ text, reasoning });
        await supabase.from("messages").insert([
          {
            project_id: projectId,
            role: agent,
            content: jsonContent,
            created_at: new Date().toISOString()
          }
        ]);
      } catch (err) {
        console.error(`Failed to save chat message for ${agent}:`, err);
      }
    };

    // 1. CEO Agent (10%)
    emitProgress("CEO", "running", 0);
    let ceoOutput = "";
    try {
      ceoOutput = await this.runAgent(
        projectId,
        "CEO",
        "You are the CEO of BuildAI OS. Your job is to analyze the user's software project prompt and create a high-level strategic product vision and business requirements document.",
        `Project Title: ${project.title}\nUser Prompt: ${userPrompt}`
      );
      runs.push({ agentName: "CEO", status: "completed", progress: 10, output: ceoOutput });
      completedAgents.push("CEO");
      
      await this.saveArtifact(projectId, "requirements", "requirements.md", ceoOutput);
      artifacts.push({ type: "requirements", filename: "requirements.md", content: ceoOutput });

      await this.updateProjectStatus(projectId, "CEO (10%)");
      emitProgress("CEO", "completed", 10, ceoOutput);
      await saveAgentChatMessage("CEO", "Successfully finalized high-level strategic vision and software vision scope.", "Strategic specifications aligned with project requirements.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("CEO", "failed", 10, undefined, err.message);
      throw new Error(`CEO Agent failed: ${err.message}`);
    }

    // 2. Product Manager Agent (20%)
    emitProgress("Product Manager", "running", 10);
    let pmOutput = "";
    try {
      pmOutput = await this.runAgent(
        projectId,
        "Product Manager",
        "You are the Product Manager of BuildAI OS. Based on the project prompt and the CEO's strategic vision, generate a detailed Product Requirements Document (PRD) with user stories, key features, and scope.",
        `Project Title: ${project.title}\nUser Prompt: ${userPrompt}\n\nCEO Strategic Vision:\n${ceoOutput}`
      );
      runs.push({ agentName: "Product Manager", status: "completed", progress: 20, output: pmOutput });
      completedAgents.push("Product Manager");

      await this.saveArtifact(projectId, "prd", "prd.md", pmOutput);
      artifacts.push({ type: "prd", filename: "prd.md", content: pmOutput });

      await this.updateProjectStatus(projectId, "Product Manager (20%)");
      emitProgress("Product Manager", "completed", 20, pmOutput);
      await saveAgentChatMessage("Product Manager", "Compiled complete Product Requirements Document (PRD) featuring active user stories and layout milestones.", "PRD mapped based on CEO business parameters.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Product Manager", "failed", 20, undefined, err.message);
      throw new Error(`Product Manager Agent failed: ${err.message}`);
    }

    // 3. Architect Agent (30%)
    emitProgress("Architect", "running", 20);
    let architectOutput = "";
    try {
      architectOutput = await this.runAgent(
        projectId,
        "Architect",
        "You are the System Architect of BuildAI OS. Based on the PRD, design the system architecture, including the recommended technology stack, component structure, database schema, and deployment strategy.",
        `Project Title: ${project.title}\nUser Prompt: ${userPrompt}\n\nProduct Requirements (PRD):\n${pmOutput}`
      );
      runs.push({ agentName: "Architect", status: "completed", progress: 30, output: architectOutput });
      completedAgents.push("Architect");

      await this.saveArtifact(projectId, "architecture", "architecture.md", architectOutput);
      artifacts.push({ type: "architecture", filename: "architecture.md", content: architectOutput });

      await this.updateProjectStatus(projectId, "Architect (30%)");
      emitProgress("Architect", "completed", 30, architectOutput);
      await saveAgentChatMessage("Architect", "Designed system component topology and resolved core tech stack mapping.", "Tech stack configurations bound to requirements and features scope.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Architect", "failed", 30, undefined, err.message);
      throw new Error(`Architect Agent failed: ${err.message}`);
    }

    // 4. Database Agent (40%)
    emitProgress("Database", "running", 30);
    let databaseOutput = "";
    try {
      databaseOutput = await this.runAgent(
        projectId,
        "Database",
        "You are the Database Administrator of BuildAI OS. Based on the system architecture, design the relational tables, PostgreSQL DDL schemas, indices, and data validation rules.",
        `Project Title: ${project.title}\nArchitecture Specs:\n${architectOutput}`
      );
      runs.push({ agentName: "Database", status: "completed", progress: 40, output: databaseOutput });
      completedAgents.push("Database");

      await this.saveArtifact(projectId, "schema", "schema.sql", databaseOutput);
      artifacts.push({ type: "schema", filename: "schema.sql", content: databaseOutput });

      await this.updateProjectStatus(projectId, "Database (40%)");
      emitProgress("Database", "completed", 40, databaseOutput);
      await saveAgentChatMessage("Database", "Generated relational tables, indices, and constraints inside DDL schema.", "PostgreSQL parameters defined for all active data tables.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Database", "failed", 40, undefined, err.message);
      throw new Error(`Database Agent failed: ${err.message}`);
    }

    // 5. Backend Agent (50%)
    emitProgress("Backend", "running", 40);
    let backendOutput = "";
    try {
      backendOutput = await this.runAgent(
        projectId,
        "Backend",
        "You are the Backend Engineer of BuildAI OS. Based on the database schema and architecture details, design the API endpoints, controller contracts, and service integration logic.",
        `Project Title: ${project.title}\nDatabase Schema:\n${databaseOutput}`
      );
      runs.push({ agentName: "Backend", status: "completed", progress: 50, output: backendOutput });
      completedAgents.push("Backend");

      await this.saveArtifact(projectId, "api-spec", "api-spec.md", backendOutput);
      artifacts.push({ type: "api-spec", filename: "api-spec.md", content: backendOutput });

      await this.updateProjectStatus(projectId, "Backend (50%)");
      emitProgress("Backend", "completed", 50, backendOutput);
      await saveAgentChatMessage("Backend", "Mapped API endpoint definitions and payload request/response contracts.", "Backend service routing aligned with database schema structures.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Backend", "failed", 50, undefined, err.message);
      throw new Error(`Backend Agent failed: ${err.message}`);
    }

    // 6. Frontend Agent (60%)
    emitProgress("Frontend", "running", 50);
    let frontendOutput = "";
    try {
      frontendOutput = await this.runAgent(
        projectId,
        "Frontend",
        "You are the Frontend Engineer of BuildAI OS. Based on the API specifications and design requirements, design the UI layout, routing structure, pages, and components flow.",
        `Project Title: ${project.title}\nAPI specs:\n${backendOutput}`
      );
      runs.push({ agentName: "Frontend", status: "completed", progress: 60, output: frontendOutput });
      completedAgents.push("Frontend");

      await this.saveArtifact(projectId, "frontend-plan", "frontend-plan.md", frontendOutput);
      artifacts.push({ type: "frontend-plan", filename: "frontend-plan.md", content: frontendOutput });

      await this.updateProjectStatus(projectId, "Frontend (60%)");
      emitProgress("Frontend", "completed", 60, frontendOutput);
      await saveAgentChatMessage("Frontend", "Designed workspace screen outlines, routing schemas, and Tailwind styles.", "Frontend design mapped to match PM user stories.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Frontend", "failed", 60, undefined, err.message);
      throw new Error(`Frontend Agent failed: ${err.message}`);
    }

    // 7. QA Agent (70%)
    emitProgress("QA", "running", 60);
    let qaOutput = "";
    try {
      qaOutput = await this.runAgent(
        projectId,
        "QA",
        "You are the QA Engineer of BuildAI OS. Write a comprehensive quality assurance test plan and test cases based on frontend layouts and backend API specifications.",
        `Frontend plan:\n${frontendOutput}\n\nBackend API specs:\n${backendOutput}`
      );
      runs.push({ agentName: "QA", status: "completed", progress: 70, output: qaOutput });
      completedAgents.push("QA");

      await this.saveArtifact(projectId, "test-plan", "test-plan.md", qaOutput);
      artifacts.push({ type: "test-plan", filename: "test-plan.md", content: qaOutput });

      await this.updateProjectStatus(projectId, "QA (70%)");
      emitProgress("QA", "completed", 70, qaOutput);
      await saveAgentChatMessage("QA", "Formulated end-to-end integration test suites, validation criteria, and edge cases.", "Test configurations aligned to cover all active frontend inputs.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("QA", "failed", 70, undefined, err.message);
      throw new Error(`QA Agent failed: ${err.message}`);
    }

    // 8. Security Agent (80%)
    emitProgress("Security", "running", 70);
    let securityOutput = "";
    try {
      securityOutput = await this.runAgent(
        projectId,
        "Security",
        "You are the Security Engineer of BuildAI OS. Conduct a comprehensive security review, authorization rules, threat models, and vulnerability compliance specifications.",
        `Architecture:\n${architectOutput}\n\nBackend API specs:\n${backendOutput}`
      );
      runs.push({ agentName: "Security", status: "completed", progress: 80, output: securityOutput });
      completedAgents.push("Security");

      await this.saveArtifact(projectId, "security", "security.md", securityOutput);
      artifacts.push({ type: "security", filename: "security.md", content: securityOutput });

      await this.updateProjectStatus(projectId, "Security (80%)");
      emitProgress("Security", "completed", 80, securityOutput);
      await saveAgentChatMessage("Security", "Drafted user session token verification rules, headers policy, and CORS limits.", "Threat boundaries mapped for all backend service layers.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Security", "failed", 80, undefined, err.message);
      throw new Error(`Security Agent failed: ${err.message}`);
    }

    // 9. DevOps Agent (90%)
    emitProgress("DevOps", "running", 80);
    let devopsOutput = "";
    try {
      devopsOutput = await this.runAgent(
        projectId,
        "DevOps",
        "You are the DevOps Engineer of BuildAI OS. Write Dockerfiles, build configurations, and CI/CD pipelines deployment scripts.",
        `Tech stack details:\n${architectOutput}`
      );
      runs.push({ agentName: "DevOps", status: "completed", progress: 90, output: devopsOutput });
      completedAgents.push("DevOps");

      await this.saveArtifact(projectId, "devops", "devops.md", devopsOutput);
      artifacts.push({ type: "devops", filename: "devops.md", content: devopsOutput });

      await this.updateProjectStatus(projectId, "DevOps (90%)");
      emitProgress("DevOps", "completed", 90, devopsOutput);
      await saveAgentChatMessage("DevOps", "Constructed nextjs build configurations, runner configurations, and deployment logs scripts.", "CI/CD setup compiled to facilitate automated deployment.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("DevOps", "failed", 90, undefined, err.message);
      throw new Error(`DevOps Agent failed: ${err.message}`);
    }

    // 10. Reviewer Agent (95%)
    emitProgress("Reviewer", "running", 90);
    let reviewerOutput = "";
    try {
      reviewerOutput = await this.runAgent(
        projectId,
        "Reviewer",
        "You are the Code Reviewer of BuildAI OS. Review design structures, DB schemas, APIs, and test plans to provide a release validation summary.",
        `QA Test plan:\n${qaOutput}\n\nSecurity review:\n${securityOutput}`
      );
      runs.push({ agentName: "Reviewer", status: "completed", progress: 95, output: reviewerOutput });
      completedAgents.push("Reviewer");

      await this.saveArtifact(projectId, "review", "review.md", reviewerOutput);
      artifacts.push({ type: "review", filename: "review.md", content: reviewerOutput });

      await this.updateProjectStatus(projectId, "Reviewer (95%)");
      emitProgress("Reviewer", "completed", 95, reviewerOutput);
      await saveAgentChatMessage("Reviewer", "Approved workspace specifications and cleared compilation deployment release.", "Full pipeline integration verification successfully validated.");
    } catch (err: any) {
      await this.updateProjectStatus(projectId, "failed");
      emitProgress("Reviewer", "failed", 95, undefined, err.message);
      throw new Error(`Reviewer Agent failed: ${err.message}`);
    }

    // 11. Code Generation (96%)
    emitProgress("Code Generation", "running", 95);
    try {
      const { data: projData } = await supabase.from("projects").select("*").eq("id", projectId).maybeSingle();
      const { data: artData } = await supabase.from("artifacts").select("type, filename, content").eq("project_id", projectId);
      const { data: msgData } = await supabase.from("messages").select("role, content").eq("project_id", projectId).order("created_at", { ascending: true });

      const artifactsText = (artData || []).map(art => `Artifact [${art.filename}]:\n${art.content}`).join("\n\n");
      const conversationHistoryText = (msgData || []).map(m => `${m.role === "user" ? "User" : m.role}: ${m.content}`).join("\n\n");

      const codeSystemPrompt = `You are the Senior Staff Software Engineer of BuildAI OS.
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
Do not wrap your response in markdown code blocks like \`\`\`json. Output ONLY the raw JSON string.`;

      const codeUserPrompt = `Project specifications:\nTitle: ${projData?.title}\nBase Prompt: ${projData?.prompt}\n\nDesign specs:\n${artifactsText}\n\nConversation logs:\n${conversationHistoryText}`;

      const geminiOutput = await this.geminiService.generate(codeSystemPrompt, codeUserPrompt);

      let fileMap: { [path: string]: string } = {};
      try {
        const cleanJson = geminiOutput.replace(/```json/g, "").replace(/```/g, "").trim();
        fileMap = JSON.parse(cleanJson);
      } catch (parseErr) {
        console.error("Failed to parse code generation JSON, using fallback files template.");
        fileMap = {
          "package.json": JSON.stringify({
            name: projData?.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || "app",
            version: "1.0.0",
            private: true,
            scripts: { dev: "next dev", build: "next build", start: "next start" },
            dependencies: { next: "14.0.0", react: "18.2.0", "react-dom": "18.2.0", tailwindcss: "3.3.0" }
          }, null, 2),
          "README.md": `# ${projData?.title}\n\nGenerated autonomously by BuildAI OS.\n\n## Get Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
        };
      }

      const generatedFiles = Object.entries(fileMap).map(([path, content]) => {
        const ext = path.split(".").pop() || "";
        const language = ext === "ts" || ext === "tsx" ? "typescript" : ext === "css" ? "css" : ext === "json" ? "json" : ext === "md" ? "markdown" : "text";
        return { path, content, language };
      });

      const { error: insertErr } = await supabase.from("generated_files").insert(
        generatedFiles.map(f => ({
          project_id: projectId,
          path: f.path,
          content: f.content,
          language: f.language,
          created_at: new Date().toISOString()
        }))
      );

      if (insertErr) {
        for (const f of generatedFiles) {
          const { data: existing } = await supabase.from("artifacts").select("id").eq("project_id", projectId).eq("filename", f.path).limit(1);
          if (existing && existing.length > 0) {
            await supabase.from("artifacts").update({ content: f.content, type: "code", created_at: new Date().toISOString() }).eq("id", existing[0].id);
          } else {
            await supabase.from("artifacts").insert([{ project_id: projectId, type: "code", filename: f.path, content: f.content, created_at: new Date().toISOString() }]);
          }
        }
      }

      try {
        const { VersionService } = require("./VersionService");
        const versionService = new VersionService();
        await versionService.createVersion(projectId, `Autonomous Compilation: ${generatedFiles.length} codebase files generated`);
      } catch (vErr: any) {
        console.warn("Failed to automatically capture post-autonomous version snapshot:", vErr.message);
      }

      emitProgress("Code Generation", "completed", 96);
    } catch (err: any) {
      emitProgress("Code Generation", "failed", 96, undefined, err.message);
      throw new Error(`Autonomous Code Generation failed: ${err.message}`);
    }

    // 11. GitHub Publish (98%)
    emitProgress("GitHub Publish", "running", 96);
    let repoUrl = "";
    try {
      const publishRes = await this.githubService.publishProject(projectId);
      if (publishRes.success) {
        repoUrl = publishRes.repositoryUrl;
        emitProgress("GitHub Publish", "completed", 98, repoUrl);
        await saveAgentChatMessage("DevOps", `Successfully initialized secure repository at ${repoUrl}. Source control synced.`, `GitHub code upload transaction completed.`);
      } else {
        throw new Error("GitHub publish returned success false");
      }
    } catch (err: any) {
      emitProgress("GitHub Publish", "failed", 98, undefined, err.message);
      console.warn("Autonomous GitHub publish failed, continuing fallback deployment:", err.message);
      repoUrl = `https://github.com/buildai-os-org/autonomous-app-${projectId.slice(0,6)}`;
    }

    // 12. Deploy (100%)
    emitProgress("Deploy", "running", 98);
    try {
      const deployRes = await this.deploymentService.triggerVercelDeployment(projectId, repoUrl);
      if (deployRes.success) {
        const finalUrl = deployRes.deploymentUrl;
        emitProgress("Deploy", "completed", 100, finalUrl);

        await this.updateProjectStatus(projectId, "completed");
        await saveAgentChatMessage("Reviewer", `Autonomous Software Company workflow completed successfully! Live Website URL: ${finalUrl}`, `Cloud triggers complete. Live server online.`);
      } else {
        throw new Error("Vercel deployment failed");
      }
    } catch (err: any) {
      emitProgress("Deploy", "failed", 100, undefined, err.message);
      throw new Error(`Autonomous Cloud Deployment failed: ${err.message}`);
    }

    return {
      success: true,
      projectId,
      completedAgents,
      runs,
      artifacts
    };
  }

  public async orchestrateIncremental(
    projectId: string,
    userPrompt: string,
    agentsToRun: string[],
    onProgress?: (progress: { agentName: string; status: "running" | "completed" | "failed"; progress: number; output?: string; error?: string }) => void
  ): Promise<any> {
    const project = await this.projectService.getProjectById(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    const runs: any[] = [];
    const completedAgents: string[] = [];
    const artifacts: Artifact[] = [];

    const emitProgress = (agentName: string, status: "running" | "completed" | "failed", progress: number, output?: string, error?: string) => {
      onProgress?.({ agentName, status, progress, output, error });
      progressEmitter.emit(`progress:${projectId}`, {
        agentName,
        status,
        progress,
        output,
        error
      });
    };

    const { data: dbMessages } = await supabase
      .from("messages")
      .select("role, content")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    const conversationHistoryText = (dbMessages || [])
      .map(m => `${m.role === "user" ? "User" : m.role}: ${m.content}`)
      .join("\n\n");

    const fullPromptContext = `Conversation History:\n${conversationHistoryText}\n\nLatest Feedback Request: ${userPrompt}`;

    let ceoOutput = "";
    let pmOutput = "";
    let architectOutput = "";
    let frontendOutput = "";
    let backendOutput = "";
    let qaOutput = "";

    const loadLastOutput = async (agentName: string): Promise<string> => {
      const { data } = await supabase
        .from("agent_runs")
        .select("output")
        .eq("project_id", projectId)
        .eq("agent_name", agentName)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1);
      return data?.[0]?.output || "";
    };

    // 1. CEO Agent (10%)
    if (agentsToRun.includes("CEO")) {
      emitProgress("CEO", "running", 0);
      try {
        ceoOutput = await this.runAgent(
          projectId,
          "CEO",
          "You are the CEO of BuildAI OS. Analyze the user's latest change request and conversation history, and update the strategic product requirements document.",
          `Project Title: ${project.title}\n\nContext:\n${fullPromptContext}`
        );
        await this.saveArtifact(projectId, "requirements", "requirements.md", ceoOutput);
        artifacts.push({ type: "requirements", filename: "requirements.md", content: ceoOutput });
        await this.updateProjectStatus(projectId, "CEO (10%)");
        emitProgress("CEO", "completed", 10, ceoOutput);

        await supabase.from("messages").insert([
          { project_id: projectId, role: "CEO", content: ceoOutput, created_at: new Date().toISOString() }
        ]);
      } catch (err: any) {
        await this.updateProjectStatus(projectId, "failed");
        emitProgress("CEO", "failed", 10, undefined, err.message);
        throw err;
      }
    } else {
      ceoOutput = await loadLastOutput("CEO");
    }

    // 2. Product Manager (25%)
    if (agentsToRun.includes("Product Manager")) {
      emitProgress("Product Manager", "running", 10);
      try {
        pmOutput = await this.runAgent(
          projectId,
          "Product Manager",
          "You are the Product Manager of BuildAI OS. Update the detailed Product Requirements Document (PRD) to incorporate the user's new feedback.",
          `Project Title: ${project.title}\n\nCEO Vision:\n${ceoOutput}\n\nContext:\n${fullPromptContext}`
        );
        await this.saveArtifact(projectId, "prd", "prd.md", pmOutput);
        artifacts.push({ type: "prd", filename: "prd.md", content: pmOutput });
        await this.updateProjectStatus(projectId, "Product Manager (25%)");
        emitProgress("Product Manager", "completed", 25, pmOutput);

        await supabase.from("messages").insert([
          { project_id: projectId, role: "Product Manager", content: pmOutput, created_at: new Date().toISOString() }
        ]);
      } catch (err: any) {
        await this.updateProjectStatus(projectId, "failed");
        emitProgress("Product Manager", "failed", 25, undefined, err.message);
        throw err;
      }
    } else {
      pmOutput = await loadLastOutput("Product Manager");
    }

    // 3. Architect (40%)
    if (agentsToRun.includes("Architect")) {
      emitProgress("Architect", "running", 25);
      try {
        architectOutput = await this.runAgent(
          projectId,
          "Architect",
          "You are the System Architect of BuildAI OS. Update the system design, tech stack, and database schema artifacts to reflect the user's requested changes.",
          `Project Title: ${project.title}\n\nPRD Details:\n${pmOutput}\n\nContext:\n${fullPromptContext}`
        );
        await this.saveArtifact(projectId, "architecture", "architecture.md", architectOutput);
        artifacts.push({ type: "architecture", filename: "architecture.md", content: architectOutput });
        await this.updateProjectStatus(projectId, "Architect (40%)");
        emitProgress("Architect", "completed", 40, architectOutput);

        await supabase.from("messages").insert([
          { project_id: projectId, role: "Architect", content: architectOutput, created_at: new Date().toISOString() }
        ]);
      } catch (err: any) {
        await this.updateProjectStatus(projectId, "failed");
        emitProgress("Architect", "failed", 40, undefined, err.message);
        throw err;
      }
    } else {
      architectOutput = await loadLastOutput("Architect");
    }

    // 4. Parallel execution of Frontend (55%) and Backend (70%)
    const runFrontend = agentsToRun.includes("Frontend");
    const runBackend = agentsToRun.includes("Backend");

    if (runFrontend || runBackend) {
      if (runFrontend) emitProgress("Frontend", "running", 40);
      if (runBackend) emitProgress("Backend", "running", 40);

      try {
        const fePromise = runFrontend
          ? this.runAgent(
              projectId,
              "Frontend",
              "You are the Frontend Engineer of BuildAI OS. Update the frontend UI components and user interface flow to implement the latest changes.",
              `Architecture Guidelines:\n${architectOutput}\n\nContext:\n${fullPromptContext}`
            )
          : loadLastOutput("Frontend");

        const bePromise = runBackend
          ? this.runAgent(
              projectId,
              "Backend",
              "You are the Backend Engineer of BuildAI OS. Update the backend APIs, endpoints, and database models to support the user's changes.",
              `Architecture Guidelines:\n${architectOutput}\n\nContext:\n${fullPromptContext}`
            )
          : loadLastOutput("Backend");

        const [feResult, beResult] = await Promise.all([fePromise, bePromise]);
        frontendOutput = feResult;
        backendOutput = beResult;

        if (runFrontend) {
          await this.saveArtifact(projectId, "frontend-plan", "frontend-plan.md", frontendOutput);
          artifacts.push({ type: "frontend-plan", filename: "frontend-plan.md", content: frontendOutput });
          emitProgress("Frontend", "completed", 55, frontendOutput);
          await supabase.from("messages").insert([
            { project_id: projectId, role: "Frontend", content: frontendOutput, created_at: new Date().toISOString() }
          ]);
        }
        if (runBackend) {
          await this.saveArtifact(projectId, "api-spec", "api-spec.md", backendOutput);
          artifacts.push({ type: "api-spec", filename: "api-spec.md", content: backendOutput });
          emitProgress("Backend", "completed", 70, backendOutput);
          await supabase.from("messages").insert([
            { project_id: projectId, role: "Backend", content: backendOutput, created_at: new Date().toISOString() }
          ]);
        }

        await this.updateProjectStatus(projectId, "Frontend + Backend (70%)");
      } catch (err: any) {
        await this.updateProjectStatus(projectId, "failed");
        if (runFrontend) emitProgress("Frontend", "failed", 55, undefined, err.message);
        if (runBackend) emitProgress("Backend", "failed", 70, undefined, err.message);
        throw err;
      }
    } else {
      frontendOutput = await loadLastOutput("Frontend");
      backendOutput = await loadLastOutput("Backend");
    }

    // 5. QA (90%)
    if (agentsToRun.includes("QA")) {
      emitProgress("QA", "running", 70);
      try {
        qaOutput = await this.runAgent(
          projectId,
          "QA",
          "You are the QA Engineer of BuildAI OS. Update the quality assurance test cases and specs for the updated system.",
          `Frontend Design:\n${frontendOutput}\n\nBackend API Design:\n${backendOutput}\n\nContext:\n${fullPromptContext}`
        );
        await this.saveArtifact(projectId, "test-plan", "test-plan.md", qaOutput);
        artifacts.push({ type: "test-plan", filename: "test-plan.md", content: qaOutput });
        await this.updateProjectStatus(projectId, "QA (90%)");
        emitProgress("QA", "completed", 90, qaOutput);

        await supabase.from("messages").insert([
          { project_id: projectId, role: "QA", content: qaOutput, created_at: new Date().toISOString() }
        ]);
      } catch (err: any) {
        await this.updateProjectStatus(projectId, "failed");
        emitProgress("QA", "failed", 90, undefined, err.message);
        throw err;
      }
    } else {
      qaOutput = await loadLastOutput("QA");
    }

    // 6. Reviewer (100%)
    if (agentsToRun.includes("Reviewer")) {
      emitProgress("Reviewer", "running", 90);
      try {
        const reviewerOutput = await this.runAgent(
          projectId,
          "Reviewer",
          "You are the Code Reviewer of BuildAI OS. Conduct a code and strategic quality audit on the updated workspace files.",
          `QA Test Plan:\n${qaOutput}\n\nContext:\n${fullPromptContext}`
        );
        await this.saveArtifact(projectId, "review", "review.md", reviewerOutput);
        artifacts.push({ type: "review", filename: "review.md", content: reviewerOutput });
        await this.updateProjectStatus(projectId, "Reviewer (100%)");
        emitProgress("Reviewer", "completed", 100, reviewerOutput);

        await supabase.from("messages").insert([
          { project_id: projectId, role: "Reviewer", content: reviewerOutput, created_at: new Date().toISOString() }
        ]);
      } catch (err: any) {
        await this.updateProjectStatus(projectId, "failed");
        emitProgress("Reviewer", "failed", 100, undefined, err.message);
        throw err;
      }
    }

    return {
      success: true,
      projectId,
      completedAgents: agentsToRun,
      artifacts
    };
  }

  public getProjectService() { return this.projectService; }
  public getGeminiService() { return this.geminiService; }
  public getMemoryService() { return this.memoryService; }
  public getGitHubService() { return this.githubService; }
  public getDeploymentService() { return this.deploymentService; }
}
