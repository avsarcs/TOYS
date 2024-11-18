import { Dispatch, SetStateAction } from "react";
import {
  ApplicantRole,
  DashboardCategory,
  DashboardCategoryText,
  EventTypeText,
  TourStatus, TourType,
  UserRole
} from "./enum.ts";

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
  eventType: EventTypeText,
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

export interface Applicant {
  fullname: string,
  role: ApplicantRole,
  email: string,
  phone: string,
  notes: string
}

export interface Tour {
  type: TourType,
  highschool_name: string,
  guides: { id: number; name: string }[],
  trainee_guides: { id: number; name: string }[],
  requested_times: string[],
  accepted_time: string,
  visitor_count: number,
  status: TourStatus,
  notes: string,
  applicant: Applicant,
  actual_start_time: string,
  actual_end_time: string,
  classroom: string,
}

export interface TourSectionProps {
  tour: Tour
}