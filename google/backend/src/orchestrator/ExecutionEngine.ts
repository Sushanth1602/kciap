import { Agent } from "../types/Agent";
import { Task } from "../types/Task";
import { MemoryService } from "../services/MemoryService";
import { TaskQueue } from "./TaskQueue";

export interface ExecutionEvents {
  onAgentStarted?: (agent: Agent, task: Task) => void;
  onAgentProgress?: (agent: Agent, task: Task, progress: number) => void;
  onAgentCompleted?: (agent: Agent, task: Task, result: string) => void;
  onArtifactCreated?: (agent: Agent, path: string, content: string) => void;
}

export class ExecutionEngine {
  private agents: Map<string, Agent> = new Map();

  constructor(agentsList: Agent[]) {
    agentsList.forEach(agent => this.agents.set(agent.role, agent));
  }

  public async executeTasks(
    queue: TaskQueue,
    context: MemoryService,
    events: ExecutionEvents
  ): Promise<void> {
    const activePromises: Map<string, Promise<void>> = new Map();

    while (!queue.isComplete() && !queue.hasFailedTasks()) {
      const readyTasks = queue.getReadyTasks();

      // Dispatch newly ready tasks
      for (const task of readyTasks) {
        if (activePromises.has(task.id)) continue;

        const agent = this.agents.get(task.assignedTo);
        if (!agent) {
          queue.updateStatus(task.id, "failed", `No agent registered for role: ${task.assignedTo}`);
          continue;
        }

        queue.updateStatus(task.id, "running");
        
        // Dispatch task executor promise
        const taskPromise = (async () => {
          try {
            if (events.onAgentStarted) {
              events.onAgentStarted(agent, task);
            }

            // Simulate progress step indicators
            for (let p = 10; p <= 90; p += 20) {
              await new Promise(r => setTimeout(r, 100)); // 100ms ticks
              if (events.onAgentProgress) {
                events.onAgentProgress(agent, task, p);
              }
            }

            const agentResult = await agent.execute(task, context);
            
            if (agentResult.status === "success") {
              // Store artifacts
              agentResult.artifacts.forEach(art => {
                context.storeArtifact(art.path, art.content);
                if (events.onArtifactCreated) {
                  events.onArtifactCreated(agent, art.path, art.content);
                }
              });

              queue.updateStatus(task.id, "completed", agentResult.result);
              if (events.onAgentCompleted) {
                events.onAgentCompleted(agent, task, agentResult.result);
              }
            } else {
              queue.updateStatus(task.id, "failed", agentResult.result);
            }
          } catch (err: any) {
            queue.updateStatus(task.id, "failed", err.message || "Unknown error during execution");
          } finally {
            activePromises.delete(task.id);
          }
        })();

        activePromises.set(task.id, taskPromise);
      }

      // If nothing is running and we can't complete, we are deadlocked
      if (activePromises.size === 0 && queue.getPendingTasks().length > 0) {
        throw new Error("Execution Engine deadlock: Ready tasks list empty but queue remains uncompleted.");
      }

      // Wait for at least one active task to complete before polling again
      if (activePromises.size > 0) {
        await Promise.race(activePromises.values());
      }
    }
  }
}
