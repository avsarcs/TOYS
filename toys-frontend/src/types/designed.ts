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