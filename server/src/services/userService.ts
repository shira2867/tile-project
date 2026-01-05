import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from "zod";

import { User } from "../models/user.js"; 
import type { IUser} from "../models/user.js"; 
import { createUserSchema } from "../schemas/user.zod.js";
export type CreateUserInput = z.infer<typeof createUserSchema>;

export async function getAllUser(): Promise<IUser[]> {
 const users=await User.find();
 console.log(users)
  return users;
}


export async function getUserByEmail(email:string): Promise<IUser[]> {
 const user = await User.find({ email: email }); 
  return user;
}



export async function getUserByRole(role:string): Promise<IUser[]> {
 const users = await User.find({ role: role }); 
  console.log(`Found ${users.length} users with role: ${role}`);
  return users;
}



export async function updateUser(id: string, data: { role: string }): Promise<IUser | null> {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

export async function createUser(userData: CreateUserInput) {
    const salt = await bcrypt.genSalt(10);
    
    userData.password = await bcrypt.hash(userData.password, salt);
    
    const user = new User(userData);
    return await user.save();
}


export async function loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '1d' } 
    );

    return { 
        token, 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    };
}