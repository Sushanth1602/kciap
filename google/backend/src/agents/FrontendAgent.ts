import { Agent, AgentResult } from "../types/Agent";
import { Task } from "../types/Task";
import { MemoryService } from "../services/MemoryService";

export class FrontendAgent implements Agent {
  public id = "agent-frontend";
  public role = "Frontend";
  public name = "Pixel";

  public async execute(task: Task, context: MemoryService): Promise<AgentResult> {
    const result = `Frontend Agent constructed application navbar layouts and patient register views.`;
    context.storeEntry(this.role, this.name, task.description, result);
    return {
      status: "success",
      result,
      nextAgent: "QA",
      artifacts: [
        { path: "app/page.tsx", content: `export default function Page() { return <div>Clinic Cockpit</div>; }` }
      ]
    };
  }
}
