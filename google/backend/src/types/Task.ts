export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Agent role (e.g. "CEO", "Architect")
  status: "pending" | "running" | "completed" | "failed";
  dependencies: string[]; // IDs of tasks that must complete first
  result?: string;
  progress?: number;
}
