import { z } from "zod";

export const userSchema = z.object({
    _id:z.string(),
     name: z.string().min(2, "Username too short"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin","viewer", "editor", "moderator"]), 
});

export const usersSchema = z.array(userSchema);
