import type { Request, Response } from "express";
import { saveMatch } from "../services/matchService.js";

export const postMatch = (req: Request, res: Response) => {
  const { player_x, player_o, board_size, win_condition, winner } = req.body;

  if (!player_x || !player_o || !board_size || !win_condition) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const match = saveMatch({
    player_x,
    player_o,
    board_size,
    win_condition,
    winner,
  });
  res.status(201).json(match);
};
