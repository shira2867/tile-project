import * as userService from "../services/userService.js";
import type { Request, Response } from "express";
import type { IUser } from "../models/user.js";
import { createUserSchema, RoleSchema } from "../schemas/user.zod.js";
import { email } from "zod";
interface MyUserPayload {
  _id: string;
  name:string;
  role: 'admin' | 'moderator' | 'editor' | 'viewer';
  email: string;
}
export interface AuthRequest extends Request {
  user?: MyUserPayload;
}

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUser();
    console.log("Found users count:", users.length);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
export async function getUsersByRole(req: Request, res: Response) {
  try {

    const { role } = req.params;

    if (!role) {
      return res.status(400).json({ error: "Role parameter is missing" });
    }

    const users = await userService.getUserByRole(role);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function getUsersByEmail(req: Request, res: Response) {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "email parameter is missing" });

    const users = await userService.getUserByEmail(email);
    if (!users || users.length === 0) return res.status(404).json({ error: "User not found" });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function getUsersById(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "id parameter is missing" });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}



export async function updateUserRole(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const role = RoleSchema.parse(req.body);

    if (!role) {
      console.log('Role is required')

      return res.status(400).json({ error: "Role is required" });
    }
    const updatedUser = await userService.updateUser(userId, role);
    if (!updatedUser) {
      console.log('User not found')
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User role updated:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating role" });
  }
}


export async function register(req: Request, res: Response) {
  try {
    const validatedData = createUserSchema.parse(req.body);
    console.log("validatedData", validatedData)
    const existingUser = await userService.getUserByEmail(validatedData.email);
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already in use. Please go to login."
      });
    }

    const newUser = await userService.createUser(validatedData);
    console.log("user created in DB:", newUser);

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}



export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await userService.loginUser(email, password);
    console.log('token', result.token)
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 * 12,
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


export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};



export async function getCurrentUser(req: AuthRequest, res: Response) {
  if (!req.user) return res.status(401).send();

  res.status(200).json({
    success: true,
    data: {
      _id: req.user._id,
      name:req.user.name,
      role: req.user.role,
      email: req.user.email

    }
  });
};