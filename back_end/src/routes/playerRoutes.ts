import {
  getPlayerStatsHandler,
  savePlayerHandler,
} from "../controllers/playerController.js";
import express from "express";

const router = express.Router();
router.get("/stats/:username", getPlayerStatsHandler);
router.post("/player", savePlayerHandler);

export default router;
