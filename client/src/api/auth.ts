import type { LoginData } from "../types/user.types";
import type { SignUpData } from "../types/user.types";
import { axiosInstance } from './manager.service';




export const signUpUser = async (data: SignUpData) => {
  const res = await axiosInstance.post(`auth/signUp`, data);
  return res.data;
};
export const loginUser = async (data: LoginData) => {
  const res = await axiosInstance.post(`auth/login`, data,
   );
  return res.data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(`auth/me`
)
  return data
}

export const logout = async () => {
  try {
    const { data } = await axiosInstance.get(`auth/logout`
    );
    console.log(data.message); 
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

