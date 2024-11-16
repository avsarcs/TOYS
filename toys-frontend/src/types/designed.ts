import { Dispatch, SetStateAction } from "react";
import { DashboardCategory, DashboardCategoryText, EventType, UserRole } from "./enum.ts";

export interface LoginData {
  bilkentId: number,
  password: string
}

export interface User {
  id: number,
  role: UserRole
}

export interface NavbarProps {
  mode: string;
}

export interface LoginFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface RegisterFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface GuideApplicationData extends LoginData {
  fullName: string,
  email: string,
  phoneNumber: string,
  department: string,
  semester: number,
  hasExchange: boolean,
  howDidYouHear: string,
  whyApply: string
}

export interface DashboardCategoryControlProps {
  categories: { value: DashboardCategory, label: DashboardCategoryText }[];
  setCategory: Dispatch<SetStateAction<DashboardCategory>>;
}

export interface DashboardNotification {
  eventType: EventType,
  category: DashboardCategory
  details: { title: string, detail: string | number }[]
}

export interface DashboardNotificationListProps {
  categories: { value: DashboardCategory, label: DashboardCategoryText }[]
  setNotification: Dispatch<SetStateAction<DashboardNotification | null>>
}

export interface DashboardNotificationInfoProps {
  notification: DashboardNotification | null
}