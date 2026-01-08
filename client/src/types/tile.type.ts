
export type Tile ={
  _id: string;
  color: string;
  createdAt: Date;
  toDelete?:boolean;
}

export type CreateTile = {
  color: string;
  
};