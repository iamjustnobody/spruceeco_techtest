import express from "express";
import { postMatch, getPlayerStats } from "../controllers/matchController.js";

const router = express.Router();

router.post("/match", postMatch);
// router.get("/:username/stats", getPlayerStats);

export default router;
