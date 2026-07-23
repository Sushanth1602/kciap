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
    
    for (const port of [5432, 6543]) {
      for (const user of ["postgres.hkapkrwnlhyvmfglshtn", "postgres"]) {
        const client = new Client({
          host,
          port,
          database: "postgres",
          user,
          password: "Password123",
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 5000
        });

        try {
          await client.connect();
          console.log(`SUCCESS! Connected to ${host}:${port} as ${user}`);
          await client.end();
          return;
        } catch (err) {
          const msg = err.message;
          if (!msg.includes("ENOTFOUND") && !msg.includes("timeout expired") && !msg.includes("ECONNREFUSED") && !msg.includes("tenant/user") && !msg.includes("not found")) {
            console.log(`INTERESTING: ${host}:${port} as ${user} -> ${msg}`);
          }
        }
      }
    }
  }
  console.log("Scan finished.");
}

scan();
