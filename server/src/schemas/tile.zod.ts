import { z } from "zod";

const allowedColors =  ["#E98652", "#F9D5A7", "#FFB085","#FEF1E6"] ;

export const TileSchema = z.object({
  color: z.enum(allowedColors), 
});
