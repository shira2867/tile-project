import React, { type ReactNode } from 'react';
import type { User } from './user.types';


export type UserContextType = {
    _id: string;
    name: string;
    role: "viewer" | "editor" | "moderator" | "admin";
    setId: (_id: string) => void;
    setName: (name: string) => void;
    setRole: (role: "viewer" | "editor" | "moderator" | "admin") => void;

}


export type UserProviderProps = {
    children: ReactNode;
}