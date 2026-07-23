import { Task } from "./Task";

export interface Project {
  id: string;
  prompt: string;
  name: string;
  stack?: string;
  database?: string;
  deploymentTarget?: string;
  tasks: Task[];
  status: "planning" | "generating" | "testing" | "deploying" | "completed";
}
