const { Client } = require("pg");

const flyRegions = [
  "sjc", "ams", "sin", "lax", "ord", "lhr", "fra", "hkg", "syd", "cdg", "iad", "gru"
];

async function scan() {
  for (const region of flyRegions) {
    const host = `fly-0-${region}.pooler.supabase.com`;
    
    for (const port of [5432, 6543]) {
      const client = new Client({
        host,
        port,
        database: "postgres",
        user: "postgres.hkapkrwnlhyvmfglshtn",
        password: "Password123",
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 2000
      });

      try {
        await client.connect();
        console.log(`FOUND FLY POOLER: ${host}:${port}`);
        await client.end();
        return;
      } catch (err) {
        const msg = err.message;
        if (!msg.includes("ENOTFOUND") && !msg.includes("timeout") && !msg.includes("tenant/user") && !msg.includes("not found")) {
          console.log(`FLY INTERESTING: ${host}:${port} -> ${msg}`);
        }
      }
    }
  }
  console.log("Scan finished.");
}

scan();
