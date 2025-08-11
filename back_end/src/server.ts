import app from "./app.js";
import dotenv from "dotenv";
// import "dotenv/config";
import fs from "fs";

// dotenv.config(); // loads from .env into process.env
// dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
const env = process.env.NODE_ENV || "development";
const envFile = `.env.${env}`;

// Load the base .env first (if exists)
if (fs.existsSync(".env")) {
  dotenv.config();
  console.log("Loaded .env");
}

// Override with environment-specific .env file if it exists
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`Loaded ${envFile}`);
}

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
