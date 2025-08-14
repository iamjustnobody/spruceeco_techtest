import dotenv from "dotenv";
// import "dotenv/config";

// dotenv.config(); // loads from .env into process.env

import fs from "fs";

const env = process.env.NODE_ENV || "development";
const baseEnvPath = ".env";
const envPath = `.env.${env}`;
const localEnvPath = ".env.local";

if (fs.existsSync(baseEnvPath)) {
  dotenv.config({ path: baseEnvPath });
  console.log("Loaded .env");
}

// if (fs.existsSync(envPath)) {
//   dotenv.config({ path: envPath });
//   console.log(`Loaded ${envPath}`);
// }

// if (fs.existsSync(localEnvPath)) {
//   dotenv.config({ path: localEnvPath });
//   console.log("Loaded .env.local");
// }

import { Pool } from "pg";

// Set up Postgres connection pool
console.log(
  "🔄 Initializing database connection pool...",
  process.env.DATABASE_URL
);
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const PORT = process.env.PORT || 4000;

import app from "./app.js";
import { bootstrap } from "./db/bootstrap.js";
// import pool from "./db/index.js";

// await bootstrap();
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

async function startServer() {
  await bootstrap();

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
