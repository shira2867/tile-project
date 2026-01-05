import React, { type ReactNode } from 'react';


export type UserContextType = {
    name: string;
    role: "viewer" | "editor" | "moderator" | "admin"; 
    setName: (name: string) => void;
    setRole: (role: "viewer" | "editor" | "moderator" | "admin") => void;
}


export type UserProviderProps = {
    children: ReactNode;
}