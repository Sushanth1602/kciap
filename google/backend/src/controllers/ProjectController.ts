import { AgentOrchestrator } from "../services/AgentOrchestrator";

export class ProjectController {
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.orchestrator = new AgentOrchestrator();
  }

  public async startProject(
    prompt: string,
    name: string
  ): Promise<any> {
    const project = await this.orchestrator.getProjectService().createProject(name, prompt);
    // Asynchronously run orchestration
    this.orchestrator.orchestrate(project.id, prompt).catch(console.error);
    return project;
  }

  public async getProjectStatus(id: string): Promise<any> {
    const project = await this.orchestrator.getProjectService().getProjectById(id);
    if (!project) return { error: "Project not found" };
    return {
      id: project.id,
      status: project.status
    };
  }

  public async getProjectLogs(id: string): Promise<any> {
    const history = await this.orchestrator.getMemoryService().getHistory();
    return { projectId: id, logs: history };
  }
}
