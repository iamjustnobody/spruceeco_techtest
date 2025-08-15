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

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`Loaded ${envPath}`);
}

if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath });
  console.log("Loaded .env.local");
}

import { Pool } from "pg";
console.log("🔄 Initializing database connection pool...");
export const pool = new Pool({
  connectionString:
    process.env.PG_USE_SUPABASE_DB_URL === "true"
      ? process.env.SUPABASE_DATABASE_URL!
      : process.env.NEON_DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
});

import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const PORT = process.env.PORT || 4000;

import app from "./app.js";
import { bootstrap_native } from "./db/bootstrap.js";
// import pool from "./db/index.js";

// await bootstrap_native();
// app.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });

async function startServer() {
  console.log("🔄 Bootstrapping database...", process.env.USESUPABASE);
  await bootstrap_native({
    useSupabase: process.env.USESUPABASE === "true",
    database: supabase,
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
