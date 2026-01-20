export enum Color {
 color1= "#E98652",
  color2= "#F9D5A7",
  color3= "#FFB085",
  color4= "#FEF1E6",
}
export const colorOptions = Object.values(Color);
export type Tile ={
  _id: string;
  color: Color;
  createdAt: Date;
}

export type CreateTile = {
  color: Color;
  
};


