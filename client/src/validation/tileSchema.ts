import { z } from "zod";

export const tileSchema = z.object({
_id:z.string(),
  color: z.enum(["#E98652", "#F9D5A7", "#FFB085","#FEF1E6"]), 

});

export const tilesSchema = z.array(tileSchema);