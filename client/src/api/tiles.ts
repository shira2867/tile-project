import axios from "axios";
import type {Tile,CreateTile} from '../types/tile.type'
const BASE_URL = "http://localhost:3000/tiles";


export const getAllTiles = async ():Promise<Tile[]> => {
    const res = await axios.get(`${BASE_URL}/getAllTiles`, {
        withCredentials: true,
    });
    return res.data;
};
export const createTile = async (data: CreateTile) => {
  const res = await axios.post(`${BASE_URL}/createTile`, data,{
            withCredentials: true,

  });
  return res.data;
};
export const updateTileColor = async (tileId: string, newColor: string): Promise<Tile> => {

  const res = await axios.put(`${BASE_URL}/updateTile/${tileId}`, 
    { color: newColor }, 
    { withCredentials: true }
  );
  return res.data;
};

export const deleteTile = async (tileId: string)=> {
  const res = await axios.delete(`${BASE_URL}/deleteTile/${tileId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getColors = async ():Promise<string[]> => {
    const res = await axios.get(`${BASE_URL}/colors`, {
        withCredentials: true,
    });
    return res.data;
};


