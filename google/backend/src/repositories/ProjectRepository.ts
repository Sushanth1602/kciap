import { supabase } from "../utils/supabase";
import { ProjectEntity } from "../models/ProjectModel";

export interface Project {
  id: string;
  user_id: string | null;
  title: string;
  prompt: string;
  status: string;
  tech_stack?: any;
  created_at: string;
  updated_at: string;
}

export class ProjectRepository {
  public async createProject(
    title: string,
    prompt: string,
    userId?: string | null
  ): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          prompt,
          status: "planning",
          user_id: userId || null
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data as Project;
  }

  public async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }

    return data as Project[];
  }

  public async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to get project by ID: ${error.message}`);
    }

    return data as Project | null;
  }

  public async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }

    return true;
  }

  // Backward compatibility methods for ProjectService
  public async findById(id: string): Promise<ProjectEntity | null> {
    const dbProject = await this.getProjectById(id);
    if (!dbProject) return null;
    return {
      id: dbProject.id,
      name: dbProject.title,
      prompt: dbProject.prompt,
      status: dbProject.status as any,
      tasks: [],
      createdAt: dbProject.created_at
    };
  }

  public async save(project: ProjectEntity): Promise<ProjectEntity> {
    const { error } = await supabase
      .from("projects")
      .upsert({
        id: project.id,
        title: project.name,
        prompt: project.prompt,
        status: project.status
      });

    if (error) {
      throw new Error(`Failed to save project entity: ${error.message}`);
    }

    return project;
  }
}
