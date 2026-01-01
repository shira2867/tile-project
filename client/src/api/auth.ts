import axios from "axios";
import type { LoginData } from "../types/user.types";
import type { SignUpData } from "../types/user.types";

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
