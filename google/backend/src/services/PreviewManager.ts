import { ChildProcess } from "child_process";
import net from "net";

export interface PreviewSession {
  projectId: string;
  process: ChildProcess;
  port: number;
  url: string;
  logs: string[];
  listeners: Set<(data: { type: string; message: string }) => void>;
  status: "compiling" | "ready" | "failed";
}

export class PreviewManager {
  private static instance: PreviewManager;
  private sessions: Map<string, PreviewSession> = new Map();

  private constructor() {
    // Prevent process leaks on application exit
    if (typeof process !== "undefined") {
      process.on("exit", () => this.cleanupAll());
      process.on("SIGINT", () => {
        this.cleanupAll();
        process.exit();
      });
      process.on("SIGTERM", () => {
        this.cleanupAll();
        process.exit();
      });
    }
  }

  public static getInstance(): PreviewManager {
    if (!PreviewManager.instance) {
      PreviewManager.instance = new PreviewManager();
    }
    return PreviewManager.instance;
  }

  public getSession(projectId: string): PreviewSession | undefined {
    return this.sessions.get(projectId);
  }

  public registerSession(projectId: string, process: ChildProcess, port: number, url: string) {
    this.killSession(projectId);
    
    const session: PreviewSession = {
      projectId,
      process,
      port,
      url,
      logs: [],
      listeners: new Set(),
      status: "compiling"
    };

    this.sessions.set(projectId, session);
    return session;
  }

  public addLog(projectId: string, message: string, type: "stdout" | "stderr" | "system" = "stdout") {
    const session = this.sessions.get(projectId);
    if (!session) return;

    const logEntry = `[${type.toUpperCase()}] ${message}`;
    session.logs.push(logEntry);
    
    // Cap in-memory logs
    if (session.logs.length > 1000) {
      session.logs.shift();
    }

    // Broadcast log to all listeners
    session.listeners.forEach(listener => {
      listener({ type, message });
    });
  }

  public setStatus(projectId: string, status: PreviewSession["status"]) {
    const session = this.sessions.get(projectId);
    if (session) {
      session.status = status;
      session.listeners.forEach(listener => {
        listener({ type: "status", message: status });
      });
    }
  }

  public addListener(projectId: string, listener: (data: { type: string; message: string }) => void) {
    const session = this.sessions.get(projectId);
    if (session) {
      session.listeners.add(listener);
    }
  }

  public removeListener(projectId: string, listener: (data: { type: string; message: string }) => void) {
    const session = this.sessions.get(projectId);
    if (session) {
      session.listeners.delete(listener);
    }
  }

  public killSession(projectId: string) {
    const session = this.sessions.get(projectId);
    if (session) {
      console.log(`Killing active preview process for project ${projectId} on port ${session.port}`);
      try {
        session.process.kill("SIGTERM");
      } catch (err) {
        console.error(`Failed to terminate child process for ${projectId}:`, err);
      }
      this.sessions.delete(projectId);
    }
  }

  public cleanupAll() {
    for (const projectId of this.sessions.keys()) {
      this.killSession(projectId);
    }
  }

  public async allocateFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
      const server = net.createServer();
      server.unref();
      server.on("error", reject);
      server.listen(0, () => {
        const address = server.address();
        const port = typeof address === "string" ? 0 : address?.port || 0;
        server.close(() => {
          resolve(port);
        });
      });
    });
  }
}
