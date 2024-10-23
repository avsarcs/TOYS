import { Input, InputProps, InputWrapperProps } from "@mantine/core";
import { IMaskInput } from "react-imask";
import { EmailInputProps } from "../../types/generic"
import IMask, { Masked } from "imask";

const EmailInput: React.FC<EmailInputProps> = (props: EmailInputProps) => {
  const mask: Masked = IMask.createMask(
      props.supportedMailServices ?
        {
          mask: "addr@serv",
          blocks: {
            addr: { mask: /\w*/g },
            serv: { mask: (new RegExp(props.supportedMailServices.join("|"), "g")) }
          }
        } :
        {
          mask: "addr@serv.ext",
          blocks: {
            addr: { mask: /\w*/g },
            serv: { mask: /\w*/g },
            ext: { mask: /\w*/g }
          }
        }
      )

  return (
    <Input.Wrapper {...(props as InputWrapperProps)}>
      <Input {...(props as InputProps)} component={IMaskInput} mask={mask}/>
    </Input.Wrapper>
  )
}

export default EmailInput;