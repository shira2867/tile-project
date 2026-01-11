import axios from "axios";
import type { LoginData } from "../types/user.types";
import type { SignUpData ,MyUserPayload} from "../types/user.types";

const BASE_URL = "http://localhost:3000/users";



export const signUpUser = async (data: SignUpData) => {
  const res = await axios.post(`${BASE_URL}/signUp`, data);
  return res.data;
};
export const loginUser = async (data: LoginData) => {
  const res = await axios.post(`${BASE_URL}/login`, data,
    {   withCredentials: true,});
  return res.data;
};

export const getCurrentUser = async () => {
  const { data } = await axios.get(`${BASE_URL}/me`,{withCredentials: true}
)
  return data
}

export const logout = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/logout`, {
      withCredentials: true, 
    });
    console.log(data.message); 
    return data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

