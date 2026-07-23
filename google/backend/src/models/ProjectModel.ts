import { Task } from "../types/Task";

export interface ProjectEntity {
  id: string;
  prompt: string;
  name: string;
  stack?: string;
  database?: string;
  deploymentTarget?: string;
  status: "planning" | "generating" | "testing" | "deploying" | "completed";
  tasks: Task[];
  createdAt: string;
}
