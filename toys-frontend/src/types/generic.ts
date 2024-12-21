import { ReactNode } from "react";

export interface OnlyChildrenProps {
  children: ReactNode
}

export interface CheckLoginProps extends OnlyChildrenProps {
  checkOnce?: boolean,
  redirect?: boolean
}