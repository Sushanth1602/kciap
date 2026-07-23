const { Client } = require("pg");

const gcpRegions = [
  "us-central1", "us-east1", "us-east4", "us-west1", "us-west2",
  "europe-west1", "europe-west2", "europe-west3", "europe-west4", "europe-west6", "europe-west9",
  "asia-east1", "asia-east2", "asia-northeast1", "asia-northeast2", "asia-northeast3",
  "asia-southeast1", "asia-southeast2", "asia-south1", "asia-south2",
  "australia-southeast1", "australia-southeast2",
  "southamerica-east1", "northamerica-northeast1"
];

async function scan() {
  for (const region of gcpRegions) {
    const host = `gcp-0-${region}.pooler.supabase.com`;
    
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
        console.log(`FOUND GCP POOLER: ${host}:${port}`);
        await client.end();
        return;
      } catch (err) {
        const msg = err.message;
        if (!msg.includes("ENOTFOUND") && !msg.includes("timeout") && !msg.includes("tenant/user") && !msg.includes("not found")) {
          console.log(`GCP INTERESTING: ${host}:${port} -> ${msg}`);
        }
      }
    }
  }
  console.log("Scan finished.");
}

scan();
