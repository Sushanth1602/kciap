const { Client } = require("pg");

const host = "aws-0-us-east-1.pooler.supabase.com";
const user = "postgres.hkapkrwnlhyvmfglshtn";
const passwords = ["Password123", "postgres", "admin"];

async function run() {
  for (const password of passwords) {
    console.log("Testing password:", password);
    const client = new Client({
      host,
      port: 6543,
      database: "postgres",
      user,
      password: password,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log("Connected successfully to PostgreSQL pooler in us-east-1!");

      // Create generated_files table
      await client.query(`
        CREATE TABLE IF NOT EXISTS public.generated_files (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
          path TEXT NOT NULL,
          content TEXT NOT NULL,
          language TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `);
      console.log("Successfully created public.generated_files table!");
      await client.end();
      return;
    } catch (err) {
      console.log("Failed connection for password", password, ":", err.message);
    }
  }
  console.error("Could not connect to database with any password.");
}

run();
