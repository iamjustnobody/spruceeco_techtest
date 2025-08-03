import { getPlayerStatsHandler } from "../controllers/playerController.js";
import express from "express";

const router = express.Router();
router.get("/stats/:username", getPlayerStatsHandler);

export default router;
