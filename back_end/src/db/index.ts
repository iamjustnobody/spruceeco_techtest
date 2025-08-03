import Database from "better-sqlite3";
import type { Database as BetterSqliteDatabase } from "better-sqlite3";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const db: BetterSqliteDatabase = new Database("game.db");
// const dbPath = path.join("/tmp", "game.db");
// const dbPath = process.env.RENDER
//   ? path.join("/app/data", "game.db") // Render's persistent disk mount
//   : path.join("/tmp", "game.db"); // Local development path
// const dbPath = process.env.SQLITE_DB_PATH || path.join("/tmp", "game.db");
// const dbPath =
//   process.env.SQLITE_DB_PATH ||
//   (process.env.RENDER ? "/app/data/game.db" : "/tmp/game.db");
const dbPath = process.env.RENDER
  ? "/app/data/game.db"
  : process.env.SQLITE_DB_PATH || "/tmp/game.db";

const db: BetterSqliteDatabase = new Database(dbPath);
db.exec("PRAGMA foreign_keys = ON;");

// Load schema (optional, or run from CLI once)
// db.exec(require("fs").readFileSync("./schema.sql", "utf-8"));
// db.exec(fs.readFileSync("./schema.sql", "utf-8"));
const schema = fs.readFileSync(
  path.resolve(__dirname, "../../src/db/schema.sql"),
  "utf-8"
);
const seed = fs.readFileSync(
  path.resolve(__dirname, "../../src/db/seed.sql"),
  "utf-8"
);

db.exec(schema);
db.exec(seed);

export default db;
