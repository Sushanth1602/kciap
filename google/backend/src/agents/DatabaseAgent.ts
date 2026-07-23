import { Agent, AgentResult } from "../types/Agent";
import { Task } from "../types/Task";
import { MemoryService } from "../services/MemoryService";

export class DatabaseAgent implements Agent {
  public id = "agent-database";
  public role = "Database";
  public name = "Schema";

  public async execute(task: Task, context: MemoryService): Promise<AgentResult> {
    const result = `Database Agent scaffolded migrations and schema constraints for PostgreSQL tables.`;
    context.storeEntry(this.role, this.name, task.description, result);
    return {
      status: "success",
      result,
      nextAgent: "Backend",
      artifacts: [
        { path: "database/schema.sql", content: `CREATE TABLE IF NOT EXISTS users (\n  id SERIAL PRIMARY KEY,\n  email VARCHAR UNIQUE\n);` }
      ]
    };
  }
}
