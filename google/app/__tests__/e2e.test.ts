import { BackgroundJobQueue } from "@/backend/src/services/BackgroundJobQueue";

export async function runEndToEndTests() {
  console.log("▶ [E2E] Running end-to-end tests...");

  // 1. Queue job execution pipeline verification
  const queue = BackgroundJobQueue.getInstance();
  let jobExecuted = false;

  await new Promise<void>((resolve) => {
    queue.enqueue("mock-project", async () => {
      jobExecuted = true;
      resolve();
    });
  });

  if (!jobExecuted) {
    throw new Error("Background job queue failed to run enqueued task!");
  }

  console.log("✓ [E2E] All end-to-end tests passed successfully!");
}
