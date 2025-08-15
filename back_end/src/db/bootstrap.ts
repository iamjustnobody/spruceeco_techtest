import type { DatabaseType, MatchDB, PlayerDB } from "@/models/index.js";
import { pool, supabase } from "@/server.js";
import { runSQL } from "@/utils/runSQL_supabase.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import fsSync from "fs";
import fs_promises from "fs/promises";
import path from "path";
import { Pool } from "pg";
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
// const schemaPath = path.join(process.cwd(), "src/db/schema.sql");
// const seedPath = path.join(process.cwd(), "src/db/seed.sql");
const schemaPath = path.join(__dirname, "schema.sql"); //ok
const seedPath = path.join(__dirname, "seed.sql"); //ok
// const schemaPath = path.join(
//   new URL(".", import.meta.url).pathname,
//   "../db/schema.sql"
// );
// const seedPath = path.join(
//   new URL(".", import.meta.url).pathname,
//   "../db/seed.sql"
// );

async function bootstrap_native({
  useSupabase = false,
  database,
}: {
  useSupabase?: boolean;
  database?: DatabaseType;
} = {}) {
  try {
    console.log("🔄 Checking if database is initialized...");

    // const schemaPath = path.join(__dirname, "schema.sql");
    // const seedPath = path.join(__dirname, "seed.sql");

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
      await runSQL({
        useSupabase,
        ...(database !== undefined ? { database } : {}),
        sql: schemaSQL,
      });
      console.log("✅ Schema created");

      console.log("📦 Running seed.sql...");
      const seedSQL = await fs_promises.readFile(seedPath, "utf8");
      await runSQL({
        useSupabase,
        ...(database !== undefined ? { database } : {}),
        sql: seedSQL,
      });
      console.log("✅ Database seeded");
    } else {
      console.log("✅ Database already initialized — skipping seed");
    }

    await pool.end();
    console.log("✅ Native DB bootstrap complete");
  } catch (err) {
    console.error("❌ Error bootstrapping DB:", err);
    process.exit(1);
  }
}

export { bootstrap_native };

export async function bootstrap_pg() {
  try {
    console.log("🔄 Bootstrapping PostgreSQL DB...");

    // 1️⃣ Ensure unique constraint for usernames
    await pool.query(`
      ALTER TABLE players
      ADD CONSTRAINT IF NOT EXISTS unique_username UNIQUE (username);
    `);

    // 2️⃣ Upsert players
    const players: Omit<PlayerDB, "id">[] = [
      { username: "alice" },
      { username: "bob" },
      { username: "charlie" },
    ];

    for (const p of players) {
      await pool.query(
        `
        INSERT INTO players (username)
        VALUES ($1)
        ON CONFLICT (username) DO NOTHING;
      `,
        [p.username]
      );
    }

    // 3️⃣ Fetch player IDs
    const { rows: playerRows } = await pool.query<PlayerDB>(
      `SELECT id, username FROM players WHERE username = ANY($1)`,
      [players.map((p) => p.username)]
    );

    const playerMap: Record<string, string> = {};
    playerRows.forEach((p) => {
      if (typeof p.id === "string") {
        playerMap[p.username] = p.id;
      }
    });

    // Ensure all required players exist in playerMap
    const requiredPlayers = ["alice", "bob", "charlie"];
    for (const name of requiredPlayers) {
      if (!playerMap[name]) {
        throw new Error(`Player '${name}' not found in database.`);
      }
    }

    // 4️⃣ Upsert matches
    const matches: Omit<MatchDB, "id">[] = [
      {
        board_size: 3,
        win_condition: 3,
        player_x: playerMap["alice"]!,
        player_o: playerMap["bob"]!,
        winner: "X",
        played_at: "2025-08-01T10:00:00+00",
      },
      {
        board_size: 3,
        win_condition: 3,
        player_x: playerMap["bob"]!,
        player_o: playerMap["alice"]!,
        winner: "O",
        played_at: "2025-08-01T10:10:00+00",
      },
      {
        board_size: 3,
        win_condition: 3,
        player_x: playerMap["alice"]!,
        player_o: playerMap["charlie"]!,
        winner: null,
        played_at: "2025-08-01T10:15:00+00",
      },
    ];

    for (const m of matches) {
      await pool.query(
        `
        INSERT INTO matches (board_size, win_condition, player_x, player_o, winner, played_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (player_x, player_o, played_at) DO NOTHING;
      `,
        [
          m.board_size,
          m.win_condition,
          m.player_x,
          m.player_o,
          m.winner,
          m.played_at,
        ]
      );
    }

    console.log("✅ PostgreSQL DB bootstrapped successfully");
  } catch (err) {
    console.error("❌ Error bootstrapping PostgreSQL DB:", err);
  } finally {
    await pool.end();
  }
}

export async function bootstrap_supabase() {
  try {
    console.log("🔄 Bootstrapping Supabase DB...");

    // 1️⃣ Upsert players
    const players: PlayerDB[] = [
      { username: "alice" },
      { username: "bob" },
      { username: "charlie" },
    ];

    const { error: playersError } = await supabase
      .from("players")
      .upsert(players, { onConflict: "username" });

    if (playersError) throw playersError;

    // 2️⃣ Fetch player IDs
    const { data: playerRows, error: fetchError } = await supabase
      .from("players")
      .select("id, username")
      .in(
        "username",
        players.map((p) => p.username)
      ); //.throwOnError;

    if (fetchError || !playerRows) throw fetchError;

    const playerMap: Record<string, string> = {};
    playerRows.forEach((p) => {
      if (p.id) playerMap[p.username] = p.id;
    });

    // Ensure all required players exist in playerMap
    const requiredPlayers = ["alice", "bob", "charlie"];
    for (const name of requiredPlayers) {
      if (!playerMap[name]) {
        throw new Error(`Player '${name}' not found in database.`);
      }
    }

    // 3️⃣ Upsert matches
    const matches: MatchDB[] = [
      {
        board_size: 3,
        win_condition: 3,
        player_x: playerMap["alice"]!,
        player_o: playerMap["bob"]!,
        winner: "X",
        played_at: "2025-08-01T10:00:00+00",
      },
      {
        board_size: 3,
        win_condition: 3,
        player_x: playerMap["bob"]!,
        player_o: playerMap["alice"]!,
        winner: "O",
        played_at: "2025-08-01T10:10:00+00",
      },
      {
        board_size: 3,
        win_condition: 3,
        player_x: playerMap["alice"]!,
        player_o: playerMap["charlie"]!,
        winner: null,
        played_at: "2025-08-01T10:15:00+00",
      },
    ];

    const { error: matchesError } = await supabase
      .from("matches")
      .upsert(matches, { onConflict: "player_x,player_o,played_at" });

    if (matchesError) throw matchesError;

    console.log("✅ Supabase DB bootstrapped successfully");
  } catch (err) {
    console.error("❌ Error bootstrapping Supabase DB:", err);
  }
}
