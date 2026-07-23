import { Task } from "./Task";
import { MemoryService } from "../services/MemoryService";

export interface AgentResult {
  status: "success" | "failed";
  result: string;
  nextAgent?: string;
  artifacts: Array<{ path: string; content: string }>;
}

export interface Agent {
  id: string;
  role: string;
  name: string;
  execute(task: Task, context: MemoryService): Promise<AgentResult>;
}
