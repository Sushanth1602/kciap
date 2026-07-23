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
    console.log("Scanning region:", region);
    
    const client = new Client({
      host,
      port: 6543,
      database: "postgres",
      user: "postgres",
      password: "Password123",
      ssl: {
        rejectUnauthorized: false,
        servername: "db.hkapkrwnlhyvmfglshtn.supabase.co"
      },
      connectionTimeoutMillis: 2000
    });

    try {
      await client.connect();
      console.log(`SUCCESS! Connected to ${region} pooler using SNI!`);
      await client.end();
      return;
    } catch (err) {
      console.log(`Region ${region} failed: ${err.message}`);
    }
  }
}

scan();
