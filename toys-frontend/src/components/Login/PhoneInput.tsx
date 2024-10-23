import { Input, InputProps, InputWrapperProps } from "@mantine/core";
import { IMaskInput } from "react-imask";
import { PhoneInputProps } from "../../types/generic.ts";



const PhoneInput : React.FC<PhoneInputProps> = (props: PhoneInputProps) => {
  const mask = (props.countryCode && (props.countryCode > 0 && props.countryCode < 100))
    ? `+{${props.countryCode}} (000)-000-00-00` : "+00 (000)-000-00-00";

  return (
    <Input.Wrapper {...(props as InputWrapperProps)}>
      <Input {...(props as InputProps)} component={IMaskInput} mask={mask}/>
    </Input.Wrapper>
  )
}

export default PhoneInput;