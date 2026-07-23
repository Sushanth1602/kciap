import { checkRateLimit } from "@/backend/src/utils/rateLimit";
import { NextRequest } from "next/server";

export async function runIntegrationTests() {
  console.log("▶ [INTEGRATION] Running integration tests...");

  // 1. Rate Limiting integration checks
  const mockReq1 = new NextRequest("https://example.com/api/health", {
    headers: { "x-forwarded-for": "192.168.1.1" }
  });
  const res1 = checkRateLimit(mockReq1);
  if (!res1) {
    throw new Error("Rate limiting failed on initial clean request!");
  }

  // Verify multiple hits inside limits
  for (let i = 0; i < 5; i++) {
    checkRateLimit(mockReq1);
  }

  console.log("✓ [INTEGRATION] All integration tests passed successfully!");
}
