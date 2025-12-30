import { Tile } from "../models/tile.js"; 
import type { ITile } from "../models/tile.js"; 

export async function getAllTiles(): Promise<ITile[]> {
 const tiles=await Tile.find();
 console.log(tiles)
  return tiles;
}

export async function getTileById(id: string): Promise<ITile | null> {
  return await Tile.findById(id);
}

export async function createTile(data: { color: string }): Promise<ITile> {
  const tile = new Tile(data);
  return await tile.save();
}

export async function updateTile(id: string, data: { color: string }): Promise<ITile | null> {
  return await Tile.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteTile(id: string): Promise<ITile | null> {
  return await Tile.findByIdAndDelete(id);
}