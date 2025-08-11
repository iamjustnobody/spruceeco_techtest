// import db from "./db/index.js";
// import db from "@/db/index.js";
import db from "src/db/index.js";
// import { sayHello } from "./utils/hello.js";
// import { sayHello } from "src/utils/hello.js";
import { sayHello } from "@utils/hello.js";

console.log(sayHello());
const playerX = db.prepare(`SELECT id FROM player WHERE username = ?`);
