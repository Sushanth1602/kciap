import { ProductionLogger } from "../utils/Logger";

interface QueueJob {
  id: string;
  projectId: string;
  task: () => Promise<void>;
  retries: number;
  maxRetries: number;
  delayMs: number;
}

export class BackgroundJobQueue {
  private static instance: BackgroundJobQueue;
  private queue: QueueJob[] = [];
  private processing = false;

  private constructor() {}

  public static getInstance(): BackgroundJobQueue {
    if (!BackgroundJobQueue.instance) {
      BackgroundJobQueue.instance = new BackgroundJobQueue();
    }
    return BackgroundJobQueue.instance;
  }

  /**
   * Enqueue a new background task with retry bounds
   */
  public enqueue(projectId: string, task: () => Promise<void>, maxRetries: number = 3, delayMs: number = 2000) {
    const job: QueueJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      projectId,
      task,
      retries: 0,
      maxRetries,
      delayMs
    };

    this.queue.push(job);
    ProductionLogger.info(`Enqueued background job ${job.id} for project ${projectId}.`);
    
    if (!this.processing) {
      this.processNext();
    }
  }

  /**
   * Sequential background worker loops
   */
  private async processNext() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const job = this.queue.shift()!;

    try {
      ProductionLogger.info(`Starting background job ${job.id}...`);
      await job.task();
      ProductionLogger.info(`Background job ${job.id} finished successfully!`);
    } catch (err: any) {
      job.retries += 1;
      ProductionLogger.warn(`Background job ${job.id} failed (Attempt ${job.retries}/${job.maxRetries}). Error: ${err.message}`);

      if (job.retries < job.maxRetries) {
        // Apply backoff retry delay and re-enqueue
        const nextDelay = job.delayMs * Math.pow(2, job.retries);
        setTimeout(() => {
          this.queue.push(job);
          if (!this.processing) this.processNext();
        }, nextDelay);
      } else {
        await ProductionLogger.error(`Background job ${job.id} exhausted all retries. Process terminated.`, err, job.projectId);
      }
    }

    this.processNext();
  }
}
