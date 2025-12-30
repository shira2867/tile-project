import * as userService from "../services/userService.js";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.js";
import { createUserSchema } from "../schemas/user.zod.js";


export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUser();
    console.log("Found users count:", users.length);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const validatedData = createUserSchema.parse(req.body);

    const newUser = await userService.createUser(validatedData);
    console.log("user created in DB:", newUser);

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function updateUserRole(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }
    const updatedUser = await userService.updateUser(userId, { role });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User role updated:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating role" });
  }
}



export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await userService.loginUser(email, password);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login successful",
      ...result
    });

  } catch (error: any) {
    const errorMessage = error.message || "Internal Server Error";
    const statusCode = (errorMessage === "User not found" || errorMessage === "Invalid password")
      ? 401
      : 500;

    return res.status(statusCode).json({ message: errorMessage });
  }
}