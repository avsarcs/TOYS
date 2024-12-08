import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { OnlyChildrenProps } from '../types/generic';
import { User } from '../types/designed';
import { useCookies } from "react-cookie";
import { UserRole } from "../types/enum.ts";

interface UserContextType {
  authToken: string;
  setAuthToken: (token: string) => void;
  user: User;
  isLoggedIn: boolean;
}

const USER_PROFILE_URL = import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<OnlyChildrenProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cookies, setCookie] = useCookies(["auth"], {})
  const [user, setUser] = useState<User>({
    id: "",
    role: UserRole.NONE,
    profile: {}
  });

  const setAuthToken = useCallback((auth: string) => {
    setCookie("auth", auth);
  }, [setCookie]);

  useEffect(() => {
    if(!cookies.auth || cookies.auth.length === 0) {
      setUser({
        id: "",
        role: UserRole.NONE,
        profile: {}
      });
      setIsLoggedIn(false);
    }
    else {
      //fetch new user data
      fetch(USER_PROFILE_URL + (new URLSearchParams({
        authToken: cookies.auth,
        id: ""
      }).toString()))
        .then(async (res) => {
          if(res.status === 200) {
            const profile = await res.json();
            setUser({
              id: profile.id,
              role: profile.role,
              profile: profile,
            })
          }
          else {
            setUser({
              id: "",
              role: UserRole.NONE,
              profile: {}
            });
          }
        })
    }

    return () => {
      setUser({
        id: "",
        role: UserRole.NONE,
        profile: {}
      });
    }
  }, [cookies.auth]);

  const userContextValue = useMemo(() => {
    return {
      authToken: cookies.auth,
      setAuthToken,
      user,
      isLoggedIn,
    }
  }, [cookies.auth, setAuthToken, user, isLoggedIn])

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  )
}