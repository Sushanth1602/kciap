import { NextRequest } from "next/server";
import { PreviewManager } from "@/backend/src/services/PreviewManager";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id: projectId } = params;

  if (!projectId) {
    return new Response("Project ID is required", { status: 400 });
  }

  const manager = PreviewManager.getInstance();
  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    start(controller) {
      const sendData = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Stream might be closed
        }
      };

      // 1. Send existing logs from buffer
      const session = manager.getSession(projectId);
      if (session) {
        session.logs.forEach(log => {
          sendData({ type: "stdout", message: log });
        });
        sendData({ type: "status", message: session.status });
      }

      // 2. Register real-time log event listener
      const listener = (data: { type: string; message: string }) => {
        sendData(data);
      };

      manager.addListener(projectId, listener);

      // 3. Keep stream alive and clean up on close
      const keepAliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keep-alive\n\n"));
        } catch (e) {
          clearInterval(keepAliveInterval);
        }
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(keepAliveInterval);
        manager.removeListener(projectId, listener);
        try {
          controller.close();
        } catch (e) {
          // ignore
        }
      });
    }
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  });
}
