import { pool } from "@/server.js";
import fsSync from "fs";
import fs_promises from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
// import pool from "./index.js";

export async function seedDatabase() {
  try {
    const sql = await fs_promises.readFile(
      path.join(process.cwd(), "src/db/seed.sql"),
      "utf8"
    );
    await pool.query(sql);
    console.log("✅ Database seeded");
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
  } finally {
    await pool.end();
  }
}
// seedDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  try {
    console.log(
      "🔄 Checking if database is initialized...",
      process.env.DATABASE_URL,
      typeof process.env.DATABASE_URL
    );

    const schemaPath = path.join(__dirname, "schema.sql");
    const seedPath = path.join(__dirname, "seed.sql");

    // Check if players table exists
    const res = await pool.query(`
      SELECT to_regclass('public.players') AS exists;
    `);

    if (!res.rows[0].exists) {
      console.log("📦 Seeding database from seed.sql...");
      //   const __filename = fileURLToPath(import.meta.url);
      //   const __dirname = path.dirname(__filename);
      //   const seedPath = path.join(__dirname, "../db/seed.sql");
      //   const seedSQL = await fs_promises.readFile(seedPath, "utf8");
      //   await pool.query(seedSQL);

      //   if (!fsSync.existsSync(seedPath)) {
      //     throw new Error(`Seed file not found: ${seedPath}`);
      //   }
      //   const seedSQL = fsSync.readFileSync(seedPath, "utf8");

      console.log("📦 Running schema.sql...");
      const schemaSQL = await fs_promises.readFile(schemaPath, "utf8");
      await pool.query(schemaSQL);
      console.log("✅ Schema created");

      console.log("📦 Running seed.sql...");
      const seedSQL = await fs_promises.readFile(seedPath, "utf8");
      await pool.query(seedSQL);
      console.log("✅ Database seeded");
    } else {
      console.log("✅ Database already initialized — skipping seed");
    }
  } catch (err) {
    console.error("❌ Error bootstrapping DB:", err);
  }
}

export { bootstrap };
