import express from "express";
import matchRoutes from "./routes/matchRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // keep for local dev
      "https://spruceeco-techtest.vercel.app", // production frontend
      "https://spruceeco-techtest-iamjustnobodys-projects.vercel.app", // optional: preview builds
      "https://spruceeco-techtest-git-main-iamjustnobodys-projects.vercel.app/", // auto-generated deployment URLs for main branch
    ], // /\.vercel\.app$/, // any vercel.app subdomain
    methods: ["POST", "GET"], //['PUT', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
  })
);
app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);

export default app;
