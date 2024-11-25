import React, { createContext, useEffect, useState } from 'react';
import { OnlyChildrenProps } from '../types/generic';
import { User } from '../types/designed';
import { useCookies } from "react-cookie";
import { UserRole } from "../types/enum.ts";

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<OnlyChildrenProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cookies] = useCookies(["auth"], {})
  const [user, setUser] = useState<User>({
    id: NaN,
    role: UserRole.NONE
  });

  useEffect(() => {
    if(!cookies.auth || cookies.auth.length === 0) {
      setUser({
        id: NaN,
        role: UserRole.NONE
      });
    }
    else {
      //fetch new user data
    }

    return () => {
      setUser({
        id: NaN,
        role: UserRole.NONE
      });
    }
  }, [cookies.auth]);

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}