export function validateEnv() {
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ];

  const warnings = [
    "GEMINI_API_KEY",
    "GITHUB_PAT",
    "VERCEL_TOKEN"
  ];

  const missingRequired = required.filter(key => !process.env[key]);
  if (missingRequired.length > 0) {
    throw new Error(`CRITICAL: Missing required environment variables: ${missingRequired.join(", ")}`);
  }

  const missingWarnings = warnings.filter(key => !process.env[key]);
  if (missingWarnings.length > 0) {
    console.warn(`[WARN] Missing optional production variables: ${missingWarnings.join(", ")}. Fallbacks will be engaged.`);
  }

  return true;
}
