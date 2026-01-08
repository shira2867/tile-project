import { createContext, useState, useContext, useEffect } from 'react';
import type {UserContextType,UserProviderProps} from '../types/userContext.type'
import axios from 'axios';


export const UserContext = createContext<UserContextType | null>(null);
export const useUser = () => {
  const contextUser = useContext(UserContext);
  if (!contextUser) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return contextUser;
};
export const UserProvider = ({ children }: UserProviderProps) => {
 ;
 const [name, setName] = useState("user");
 const [role, setRole] = useState<"viewer" | "editor" | "moderator" | "admin">("viewer");
  const [_id, setId] = useState("");
 

   return (
    <UserContext.Provider value={{_id, name,role,setId,setName,setRole,
      
     }}>
      {children}
    </UserContext.Provider>
  );
}


