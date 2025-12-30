import { User } from "../models/user.js"; 
import type { IUser} from "../models/user.js"; 

export async function getAllUser(): Promise<IUser[]> {
 const users=await User.find();
 console.log(users)
  return users;
}

export async function getTileById(id: string): Promise<IUser | null> {
  return await User.findById(id);
}

export async function createUser(data: { name: string,email:string,password:string,role:string }): Promise<IUser> {
  const user = new User(data);
  return await user.save();
}

export async function updateUser(id: string, data: { role: string }): Promise<IUser | null> {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

