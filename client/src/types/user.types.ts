export type LoginData ={
    email: string;
    password: string;
}



export enum Role {
  Admin = "admin",
  Moderator = "moderator",
  Editor = "editor",
  Viewer = "viewer",
}
export const roles = Object.values(Role);

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