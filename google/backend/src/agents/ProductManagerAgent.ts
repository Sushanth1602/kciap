import { Agent, AgentResult } from "../types/Agent";
import { Task } from "../types/Task";
import { MemoryService } from "../services/MemoryService";

export class ProductManagerAgent implements Agent {
  public id = "agent-pm";
  public role = "Product Manager";
  public name = "Scribe";

  public async execute(task: Task, context: MemoryService): Promise<AgentResult> {
    const result = `Product Manager decomposed requirements into 12 user stories mapping authentication, schedules list, database tables.`;
    context.storeEntry(this.role, this.name, task.description, result);
    return {
      status: "success",
      result,
      nextAgent: "Architect",
      artifacts: [
        { path: "docs/spec.md", content: `# Specifications\n\n- User Story 1: JWT Admin Logins\n- User Story 2: Queue Steppers` }
      ]
    };
  }
}
