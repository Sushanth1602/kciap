import { validateEnv } from "@/backend/src/utils/envValidate";
import { sanitizeSql, sanitizeXss } from "@/backend/src/utils/sanitize";

export async function runUnitTests() {
  console.log("▶ [UNIT] Running unit tests...");

  // 1. Test Sanitizers
  const dirtySql = "SELECT * FROM users WHERE email = 'test@example.com' OR '1'='1'";
  const cleanSql = sanitizeSql(dirtySql);
  if (!cleanSql.includes("\\'")) {
    throw new Error("Sql injection sanitizer failed to escape quotes!");
  }

  const dirtyXss = "<script>alert('xss')</script>";
  const cleanXss = sanitizeXss(dirtyXss);
  if (cleanXss.includes("<") || cleanXss.includes(">")) {
    throw new Error("XSS sanitizer failed to encode html angle brackets!");
  }

  // 2. Test Env Validation (expect it to validate successfully or raise matching errors)
  try {
    validateEnv();
  } catch (err: any) {
    if (!err.message.includes("Missing required environment variables")) {
      throw err;
    }
  }

  console.log("✓ [UNIT] All unit tests passed successfully!");
}
