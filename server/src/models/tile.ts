import { Schema, model, Document } from "mongoose";
import { boolean } from "zod";

export interface ITile extends Document {
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const tileSchema = new Schema<ITile>({
  color: {
    type: String,
    enum: ["#E98652", "#F9D5A7", "#FFB085","#FEF1E6"],
    default: "#FEF1E6",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});

export const Tile = model<ITile>("Tile", tileSchema);