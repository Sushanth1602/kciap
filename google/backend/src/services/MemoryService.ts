import { supabase } from "../utils/supabase";

export interface MemoryLog {
  role: string;
  name: string;
  taskDesc: string;
  result: string;
  timestamp: string;
}

export class MemoryService {
  private history: MemoryLog[] = [];
  private artifacts: Map<string, string> = new Map();

  public storeEntry(role: string, name: string, taskDesc: string, result: string): void {
    this.history.push({
      role,
      name,
      taskDesc,
      result,
      timestamp: new Date().toISOString()
    });
  }

  public logAction(role: string, name: string, taskDesc: string, result: string): Promise<void> {
    this.storeEntry(role, name, taskDesc, result);
    return Promise.resolve();
  }

  public storeArtifact(path: string, content: string): void {
    this.artifacts.set(path, content);
  }

  public retrieveArtifact(path: string): string | null {
    return this.artifacts.get(path) || null;
  }

  public getHistory(): MemoryLog[] {
    return [...this.history];
  }

  public getArtifacts(): Map<string, string> {
    return new Map(this.artifacts);
  }

  public clear(): void {
    this.history = [];
    this.artifacts.clear();
  }

  /**
   * Retrieve persistent agent memory from Supabase
   */
  public async getAgentMemory(projectId: string, agentName: string): Promise<string> {
    try {
      // 1. Try querying agent_memory table
      const { data, error } = await supabase
        .from("agent_memory")
        .select("memory")
        .eq("project_id", projectId)
        .eq("agent_name", agentName)
        .maybeSingle();

      if (!error && data) {
        return data.memory || "";
      }

      // 2. Fallback: Query artifacts table
      const filename = `${agentName.toLowerCase().replace(/\s+/g, "_")}_memory.json`;
      const { data: fallbackData } = await supabase
        .from("artifacts")
        .select("content")
        .eq("project_id", projectId)
        .eq("filename", filename)
        .maybeSingle();

      if (fallbackData) {
        const parsed = JSON.parse(fallbackData.content);
        return parsed.memory || "";
      }
    } catch (err) {
      console.warn(`Failed to retrieve memory for agent ${agentName}:`, err);
    }
    return "";
  }

  /**
   * Store persistent agent memory to Supabase
   */
  public async saveAgentMemory(projectId: string, agentName: string, memory: string): Promise<void> {
    const payload = {
      project_id: projectId,
      agent_name: agentName,
      memory,
      updated_at: new Date().toISOString()
    };

    try {
      // 1. Try upserting into agent_memory table
      const { error } = await supabase
        .from("agent_memory")
        .upsert(payload, { onConflict: "project_id,agent_name" });

      if (!error) return;

      // If table doesn't exist, fallback to saving in artifacts table
      if (error.message.includes("Could not find the table") || error.code === "PGRST205") {
        const filename = `${agentName.toLowerCase().replace(/\s+/g, "_")}_memory.json`;
        
        const { data: existing } = await supabase
          .from("artifacts")
          .select("id")
          .eq("project_id", projectId)
          .eq("filename", filename)
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase
            .from("artifacts")
            .update({ content: JSON.stringify(payload), created_at: new Date().toISOString() })
            .eq("id", existing[0].id);
        } else {
          await supabase
            .from("artifacts")
            .insert([
              {
                project_id: projectId,
                type: "memory",
                filename,
                content: JSON.stringify(payload),
                created_at: new Date().toISOString()
              }
            ]);
        }
      } else {
        throw error;
      }
    } catch (err: any) {
      console.warn(`Failed to save memory for agent ${agentName}:`, err.message);
    }
  }
}
