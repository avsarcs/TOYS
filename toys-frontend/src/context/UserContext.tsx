import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {OnlyChildrenProps} from '../types/generic';
import {User} from '../types/designed';
import {useCookies} from "react-cookie";
import {UserRole} from "../types/enum.ts";

interface UserContextType {
  authToken: string;
  setAuthToken: (token: string) => void;
  user: User;
  isLoggedIn: boolean;
}

const AUTH_VALID_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/auth/isvalid");
const USER_PROFILE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile");

export const UserContext = createContext<UserContextType>({
  authToken: "",
  setAuthToken: () => {},
  user: {
    id: "",
    role: UserRole.NONE,
    profile: {}
  },
  isLoggedIn: false,
});

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

  const checkAuth = async (auth: string) => {
    setUser({
      id: "",
      role: UserRole.NONE,
      profile: {}
    });
    setIsLoggedIn(false);

    if(!auth || auth.length === 0) {
      return;
    }

    const validURL = new URL(AUTH_VALID_URL);
    validURL.searchParams.append("auth", auth);
    const validRes = await fetch(
      validURL,
      {
          method: "GET"
      }
    );

    const isValid = await validRes.json();

    if (validRes.status !== 200 || isValid !== true) {
      return;
    }

    const profileURL = new URL(USER_PROFILE_URL);
    profileURL.searchParams.append("auth", auth);
    profileURL.searchParams.append("id", "");
    const profileRes = await fetch(
      profileURL,
      {
        method: "GET"
      }
    );

    if(profileRes.status === 200) {
      const profile = await profileRes.json();
      setUser({
        id: profile.id,
        role: profile.role,
        profile: profile,
      });
      setIsLoggedIn(true);
    }
  }

  useEffect(() => {
    checkAuth(cookies.auth).catch(console.error);

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