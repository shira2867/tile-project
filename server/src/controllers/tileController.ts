import * as tileService from "../services/tileService.js"; 
import type { Request, Response } from "express";

export async function getTiles(req: Request, res: Response) {
  try {
    const tiles = await tileService.getAllTiles();
    console.log("Tiles from DB:", tiles);
    res.json(tiles);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function createTiles(req: Request, res: Response) {
  try {
    const { color } = req.body;
    
    const newTile = await tileService.createTile({ color });
    
    console.log("Tile created in DB:", newTile);
    
    res.status(201).json(newTile); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
