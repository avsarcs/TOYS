import React, { createContext, useState } from 'react';
import { OnlyChildrenProps } from '../types/generic';
import { User } from '../types/designed';

interface UserContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<OnlyChildrenProps> = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({
    "name": "",
    "role": ""
  });

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}