import { ProjectRepository, Project } from "../repositories/ProjectRepository";
import { ProjectEntity } from "../models/ProjectModel";
import { Task } from "../types/Task";

export class ProjectService {
  private repository: ProjectRepository;

  constructor() {
    this.repository = new ProjectRepository();
  }

  // 1. New required methods with validation
  public async createProject(
    title: string,
    prompt: string,
    userId?: string | null
  ): Promise<Project> {
    if (title === undefined || title === null) {
      throw new Error("Title is required");
    }
    if (prompt === undefined || prompt === null) {
      throw new Error("Prompt is required");
    }

    const trimmedTitle = title.trim();
    const trimmedPrompt = prompt.trim();

    if (trimmedTitle === "") {
      throw new Error("Title cannot be empty");
    }
    if (trimmedPrompt === "") {
      throw new Error("Prompt cannot be empty");
    }

    return this.repository.createProject(trimmedTitle, trimmedPrompt, userId);
  }

  public async getProjects(): Promise<Project[]> {
    return this.repository.getProjects();
  }

  public async getProjectById(id: string): Promise<Project | null> {
    if (!id || id.trim() === "") {
      throw new Error("Project ID is required");
    }
    return this.repository.getProjectById(id.trim());
  }

  public async deleteProject(id: string): Promise<boolean> {
    if (!id || id.trim() === "") {
      throw new Error("Project ID is required");
    }
    return this.repository.deleteProject(id.trim());
  }

  // 2. Backward compatibility methods
  public async getProject(id: string): Promise<ProjectEntity | null> {
    return this.repository.findById(id);
  }

  public async updateProjectStatus(
    id: string,
    status: ProjectEntity["status"]
  ): Promise<ProjectEntity | null> {
    const project = await this.repository.findById(id);
    if (!project) return null;
    project.status = status;
    return this.repository.save(project);
  }

  public async saveProjectTasks(id: string, tasks: Task[]): Promise<ProjectEntity | null> {
    const project = await this.repository.findById(id);
    if (!project) return null;
    project.tasks = tasks;
    return this.repository.save(project);
  }
}
