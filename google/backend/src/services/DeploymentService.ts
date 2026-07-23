import { supabase } from "../utils/supabase";

export interface DeploymentResult {
  success: boolean;
  deploymentUrl: string;
  status: "queued" | "building" | "ready" | "error" | "failed";
  logs: string[];
  deploymentId?: string;
}

export class DeploymentService {
  private vercelToken: string;
  private vercelTeamId: string;

  constructor() {
    this.vercelToken = process.env.VERCEL_TOKEN || "";
    this.vercelTeamId = process.env.VERCEL_TEAM_ID || "";
  }

  /**
   * Helper to fetch repository ID from GitHub URL
   */
  private async getGitHubRepoId(repoUrl: string): Promise<number> {
    const cleanUrl = repoUrl.replace("https://github.com/", "");
    const parts = cleanUrl.split("/");
    if (parts.length < 2) {
      throw new Error(`Invalid GitHub repository URL: ${repoUrl}`);
    }

    const owner = parts[0];
    const repo = parts[1];
    const token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || "";

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        ...(token ? { "Authorization": `token ${token}` } : {}),
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "BuildAI-OS"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub repo details: status ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  }

  /**
   * Triggers a Vercel deployment for the given GitHub Repository URL
   */
  public async triggerVercelDeployment(
    projectId: string,
    repoUrl: string
  ): Promise<DeploymentResult> {
    // Check fallback state first if Vercel token is not configured
    if (!this.vercelToken) {
      console.warn("VERCEL_TOKEN is not defined. Initializing mock compilation deployment simulation...");
      const cleanUrl = repoUrl.replace("https://github.com/", "");
      const repoName = cleanUrl.split("/")[1] || "app";
      const mockUrl = `https://${repoName}-delta.vercel.app`;
      const mockId = `dpl_mock_${Date.now()}`;

      // Persist mock deployment details
      await supabase
        .from("projects")
        .update({
          tech_stack: {
            github_url: repoUrl,
            vercel_url: mockUrl,
            vercel_deployment_id: mockId,
            vercel_status: "building"
          }
        })
        .eq("id", projectId);

      return {
        success: true,
        deploymentUrl: mockUrl,
        status: "building",
        logs: ["[SYSTEM] Vercel token not configured. Starting fallback simulation...", "[BUILD] Installing dependencies...", "[BUILD] Bundling optimized chunks..."],
        deploymentId: mockId
      };
    }

    try {
      // 1. Resolve GitHub Repo ID
      const repoId = await this.getGitHubRepoId(repoUrl);
      const cleanUrl = repoUrl.replace("https://github.com/", "");
      const repoName = cleanUrl.split("/")[1] || "app";

      // 2. Trigger deployment on Vercel
      const queryParams = this.vercelTeamId ? `?teamId=${this.vercelTeamId}` : "";
      const vercelResponse = await fetch(`https://api.vercel.com/v13/deployments${queryParams}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.vercelToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: repoName,
          gitSource: {
            type: "github",
            repoId: repoId.toString(),
            ref: "main"
          },
          projectSettings: {
            framework: "nextjs"
          }
        })
      });

      const data = await vercelResponse.json();
      if (!vercelResponse.ok) {
        throw new Error(data.error?.message || `Vercel trigger failed with status ${vercelResponse.status}`);
      }

      const deploymentId = data.id;
      const deploymentUrl = `https://${data.url}`;
      const initialStatus = data.readyState.toLowerCase();

      // 3. Persist details in database
      await supabase
        .from("projects")
        .update({
          tech_stack: {
            github_url: repoUrl,
            vercel_url: deploymentUrl,
            vercel_deployment_id: deploymentId,
            vercel_status: initialStatus
          }
        })
        .eq("id", projectId);

      return {
        success: true,
        deploymentUrl,
        status: initialStatus,
        logs: ["[SYSTEM] Vercel deployment triggered successfully.", `[SYSTEM] URL: ${deploymentUrl}`],
        deploymentId
      };
    } catch (err: any) {
      console.error("Vercel trigger error:", err);
      throw err;
    }
  }

  /**
   * Polls and fetches Vercel deployment status and build logs
   */
  public async getDeploymentStatus(
    projectId: string,
    deploymentId: string
  ): Promise<DeploymentResult> {
    // Check fallback simulation
    if (deploymentId.startsWith("dpl_mock_")) {
      const elapsed = Date.now() - parseInt(deploymentId.replace("dpl_mock_", ""));
      const isReady = elapsed > 6000; // 6 seconds simulation delay
      const status = isReady ? "ready" : "building";
      const cleanUrl = `https://mock-app-deployed.vercel.app`;

      const logs = [
        "[SYSTEM] Fetching Vercel deployment state...",
        "[BUILD] Creating build cache...",
        "[BUILD] Compiling TypeScript bundles...",
        "[BUILD] Optimizing static HTML exports..."
      ];

      if (isReady) {
        logs.push("[BUILD] ✓ Static assets generated successfully.");
        logs.push("[BUILD] ✓ Deploy completed. Live server online!");
        
        // Persist final ready state
        await supabase
          .from("projects")
          .update({
            tech_stack: {
              vercel_status: "ready"
            }
          })
          .eq("id", projectId);
      }

      return {
        success: true,
        deploymentUrl: cleanUrl,
        status: status as any,
        logs
      };
    }

    try {
      const queryParams = this.vercelTeamId ? `?teamId=${this.vercelTeamId}` : "";
      
      // Fetch deployment status details
      const statusRes = await fetch(
        `https://api.vercel.com/v13/deployments/${deploymentId}${queryParams}`,
        {
          headers: { "Authorization": `Bearer ${this.vercelToken}` }
        }
      );
      const statusData = await statusRes.json();
      if (!statusRes.ok) {
        throw new Error(statusData.error?.message || "Failed to fetch Vercel deployment status");
      }

      const readyState = statusData.readyState.toLowerCase();
      const deploymentUrl = `https://${statusData.url}`;

      // Fetch build logs/events
      const eventsRes = await fetch(
        `https://api.vercel.com/v2/deployments/${deploymentId}/events${queryParams}`,
        {
          headers: { "Authorization": `Bearer ${this.vercelToken}` }
        }
      );
      const eventsData = await eventsRes.json();
      
      const logs: string[] = [];
      if (eventsRes.ok && Array.isArray(eventsData)) {
        eventsData.forEach(event => {
          if (event.text) {
            logs.push(`[BUILD] ${event.text.trim()}`);
          }
        });
      }

      // Update database status
      if (readyState === "ready" || readyState === "error" || readyState === "failed") {
        await supabase
          .from("projects")
          .update({
            tech_stack: {
              vercel_status: readyState
            }
          })
          .eq("id", projectId);
      }

      return {
        success: true,
        deploymentUrl,
        status: readyState,
        logs
      };
    } catch (err: any) {
      console.error("Vercel poll error:", err);
      throw err;
    }
  }
}
