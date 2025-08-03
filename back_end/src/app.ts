import express from "express";
import matchRoutes from "./routes/matchRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";

const app = express();

app.use(express.json());
// app.use("/api", matchRoutes);

app.use("/api/matches", matchRoutes);
app.use("/api/players", playerRoutes);

export default app;
