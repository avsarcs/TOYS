import { Dispatch, SetStateAction } from "react";

export interface User {
  name: string,
  role: string
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