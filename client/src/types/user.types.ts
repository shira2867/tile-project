export type LoginData ={
    email: string;
    password: string;
}
export const roles = [
  "admin",
  "moderator",
  "editor",
  "viewer",
] as const
export type Role = typeof roles[number];


export type SignUpData= {
  name: string;
  email: string;
  password: string;
}

export type User ={
  _id: string;
  name: string;
  email: string;
  role: Role;
}


export type MyUserPayload= {
    _id: string;
    role:Role;
    email:string;
}