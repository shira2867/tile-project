import { Schema, model, Document } from "mongoose";

export interface ITile extends Document {
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const tileSchema = new Schema<ITile>({
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Tile = model<ITile>("Tile", tileSchema);