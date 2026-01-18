export const colors = {
  color1: "#E98652",
  color2: "#F9D5A7",
  color3: "#FFB085",
  color4: "#FEF1E6",

} as const;

export type Color = typeof colors[keyof typeof colors];
export const colorOptions = Object.values(colors);
export type Tile ={
  _id: string;
  color: Color;
  createdAt: Date;
}

export type CreateTile = {
  color: Color;
  
};