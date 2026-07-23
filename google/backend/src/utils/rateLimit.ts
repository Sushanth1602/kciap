import { NextRequest } from "next/server";

interface RateLimiterEntry {
  tokens: number;
  lastRefill: number;
}

const limitStore = new Map<string, RateLimiterEntry>();
const BUCKET_CAPACITY = 60;
const REFILL_RATE = 1; // 1 token per second

/**
 * Basic memory token bucket rate limiter for API routes
 */
export function checkRateLimit(request: NextRequest, limit: number = 30): boolean {
  const ip = request.headers.get("x-forwarded-for") || "global-client";
  const now = Date.now();

  let entry = limitStore.get(ip);
  if (!entry) {
    entry = { tokens: BUCKET_CAPACITY, lastRefill: now };
    limitStore.set(ip, entry);
  }

  // Refill tokens based on elapsed time
  const elapsedSeconds = (now - entry.lastRefill) / 1000;
  entry.tokens = Math.min(BUCKET_CAPACITY, entry.tokens + elapsedSeconds * REFILL_RATE);
  entry.lastRefill = now;

  if (entry.tokens >= 1) {
    entry.tokens -= 1;
    limitStore.set(ip, entry);
    return true; // Limit not exceeded
  }

  return false; // Rate limit hit
}
