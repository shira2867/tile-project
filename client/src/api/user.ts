import type { User } from "../types/user.types";
import { axiosInstance } from './manager.service';



export const getAllUser = async ():Promise<User[]> => {
    const res = await axiosInstance.get(`users/getAllUser`
    );
    return res.data;
};
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const res = await axiosInstance.get(`users/getUserByRole/${role}`
);
  return res.data;
};

export const getUsersByEmail = async (email: string): Promise<User[]> => {
  const res = await axiosInstance.get(`users/getUserByEmail`, {
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
