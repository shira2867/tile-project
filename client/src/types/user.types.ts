export type LoginData ={
    email: string;
    password: string;
}


export type SignUpData= {
  name: string;
  email: string;
  password: string;
}
export type User ={
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'editor' | 'viewer';
}


export type MyUserPayload= {
    _id: string;
    role: 'admin' | 'moderator' | 'editor' | 'viewer';
    email:string;
}