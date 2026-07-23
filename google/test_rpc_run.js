const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hkapkrwnlhyvmfglshtn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrYXBrcndubGh5dm1mZ2xzaHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MTQ0MTMsImV4cCI6MjA5ODQ5MDQxM30.OumcG2zGzfQfdEEkjjpHtvG-cqqD4IX17h-EdjgYigI";

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const helpers = ["run_sql", "execute_sql", "query_sql", "sql", "exec_sql"];
  for (const helper of helpers) {
    try {
      const { data, error } = await supabase.rpc(helper, {
        sql: "SELECT 1;",
        query: "SELECT 1;",
        sql_query: "SELECT 1;"
      });
      console.log(`${helper} result:`, { data, error });
    } catch (e) {
      console.log(`${helper} catch:`, e.message);
    }
  }
}
run();
