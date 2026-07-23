const { Client } = require("pg");

const regions = [
  "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "ap-east-1", "ap-south-1", "ap-south-2", "ap-northeast-1", "ap-northeast-2", "ap-northeast-3",
  "ap-southeast-1", "ap-southeast-2", "ap-southeast-3",
  "ca-central-1", "eu-central-1", "eu-central-2", "eu-west-1", "eu-west-2", "eu-west-3",
  "eu-north-1", "eu-south-1", "eu-south-2", "me-central-1", "me-south-1",
  "sa-east-1", "af-south-1"
];

async function scan() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    
    const client = new Client({
      host,
      port: 6543,
      database: "postgres",
      user: "postgres.hkapkrwnlhyvmfglshtn",
      password: "test",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 2000
    });

    try {
      await client.connect();
    } catch (err) {
      const msg = err.message;
      if (msg.includes("ENOTFOUND") || msg.includes("ETIMEDOUT") || msg.includes("ECONNREFUSED")) {
        // ignore
      } else if (msg.includes("tenant/user") && msg.includes("not found")) {
        // ignore
      } else {
        console.log(`FOUND REGION: ${region} (${host})`);
        console.log(`Connection error (tenant exists!): ${msg}`);
        await client.end();
        return;
      }
    }
  }
  console.log("Scan finished. No region found.");
}

scan();
