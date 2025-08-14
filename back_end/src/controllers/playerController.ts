import type { Request, Response } from "express";
import {
  getPlayerStatsService,
  savePlayer,
} from "../services/playerService.js";

export function getPlayerStatsHandler(req: Request, res: Response) {
  const { username } = req.params;
  const boardSize = req.query.board_size
    ? parseInt(req.query.board_size as string, 10)
    : undefined;
  const winCondition = req.query.win_condition
    ? parseInt(req.query.win_condition as string, 10)
    : undefined;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  // const stats = getStats(username, boardSize, winCondition);
  const stats = getPlayerStatsService(username, req.query);
  if (!stats) {
    return res.status(404).json({ error: `Player '${username}' not found` });
  }

  res.json(stats);
}

export function savePlayerHandler(req: Request, res: Response) {
  const { username } = req.body;

  if (!username || typeof username !== "string") {
    return res
      .status(400)
      .json({ error: "Username is required and must be a string" });
  }

  try {
    const player = savePlayer(username);
    res.status(201).json(player);
  } catch (err: any) {
    console.error("Error saving player:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
