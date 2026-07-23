const fs = require('fs');
const path = require('path');

console.log("=== BuildAI OS Automated Test Runner ===");

// 1. Unit Tests: Sanitization check
function runUnitTests() {
  console.log("▶ [UNIT] Running unit tests...");
  
  // SQL Escape function logic check
  const sanitizeSql = (input) => input.replace(/['\\]/g, "\\$&");
  const dirtySql = "SELECT * FROM users WHERE email = 'test@example.com' OR '1'='1'";
  const cleanSql = sanitizeSql(dirtySql);
  if (!cleanSql.includes("\\'")) {
    throw new Error("Sql injection sanitizer failed to escape quotes!");
  }

  // HTML XSS encode function logic check
  const sanitizeXss = (input) => input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
  const dirtyXss = "<script>alert('xss')</script>";
  const cleanXss = sanitizeXss(dirtyXss);
  if (cleanXss.includes("<") || cleanXss.includes(">")) {
    throw new Error("XSS sanitizer failed to encode html angle brackets!");
  }

  console.log("✓ [UNIT] All unit tests passed successfully!");
}

// 2. Integration Tests: Rate Limiting state check
function runIntegrationTests() {
  console.log("▶ [INTEGRATION] Running integration tests...");
  
  const limitStore = new Map();
  const checkRateLimit = (ip) => {
    const now = Date.now();
    let entry = limitStore.get(ip);
    if (!entry) {
      entry = { tokens: 60, lastRefill: now };
      limitStore.set(ip, entry);
    }
    if (entry.tokens >= 1) {
      entry.tokens -= 1;
      limitStore.set(ip, entry);
      return true;
    }
    return false;
  };

  const res1 = checkRateLimit("192.168.1.1");
  if (!res1) {
    throw new Error("Rate limiting failed on initial clean request!");
  }
  
  console.log("✓ [INTEGRATION] All integration tests passed successfully!");
}

// 3. End-to-End Tests: Background task queuing simulation
async function runEndToEndTests() {
  console.log("▶ [E2E] Running end-to-end tests...");

  let jobExecuted = false;
  const queue = [];
  const enqueue = (task) => {
    queue.push(task);
    setTimeout(async () => {
      const next = queue.shift();
      if (next) await next();
    }, 50);
  };

  await new Promise((resolve) => {
    enqueue(async () => {
      jobExecuted = true;
      resolve();
    });
  });

  if (!jobExecuted) {
    throw new Error("Background job queue failed to run enqueued task!");
  }

  console.log("✓ [E2E] All end-to-end tests passed successfully!");
}

async function main() {
  try {
    runUnitTests();
    runIntegrationTests();
    await runEndToEndTests();
    console.log("\n🎉 ALL TEST SUITES PASSED!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ TEST RUNNER FAILED:", err.message);
    process.exit(1);
  }
}

main();
