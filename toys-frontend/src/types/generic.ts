import { ReactNode } from "react";
import { NumberInputProps, TextInputProps } from "@mantine/core";

export interface OnlyChildrenProps {
  children: ReactNode
}

export interface EmailInputProps extends TextInputProps {
  supportedMailServices?: string[]
}

export interface PhoneInputProps extends NumberInputProps{
  countryCode?: number
}