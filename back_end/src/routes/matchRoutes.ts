import express from "express";
import { postMatch } from "../controllers/matchController.js";

const router = express.Router();

router.post("/match", postMatch);

export default router;
