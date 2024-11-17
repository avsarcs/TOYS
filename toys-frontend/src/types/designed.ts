import { Dispatch, SetStateAction } from "react";

export interface User {
  name: string,
  role: string
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

export enum Department {
  COMPUTER_ENGINEERING = "Computer Engineering",
  ELECTRICAL_ENGINEERING = "Electrical Engineering",
  MECHANICAL_ENGINEERING = "Mechanical Engineering",
  CIVIL_ENGINEERING = "Civil Engineering",
  CHEMICAL_ENGINEERING = "Chemical Engineering",
  PETROLEUM_ENGINEERING = "Petro Engineering",
  ARCHITECTURE = "Architecture",
  BUSINESS = "Business",
  LAW = "Law",
  MEDICINE = "Medicine",
  PHARMACY = "Pharmacy",
  DENTISTRY = "Dentistry",
  NURSING = "Nursing",
  ARTS = "Arts",
  EDUCATION = "Education",
}