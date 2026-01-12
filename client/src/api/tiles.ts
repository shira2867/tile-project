
import type { Tile, CreateTile } from '../types/tile.type';
import { axiosInstance } from './manager.service';

export const getAllTiles = async (): Promise<Tile[]> => {
  const res = await axiosInstance.get('/tiles/getAllTiles');
  return res.data;
};

export const createTile = async (data: CreateTile) => {
  const res = await axiosInstance.post('/tiles/createTile', data);
  return res.data;
};

export const updateTileColor = async (
  tileId: string,
  newColor: string
): Promise<Tile> => {
  const res = await axiosInstance.put(
    `/tiles/updateTile/${tileId}`,
    { color: newColor }
  );
  return res.data;
};

export const deleteTile = async (tileId: string) => {
  const res = await axiosInstance.delete(`/tiles/deleteTile/${tileId}`);
  return res.data;
};

export const getColors = async (): Promise<string[]> => {
  const res = await axiosInstance.get('/tiles/colors');
  return res.data;
};

