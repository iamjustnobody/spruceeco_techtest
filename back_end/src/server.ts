import app from "./app.js";
import dotenv from "dotenv";
// import "dotenv/config";

dotenv.config(); // loads from .env into process.env

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
