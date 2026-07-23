import { Project } from "../types/Project";
import { Task } from "../types/Task";
import { MemoryService } from "../services/MemoryService";
import { TaskQueue } from "./TaskQueue";
import { ExecutionEngine, ExecutionEvents } from "./ExecutionEngine";
import { CEOAgent } from "../agents/CEOAgent";
import { ProductManagerAgent } from "../agents/ProductManagerAgent";
import { ArchitectAgent } from "../agents/ArchitectAgent";
import { DatabaseAgent } from "../agents/DatabaseAgent";
import { BackendAgent } from "../agents/BackendAgent";
import { FrontendAgent } from "../agents/FrontendAgent";
import { QAAgent } from "../agents/QAAgent";
import { SecurityAgent } from "../agents/SecurityAgent";
import { DevOpsAgent } from "../agents/DevOpsAgent";
import { ReviewerAgent } from "../agents/ReviewerAgent";

export interface OrchestratorEvents extends ExecutionEvents {
  onProjectCompleted?: (project: Project, context: MemoryService) => void;
}

export class Orchestrator {
  private engine: ExecutionEngine;
  private context: MemoryService;

  constructor() {
    this.context = new MemoryService();
    this.engine = new ExecutionEngine([
      new CEOAgent(),
      new ProductManagerAgent(),
      new ArchitectAgent(),
      new DatabaseAgent(),
      new BackendAgent(),
      new FrontendAgent(),
      new QAAgent(),
      new SecurityAgent(),
      new DevOpsAgent(),
      new ReviewerAgent()
    ]);
  }

  public async runOrchestration(
    prompt: string,
    events: OrchestratorEvents
  ): Promise<Project> {
    this.context.clear();

    // Create execution plan with dependencies
    const tasks: Task[] = [
      {
        id: "t0",
        title: "Requirements Analysis",
        description: `Analyze project scope for prompt: "${prompt}"`,
        assignedTo: "CEO",
        status: "pending",
        dependencies: []
      },
      {
        id: "t1",
        title: "Decompose User Stories",
        description: "Generate structural story backlog schemas",
        assignedTo: "Product Manager",
        status: "pending",
        dependencies: ["t0"]
      },
      {
        id: "t2",
        title: "Stack & Blueprint Mapping",
        description: "Choose optimal frameworks, routing models, and database constraints",
        assignedTo: "Architect",
        status: "pending",
        dependencies: ["t1"]
      },
      {
        id: "t3",
        title: "Database Relational DDL Migrations",
        description: "Scaffold tables for clinic users and appointments queues",
        assignedTo: "Database",
        status: "pending",
        dependencies: ["t2"]
      },
      {
        id: "t4",
        title: "REST Endpoint Generation",
        description: "Generate FastAPI database CRUD routing maps",
        assignedTo: "Backend",
        status: "pending",
        dependencies: ["t3"]
      },
      {
        id: "t5",
        title: "App Shell Navbar Templates",
        description: "Create NextJS sidebar structures and layout frames",
        assignedTo: "Frontend",
        status: "pending",
        dependencies: ["t3"]
      },
      {
        id: "t6",
        title: "Integration Unit Testing",
        description: "Verify authentication verification endpoint logic",
        assignedTo: "QA",
        status: "pending",
        dependencies: ["t4", "t5"]
      },
      {
        id: "t7",
        title: "Vulnerability Scanning Check",
        description: "Verify OWASP credentials compliance checks",
        assignedTo: "Security",
        status: "pending",
        dependencies: ["t6"]
      },
      {
        id: "t8",
        title: "Cloud Run Container Configurations",
        description: "Scaffold Dockerfile deployment variables",
        assignedTo: "DevOps",
        status: "pending",
        dependencies: ["t7"]
      },
      {
        id: "t9",
        title: "Quality Review Checks",
        description: "Complete final rating auditing checks",
        assignedTo: "Reviewer",
        status: "pending",
        dependencies: ["t8"]
      }
    ];

    const project: Project = {
      id: `proj-${Date.now()}`,
      name: "Clinic Manager Portal",
      prompt,
      stack: "Next.js + FastAPI",
      database: "PostgreSQL",
      deploymentTarget: "Google Cloud Run",
      tasks,
      status: "planning"
    };

    const queue = new TaskQueue(tasks);

    project.status = "generating";
    await this.engine.executeTasks(queue, this.context, events);

    if (queue.hasFailedTasks()) {
      project.status = "testing";
      throw new Error("Orchestration pipeline execution failed on tasks.");
    }

    project.status = "completed";
    
    if (events.onProjectCompleted) {
      events.onProjectCompleted(project, this.context);
    }

    return project;
  }
}
