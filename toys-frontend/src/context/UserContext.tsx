import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {OnlyChildrenProps} from '../types/generic';
import {User} from '../types/designed';
import {useCookies} from "react-cookie";
import {UserRole, DayOfTheWeek, TimeSlotStatus} from "../types/enum.ts";
import { ScheduleData, HighschoolData} from '../types/data.ts'; 


interface UserContextType {
  authToken: string;
  setAuthToken: (token: string) => void;
  user: User;
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
  isLoggedIn: false
  });

export const UserProvider: React.FC<OnlyChildrenProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cookies, setCookie] = useCookies(["auth"], {})
  const [user, setUser] = useState<User>(EMPTY_USER);

  const setAuthToken = useCallback((auth: string) => {
    setCookie("auth", auth);
  }, [setCookie]);

  const checkAuth = async (auth: string) => {
    setUser(EMPTY_USER);
    setIsLoggedIn(false);

    if (!auth || auth.length === 0) {
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

    if (profileRes.status === 200) {
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