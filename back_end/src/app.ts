import express from "express";
import matchRoutes from "./routes/matchRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
  })
);

app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);

export default app;
