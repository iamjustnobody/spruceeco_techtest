import app from "./app.js";
import dotenv from "dotenv";
// import "dotenv/config";
import fs from "fs";

// dotenv.config(); // loads from .env into process.env

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

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
