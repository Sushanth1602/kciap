/**
 * SQL Injection mitigation string escaper
 */
export function sanitizeSql(input: string): string {
  if (typeof input !== "string") return "";
  // Escape potential single quotes and backslashes
  return input.replace(/['\\]/g, "\\$&");
}

/**
 * XSS injection HTML tag encoder
 */
export function sanitizeXss(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
