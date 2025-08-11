// import db from "../db/index.js";
// import db from "@/db/index.js";
import db from "src/db/index.js";

export function sayHello() {
  return "Hello from utils!";
}
const playerX = db.prepare(`SELECT id FROM player WHERE username = ?`);
