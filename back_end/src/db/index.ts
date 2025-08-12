import { Pool } from "pg";

// Set up Postgres connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
// export const query = (text: string, params?: any[]) => {
//   return pool.query(text, params);
// };
