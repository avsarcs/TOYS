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
  name: string,
  surname: string,
  email: string,
  phone: string,
  school: string,
  times: string[][],
  major_choices: string[],
  applicant_notes: string
}

export interface GroupApplication {
  group_leader: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    school: string;
    role: string;
  };
  student_count: number;
  applicant_notes: string;
  times: string[][];
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