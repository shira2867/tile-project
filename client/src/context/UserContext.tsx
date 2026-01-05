import React, { createContext, useState, useContext,type ReactNode, type FC } from 'react';
import type {UserContextType,UserProviderProps} from '../types/userContext.type'


export const UserContext = createContext<UserContextType | null>(null);
export const useUser = () => {
  const contextUser = useContext(UserContext);
  if (!contextUser) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return contextUser;
};
export const UserProvider = ({ children }: UserProviderProps) => {
 const [name, setName] = useState("user");
 const [role, setRole] = useState<"viewer" | "editor" | "moderator" | "admin">("viewer");
 

   return (
    <UserContext.Provider value={{ name,role,setName,setRole }}>
      {children}
    </UserContext.Provider>
  );
}


