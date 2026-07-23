import { Task } from "../types/Task";

export class TaskQueue {
  private tasks: Map<string, Task> = new Map();

  constructor(initialTasks: Task[]) {
    initialTasks.forEach(task => this.tasks.set(task.id, task));
  }

  public getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  public updateStatus(id: string, status: Task["status"], result?: string): void {
    const task = this.tasks.get(id);
    if (task) {
      task.status = status;
      if (result !== undefined) {
        task.result = result;
      }
    }
  }

  public getPendingTasks(): Task[] {
    return this.getAllTasks().filter(t => t.status === "pending");
  }

  public getReadyTasks(): Task[] {
    return this.getPendingTasks().filter(task => {
      // All dependencies must be completed
      return task.dependencies.every(depId => {
        const depTask = this.tasks.get(depId);
        return depTask && depTask.status === "completed";
      });
    });
  }

  public hasRunningTasks(): boolean {
    return this.getAllTasks().some(t => t.status === "running");
  }

  public isComplete(): boolean {
    return this.getAllTasks().every(t => t.status === "completed");
  }

  public hasFailedTasks(): boolean {
    return this.getAllTasks().some(t => t.status === "failed");
  }
}
