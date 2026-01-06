import axios from "axios";
import type { User } from "../types/user.types";

const BASE_URL = "http://localhost:3000/users";


export const getAllUser = async ():Promise<User[]> => {
    const res = await axios.get(`${BASE_URL}/getAllUser`, {
        withCredentials: true,
    });
    return res.data;
};
export const getUsersByRole = async (role: string): Promise<User[]> => {
  const res = await axios.get(`${BASE_URL}/getUserByRole/${role}`, {
    withCredentials: true,
  });
  return res.data;
};

export const getUsersByEmail = async (email: string): Promise<User[]> => {
  const res = await axios.get(`${BASE_URL}/getUserByEmail`, {
    params: { email }, 
    withCredentials: true,
  });
  return res.data;
};


export const updateUserRole = async (userId: string, newRole: string): Promise<User> => {

  const res = await axios.put(`${BASE_URL}/updateRole/${userId}`, 
    { role: newRole }, 
    { withCredentials: true }
  );
  return res.data;
};
