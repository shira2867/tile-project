import * as userService from "../services/userService.js"; 
import type { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.getAllUser();
    console.log("Found users count:", users.length);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const {  name,email,password,role } = req.body;
    
    const newUser = await userService.createUser({ name,email,password,role });
    
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