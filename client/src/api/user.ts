import type { User } from "../types/user.types";
import { axiosInstance } from './manager.service';



export const getAllUser = async ():Promise<User[]> => {
    const res = await axiosInstance.get(`users`
    );
    return res.data;
};


export const getUsersByEmail = async (email: string): Promise<User[]> => {
  const res = await axiosInstance.get(`users/ByEmail`, {
    params: { email }, 
  });
  return res.data;
};


export const updateUserRole = async (userId: string, newRole: string): Promise<User> => {

  const res = await axiosInstance.put(`users/updateRole/${userId}`, 
    { role: newRole }, 
  );
  return res.data;
};
