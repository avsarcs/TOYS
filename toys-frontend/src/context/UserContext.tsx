import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {OnlyChildrenProps} from '../types/generic';
import {User} from '../types/designed';
import {useCookies} from "react-cookie";
import {UserRole, TimeSlotStatus, FetchingStatus} from "../types/enum.ts";

interface UserContextType {
  getAuthToken: () => Promise<string>;
  setAuthToken: (token: string) => void;
  profileFetchStatus: FetchingStatus;
  user: User;
  updateUser: () => Promise<boolean>
  isLoggedIn: boolean;
}

const AUTH_VALID_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/auth/isvalid");
const USER_PROFILE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile");

const EMPTY_USER: User = {
  id: "",
  role: UserRole.NONE,
  profile: {
      experience: "",
      id: "",
      email: "",
      created_at: "",
      updated_at: "",
      fullname: "",
      phone: "",
      highschool: {
        id: "",
        name: "",
      },
      schedule: { schedule: {
        MONDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        },
        TUESDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        },
        WEDNESDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        },
        THURSDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        },
        FRIDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        },
        SATURDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        },
        SUNDAY: {
          _830_930: TimeSlotStatus.FREE,
          _930_1030: TimeSlotStatus.FREE,
          _1030_1130: TimeSlotStatus.FREE,
          _1130_1230: TimeSlotStatus.FREE,
          _1230_1330: TimeSlotStatus.FREE,
          _1330_1430: TimeSlotStatus.FREE,
          _1430_1530: TimeSlotStatus.FREE,
          _1530_1630: TimeSlotStatus.FREE,
          _1630_1730: TimeSlotStatus.FREE,
          _1730_1830: TimeSlotStatus.FREE
        }
      }
      },
      iban: "",
      bank: "",
      major: "",
      reviews: {
        average: 0,
        count: 0
      },
      role: UserRole.NONE,
      responsible_days: [],
      profile_picture: "",
      previous_tour_count: 0,
      profile_description: "",
      advisor_offer: false
  }
};

export const UserContext = createContext<UserContextType>({
  setAuthToken: () => {},
  getAuthToken: () => Promise.resolve(""),
  user: EMPTY_USER,
  profileFetchStatus: FetchingStatus.NONE,
  updateUser: () => Promise.resolve(new Promise<boolean>(() => false)),
  isLoggedIn: false
});

export const UserProvider: React.FC<OnlyChildrenProps> = ({ children }) => {
  const [cookies, setCookie] = useCookies(["auth"], {});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileFetchStatus, setProfileFetchStatus] = useState(FetchingStatus.NONE);
  const [user, setUser] = useState<User>(EMPTY_USER);

  const checkAuth = useCallback(async () => {
    if (!cookies.auth || cookies.auth.length === 0) {
      setUser(EMPTY_USER);
      setProfileFetchStatus(FetchingStatus.DONE);
      setIsLoggedIn(false);
      return false;
    }

    const validURL = new URL(AUTH_VALID_URL);
    validURL.searchParams.append("auth", cookies.auth);
    const validRes = await fetch(
      validURL,
      {
          method: "GET"
      }
    );

    if (!validRes.ok) {
      setUser(EMPTY_USER);
      setProfileFetchStatus(FetchingStatus.DONE);
      setIsLoggedIn(false);
      return false;
    }

    const isValid = await validRes.json();

    if (isValid !== true) {
      setCookie("auth", "");
      setUser(EMPTY_USER);
      setIsLoggedIn(false);
      setProfileFetchStatus(FetchingStatus.DONE);
      return false;
    }
    else {
      setIsLoggedIn(true);
      return true;
    }
  }, [cookies.auth, setCookie]);

  const setAuthToken = useCallback((auth: string) => {
    setCookie("auth", auth);
  }, [setCookie]);

  const getAuthToken = useCallback(async () => {
    await checkAuth().catch(console.error);
    return cookies.auth;
  }, [checkAuth, cookies.auth]);

  const getUser = useCallback(async () => {
    setProfileFetchStatus(FetchingStatus.FETCHING);

    const profileURL = new URL(USER_PROFILE_URL);
    profileURL.searchParams.append("auth", cookies.auth);
    profileURL.searchParams.append("id", "");
    const profileRes = await fetch(
      profileURL, {
        method: "GET"
      }
    );

    if (profileRes.ok) {
      const profile = await profileRes.json();
      setUser({
        id: profile.id,
        role: profile.role,
        profile: profile,
      });
      setProfileFetchStatus(FetchingStatus.DONE);
      setIsLoggedIn(true);
    }
    else {
      setProfileFetchStatus(FetchingStatus.FAILED);
    }
  }, [cookies.auth]);

  const updateUser = useCallback(async () => {
    setProfileFetchStatus(FetchingStatus.FETCHING);
    await checkAuth()
      .then(getUser)
      .catch(console.error);
    return user.id.length !== 0;
  }, [checkAuth, getUser, user.id.length]);

  const userContextValue = useMemo(() => {
    return {
      getAuthToken,
      setAuthToken,
      updateUser,
      profileFetchStatus,
      user,
      isLoggedIn,
    }
  }, [cookies.auth, getAuthToken, setAuthToken, updateUser, profileFetchStatus, user, isLoggedIn]);

  useEffect(() => {
    checkAuth()
      .then((result) => {
        if(result) {
          return getUser()
        }
        else {
          setUser(EMPTY_USER);
        }
      })
      .catch(console.error);
  }, [cookies.auth]);

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  )
}