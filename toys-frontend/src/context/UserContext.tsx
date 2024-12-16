import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {OnlyChildrenProps} from '../types/generic';
import {User} from '../types/designed';
import {useCookies} from "react-cookie";
import {UserRole, TimeSlotStatus, UserFetchingStatus} from "../types/enum.ts";

interface UserContextType {
  authToken: string;
  setAuthToken: (token: string) => void;
  fetchStatus: UserFetchingStatus;
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
        location: "",
        priority: undefined
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
        }
      }
      },
      iban: "",
      bank: "",
      major: "",
      reviews: {
        average: undefined,
        count: undefined
      },
      role: UserRole.NONE,
      responsible_days: [],
      profile_picture: "",
      previous_tour_count: undefined,
      profile_description: "",
      advisor_offer: false
  }
};

export const UserContext = createContext<UserContextType>({
  authToken: "",
  setAuthToken: () => {},
  user: EMPTY_USER,
  fetchStatus: UserFetchingStatus.NONE,
  updateUser: () => Promise.resolve(new Promise<boolean>(() => false)),
  isLoggedIn: false
});

export const UserProvider: React.FC<OnlyChildrenProps> = ({ children }) => {
  const [cookies, setCookie] = useCookies(["auth"], {});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fetchStatus, setFetchStatus] = useState(UserFetchingStatus.NONE);
  const [user, setUser] = useState<User>(EMPTY_USER);

  const checkAuth = useCallback(async () => {
    setUser(EMPTY_USER);
    setIsLoggedIn(false);

    if (!cookies.auth || cookies.auth.length === 0) {
      setFetchStatus(UserFetchingStatus.DONE);
      return;
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
      setFetchStatus(UserFetchingStatus.FAILED);
      return;
    }

    const isValid = await validRes.json();

    if (isValid !== true) {
      setFetchStatus(UserFetchingStatus.DONE);
      setCookie("auth", "");
      setIsLoggedIn(false);
      return;
    }

    const profileURL = new URL(USER_PROFILE_URL);
    profileURL.searchParams.append("auth", cookies.auth);
    profileURL.searchParams.append("id", "");
    const profileRes = await fetch(
      profileURL,
      {
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
      setFetchStatus(UserFetchingStatus.DONE);
      setIsLoggedIn(true);
    }
    else {
      setFetchStatus(UserFetchingStatus.FAILED);
    }
  }, [cookies.auth, setCookie, setUser, setIsLoggedIn, setFetchStatus]);

  const setAuthToken = useCallback((auth: string) => {
    setFetchStatus(UserFetchingStatus.FETCHING);
    setCookie("auth", auth);
  }, [setCookie, setFetchStatus]);

  const updateUser = useCallback(() => {
    setFetchStatus(UserFetchingStatus.FETCHING);
    return new Promise<boolean>(() => {
      return checkAuth().then(() => user.id.length !== 0);
    });
  }, [checkAuth, user]);

  const userContextValue = useMemo(() => {
    return {
      authToken: cookies.auth,
      setAuthToken,
      updateUser,
      fetchStatus,
      user,
      isLoggedIn,
    }
  }, [cookies.auth, setAuthToken, updateUser, fetchStatus, user, isLoggedIn]);

  useEffect(() => {
    checkAuth().catch(console.error);
  }, [checkAuth]);

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  )
}