import { Dispatch, SetStateAction } from "react";
import {
  DashboardCategory,
  DashboardCategoryText,
  UserRole
} from "./enum.ts";
import { HighschoolData, SimpleEventData, TourData } from "./data.ts";

export interface User {
  id: string,
  role: UserRole,
  profile: any
}

export interface NavbarProps {
  mode: string;
}

export interface IndividualApplication {
  highschool: HighschoolData,
  requested_times: string[],
  requested_majors: string[],
  visitor_count: number,
  applicant: {
    fullname: string,
    role: string,
    email: string,
    phone: string,
    notes: string
  }
}

export interface GroupApplication {
  highschool_name: string,
  requested_times: string[],
  visitor_count: number,
  applicant: {
    fullname: string,
    role: string,
    email: string,
    phone: string,
    notes: string
  }
}

export interface GroupApplicationStageProps {
  applicationInfo: GroupApplication;
  setApplicationInfo: Dispatch<SetStateAction<GroupApplication>>;
  warnings: Record<any, any>;
}

export interface IndividualApplicationStageProps {
  applicationInfo: IndividualApplication,
  setApplicationInfo: Dispatch<SetStateAction<IndividualApplication>>,
  warnings: Record<any, any>
}

export interface SimpleToysApplication {
  id: string;
  fullname: string;
  experience: string;
}

export interface TraineeApplication {
  fullname: string;
  id: string;
  high_school: string;
  email: string;
  phone: string;
  major: string;
  current_semester: number;
  next_semester_exchange: boolean;
  how_did_you_hear: string;
  why_apply: string;
}

export interface AdvisorApplication {
  id: string,
  high_school: string,
  fullname: string,
  phone: string,
  major: string,
  application_explanation : string,
  experience: string
}

export interface LoginFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface RegisterFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface DashboardCategoryControlProps {
  categories: { value: DashboardCategory, label: DashboardCategoryText }[],
  setCategory: Dispatch<SetStateAction<DashboardCategory>>,
}

export interface DashboardItemProps {
  item: SimpleEventData,
  setItem: Dispatch<SetStateAction<SimpleEventData | null>>
}

export interface DashboardItemListProps {
  categories: { value: DashboardCategory, label: DashboardCategoryText }[],
  category: DashboardCategory,
  setCategory: Dispatch<SetStateAction<DashboardCategory>>
  setItem: Dispatch<SetStateAction<SimpleEventData | null>>
}

export interface DashboardInfoBoxProps {
  category: DashboardCategory,
  item: SimpleEventData
}

export interface TourSectionProps {
  tour: TourData
}

export interface MoneyForGuide {
  guide: {
      id: number;
      name: string;
      iban: string;
      bank: string;
  };
  unpaid_hours: number;
  debt: number;
  money_paid: number;
}

export interface MoneyForTour {
  tour_id: number;
  tour_date: string;
  hourly_rate: number;
  tour_highschool: string;
  hours_worked: number;
  money_debted: number;
  money_paid: number;
}

export interface SimpleGuide {
  id: number;
  name: string;
  major: string;
  experience: string;
}