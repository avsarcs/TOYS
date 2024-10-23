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