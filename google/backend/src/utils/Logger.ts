import { supabase } from "./supabase";

export class Logger {
  /**
   * Log info message
   */
  public static info(message: string, context?: any) {
    console.log(`[INFO] [${new Date().toISOString()}]: ${message}`, context ? JSON.stringify(context) : "");
  }

  /**
   * Log warning message
   */
  public static warn(message: string, context?: any) {
    console.warn(`[WARN] [${new Date().toISOString()}]: ${message}`, context ? JSON.stringify(context) : "");
  }

  public static async error(message: string, error?: any, projectId?: string) {
    const errorDetails = error ? error.message || String(error) : "N/A";
    console.error(`[ERROR] [${new Date().toISOString()}]: ${message} - Details: ${errorDetails}`);

    // Persist audit trail log inside artifacts fallback if DB project exists
    if (projectId) {
      try {
        const payload = {
          event: "ERROR_TRACK",
          message,
          error: errorDetails,
          timestamp: new Date().toISOString()
        };

        const { data: existing } = await supabase
          .from("artifacts")
          .select("id")
          .eq("project_id", projectId)
          .eq("filename", "audit_log.json")
          .limit(1);

        if (existing && existing.length > 0) {
          await supabase
            .from("artifacts")
            .update({ content: JSON.stringify(payload), created_at: new Date().toISOString() })
            .eq("id", existing[0].id);
        } else {
          await supabase.from("artifacts").insert([
            {
              project_id: projectId,
              type: "audit",
              filename: "audit_log.json",
              content: JSON.stringify(payload),
              created_at: new Date().toISOString()
            }
          ]);
        }
      } catch (dbErr) {
        console.error("Logger failed to write audit logs to database:", dbErr);
      }
    }
  }
}

export const ProductionLogger = Logger;
