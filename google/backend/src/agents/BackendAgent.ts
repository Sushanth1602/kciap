import { Agent, AgentResult } from "../types/Agent";
import { Task } from "../types/Task";
import { MemoryService } from "../services/MemoryService";

export class BackendAgent implements Agent {
  public id = "agent-backend";
  public role = "Backend";
  public name = "Core";

  public async execute(task: Task, context: MemoryService): Promise<AgentResult> {
    const result = `Backend Agent generated authentication routing controllers and database query helpers.`;
    context.storeEntry(this.role, this.name, task.description, result);
    return {
      status: "success",
      result,
      nextAgent: "QA",
      artifacts: [
        { path: "api/projects.ts", content: `export async function getProjects() { return []; }` }
      ]
    };
  }
}
