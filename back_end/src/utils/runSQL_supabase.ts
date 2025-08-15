import type { DatabaseType } from "@/models/index.js";
import { pool, supabase } from "@/server.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Pool } from "pg";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!;
export async function fetchSupabaseSQL(sql: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    throw new Error(`Error running SQL: ${await res.text()}`);
  }
}

export async function runSQL({
  useSupabase = false,
  database = undefined,
  sql,
}: {
  useSupabase?: boolean;
  database?: DatabaseType;
  sql: string;
}) {
  const shouldUseSupabase = !(
    useSupabase === false ||
    (useSupabase === undefined && process.env.USESUPABASE !== "true")
  ); //useSupabase || process.env.USESUPABASE === "true";

  try {
    if (!shouldUseSupabase) {
      // pg
      console.log("🔄 Running SQL on pg database...");
      if (database instanceof Pool) {
        await database.query(sql);
      } else await pool.query(sql); //throw new Error("Expected a pg Pool instance when useSupabase=false");
    } else {
      // useSupabase true overrides process.env.USESUPABASE
      // Supabase
      console.log("🔄 Running SQL on Supabase database...");
      if (!database || typeof (database as any).rpc !== "function") {
        // throw new Error("Expected a SupabaseClient instance when useSupabase=true");
        await supabase.rpc("exec_sql", { sql }); //ok
        // await fetchSupabaseSQL(sql); //ok
      } else
        await (database as SupabaseClient<any, "public", any>).rpc("exec_sql", {
          sql,
        });
    }
    console.log("✅ SQL executed successfully");
  } catch (err) {
    console.error("❌ Error executing SQL:", err);
  }
}
