import { z } from "zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .regex(
      passwordRegex,
      "הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד"
    ),
  role: z.enum(["viewer", "editor", "moderator", "admin"]).optional(),
});

const allowedrole =  ["viewer", "editor", "moderator", "admin"] ;

export const RoleSchema = z.object({
  role: z.enum(allowedrole), 
});
