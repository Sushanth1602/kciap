import { supabase } from "../utils/supabase";

export interface PublishResult {
  success: boolean;
  repositoryUrl: string;
  branch: string;
  commitSha: string;
}

export class GitHubService {
  private token: string;
  private headers: HeadersInit;

  constructor() {
    this.token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN || "";
    this.headers = {
      "Authorization": `token ${this.token}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "BuildAI-OS"
    };
  }

  /**
   * Helper to request from GitHub API
   */
  private async githubRequest(url: string, options: RequestInit = {}): Promise<any> {
    if (!this.token) {
      throw new Error("GitHub Personal Access Token (GITHUB_PAT or GITHUB_TOKEN) is not configured in backend environment.");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...(options.headers || {})
      }
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errMsg = data.message || `GitHub API Request failed with status ${response.status}`;
      throw new Error(errMsg);
    }
    return data;
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
   * Publishes generated files to a new GitHub repository
   */
  public async publishProject(projectId: string): Promise<PublishResult> {
    // 1. Get Project metadata
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();

    if (projectError || !project) {
      throw new Error(`Project not found: ${projectError?.message || "Unknown error"}`);
    }

    // 2. Load generated files
    const files = await this.loadProjectFiles(projectId);
    if (files.length === 0) {
      throw new Error("No files found to publish. Please generate code first.");
    }

    // 3. Resolve Authenticated GitHub User details
    const user = await this.githubRequest("https://api.github.com/user");
    const owner = user.login;

    // 4. Create repository
    const safeTitle = project.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const uniqueSuffix = Date.now().toString().slice(-6);
    const repoName = `${safeTitle}-${uniqueSuffix}`;

    const createRepoResponse = await this.githubRequest("https://api.github.com/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name: repoName,
        private: true,
        auto_init: true,
        description: `Autonomous codebase compiled by BuildAI OS: ${project.prompt.slice(0, 100)}...`
      })
    });

    const repoOwner = createRepoResponse.owner.login;
    const actualRepoName = createRepoResponse.name;
    const defaultBranch = createRepoResponse.default_branch || "main";
    const repositoryUrl = createRepoResponse.html_url;

    // Sleep briefly to ensure GitHub repository reference propagation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 5. Get Ref to default branch initial commit
    const refData = await this.githubRequest(
      `https://api.github.com/repos/${repoOwner}/${actualRepoName}/git/refs/heads/${defaultBranch}`
    );
    const latestCommitSha = refData.object.sha;

    // 6. Get Base Tree SHA of that commit
    const commitData = await this.githubRequest(
      `https://api.github.com/repos/${repoOwner}/${actualRepoName}/git/commits/${latestCommitSha}`
    );
    const baseTreeSha = commitData.tree.sha;

    // 7. Create a new Tree containing the code files
    const treePayload = files.map(file => ({
      path: file.path,
      mode: "100644",
      type: "blob",
      content: file.content
    }));

    const treeData = await this.githubRequest(
      `https://api.github.com/repos/${repoOwner}/${actualRepoName}/git/trees`,
      {
        method: "POST",
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treePayload
        })
      }
    );
    const newTreeSha = treeData.sha;

    // 8. Create Commit
    const newCommitData = await this.githubRequest(
      `https://api.github.com/repos/${repoOwner}/${actualRepoName}/git/commits`,
      {
        method: "POST",
        body: JSON.stringify({
          message: "Deploy generated app codebase - BuildAI OS",
          tree: newTreeSha,
          parents: [latestCommitSha]
        })
      }
    );
    const newCommitSha = newCommitData.sha;

    // 9. Update ref to new commit
    await this.githubRequest(
      `https://api.github.com/repos/${repoOwner}/${actualRepoName}/git/refs/heads/${defaultBranch}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          sha: newCommitSha,
          force: true
        })
      }
    );

    // 10. Persist repository URL inside tech_stack column of projects table
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        tech_stack: {
          ...(project.tech_stack || {}),
          github_url: repositoryUrl
        }
      })
      .eq("id", projectId);

    if (updateError) {
      console.warn("Failed to persist GitHub URL inside projects table metadata:", updateError.message);
    }

    return {
      success: true,
      repositoryUrl,
      branch: defaultBranch,
      commitSha: newCommitSha
    };
  }
}
