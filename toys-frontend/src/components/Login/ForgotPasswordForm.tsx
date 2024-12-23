import {Button, TextInput} from "@mantine/core";
import React, {FormEvent, useState} from "react";
import {useForm} from "@mantine/form";
import validate from "validate.js";
import {ForgotPasswordFormProps} from "../../types/designed.ts";
import {notifications} from "@mantine/notifications";

const FORGOT_PASSWORD_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/auth/pass/forgot");
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = (props: ForgotPasswordFormProps) => {
  const [working, setWorking] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      bilkentId: "",
      email: ""
    },
    validate: {
      bilkentId: (value: string) => value.length > 0 ? null: "Lütfen Bilkent ID'nizi giriniz.",
      email: (value: string) => validate({ from: value }, { from: { email: true } }) === undefined ? null : "Geçersiz e-mail.",
    }
  });

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validation = form.validate();
    if(validation.hasErrors) return;

    setWorking(true);

    const formData = form.getValues();
    const forgotUrl = new URL(FORGOT_PASSWORD_URL);
    forgotUrl.searchParams.append("id", formData.bilkentId);
    forgotUrl.searchParams.append("email", formData.email);

    try {
      const forgotRes = await fetch(forgotUrl, {
        method: "POST",
      });
      if(forgotRes.ok) {
        notifications.show({
          color: "blue",
          title: "Şifre sıfırlama isteğiniz alındı.",
          message: "Şifrenizi sıfırlamanız için e-postanıza bir mail attık.."
        });
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine haber verin."
        });
      }
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine haber verin."
      });
      console.error(e);
    }
  }

  return (
    <form onSubmit={onSubmit}
          className="w-full md:w-[28rem] m-auto lg:m-0 p-10 bg-blue-700 rounded outline outline-2 outline-white">
      <span className="text-white text-xl">
        <Button onClick={() => { props.setForgotPassword(false) } } className={`text-center bg-blue-600 border-2 border-white outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800 
              focus:outline-2 hover:outline-2`}>
          <span className="iconify solar--arrow-left-linear text-xl mt-2 mb-2"></span>
        </Button>
        &nbsp;
        Şifremi Unuttum
      </span>
      <TextInput label="Bilkent ID" withAsterisk placeholder="Bilkent ID" size="lg" radius="sm"
                 className=""
                 classNames={{
                   label: "text-white text-lg m-2",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                   error: "ml-2"
                 }}
                 key={form.key("bilkentId")}
                 {...form.getInputProps("bilkentId")}
      />
      <br/>
      <TextInput label="E-Mail" withAsterisk placeholder="your@email.com" size="lg" radius="sm"
                 classNames={{
                   root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                   label: "text-white text-lg m-2",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                   error: "ml-2"
                 }}
                 key={form.key("email")}
                 {...form.getInputProps("email")}
      />
      <hr/>
      <br/>

      <Button size="lg" radius="md"
              className={`text-center ${working ? "border-gray-700 brightness-75" : "border-white"} bg-blue-600
              border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 
              focus:outline-blue-800 hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300`}
              type="submit"
              disabled={working}>
        <span className={`align-text-top text-2xl mr-2 transition-all iconify
              ${working ? "solar--traffic-line-duotone animate-spin" : "solar--login-2-linear"}`}/>
        <span>Gönder</span>
      </Button>
      &nbsp; &nbsp;
      <br className="sm:hidden"/>
      <br className="sm:hidden"/>

      <br/>
      <br/>
    </form>
  )
}

export default ForgotPasswordForm;