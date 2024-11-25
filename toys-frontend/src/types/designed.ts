import { Dispatch, SetStateAction } from "react";
import { UserRole } from "./enum.ts";

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

export interface IndividualApplication {
  highschool_name: string,
  requested_times: string[],
  requested_majors: string[],
  visitor_count: number,
  applicant: {
    fullname: string,
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

export interface LoginFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}

export interface RegisterFormProps {
  setRegistering: Dispatch<SetStateAction<boolean>>
}