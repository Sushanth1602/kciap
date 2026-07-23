import { NextRequest, NextResponse } from "next/server";
import { progressEmitter } from "@/backend/src/utils/progressEmitter";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id: projectId } = params;

  if (!projectId) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const responseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
  };

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Listener callback to format as SSE
      const listener = (data: any) => {
        const payload = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      // Register listener
      progressEmitter.on(`progress:${projectId}`, listener);

      // Keep alive heartbeat interval (15s)
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 15000);

      // Clean up on disconnect
      request.signal.addEventListener("abort", () => {
        progressEmitter.off(`progress:${projectId}`, listener);
        clearInterval(heartbeat);
        controller.close();
      });
    }
  });

  return new NextResponse(stream, { headers: responseHeaders });
}
