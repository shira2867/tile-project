import { TileSchema } from "../schemas/tile.zod.js";
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
    
        const color = TileSchema.parse(req.body);
    
    
    const newTile = await tileService.createTile( color );
    
    console.log("Tile created in DB:", newTile);
    
    res.status(201).json(newTile); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}



export async function updateTileColor(req: Request, res: Response) {
  try {
    const { tileId } = req.params; 
        const color = TileSchema.parse(req.body);
    
    if (!color) {
       return res.status(400).json({ error: "color is required" });
    }
    const updatedtile = await tileService.updateTile(tileId, color );
    if (!updatedtile) {
      return res.status(404).json({ error: "tile not found" });
    }

    console.log("tile color updated:", updatedtile);
    res.status(200).json(updatedtile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating color" });
  }
}


export async function deleteTile(req: Request, res: Response) {
  try {
    const { tileId } = req.params; 
    
    const deletedtile = await tileService.deleteTile(tileId);
    if (!deletedtile) {
      return res.status(404).json({ error: "tile not found" });
    }

    console.log("tile delete:", deletedtile);
    res.status(200).json(deletedtile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error delete tile" });
  }
}


export const getColorEnum = (req: Request, res: Response) => {
  try {
    const colors = tileService.getColorEnum();
    res.json(colors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching colors" });
  }
};