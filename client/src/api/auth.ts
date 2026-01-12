import type { LoginData } from "../types/user.types";
import type { SignUpData } from "../types/user.types";
import { axiosInstance } from './manager.service';




export const signUpUser = async (data: SignUpData) => {
  const res = await axiosInstance.post(`users/signUp`, data);
  return res.data;
};
export const loginUser = async (data: LoginData) => {
  const res = await axiosInstance.post(`users/login`, data,
   );
  return res.data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(`users/me`
)
  return data
}

export const logout = async () => {
  try {
    const { data } = await axiosInstance.get(`users/logout`
    );
    console.log(data.message); 
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

