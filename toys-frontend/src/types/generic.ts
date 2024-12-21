import { ReactNode } from "react";
import {UserRole} from "./enum.ts";

export interface OnlyChildrenProps {
  children: ReactNode
}

export interface CheckLoginProps extends OnlyChildrenProps {
  dontRerender?: boolean,
  redirect?: boolean,
  required?: boolean,
  acceptedRoles?: UserRole[]
}