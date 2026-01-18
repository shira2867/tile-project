import { Schema, model,Document } from "mongoose";
export interface IUser extends Document {
  name: string;
  email:string;
  password:string;
  role:string;
}
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
      type: String,
      enum: ["viewer", "editor", "moderator", "admin"],
      default: "viewer",
    },});

export const User = model("User", userSchema);



export interface MyUserPayload {
  _id: string;
  name:string;
  role: 'admin' | 'moderator' | 'editor' | 'viewer';
  email: string;
}