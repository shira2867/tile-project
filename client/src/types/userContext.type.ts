import React, { type ReactNode } from 'react';

import type{Role} from './user.types'
export type UserContextType = {
    _id: string;
    name: string;
    role: Role;
    setId: (_id: string) => void;
    setName: (name: string) => void;
    setRole: (role: Role) => void;

}


export type UserProviderProps = {
    children: ReactNode;
}