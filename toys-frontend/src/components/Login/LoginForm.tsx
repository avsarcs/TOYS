import {Button, PasswordInput, TextInput} from "@mantine/core";
import {Link} from "react-router-dom";
import { LoginFormProps } from "../../types/designed.ts";
import { LoginData } from "../../types/data.ts";
import { FormEvent, useContext, useState } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { UserContext } from "../../context/UserContext.tsx";

const LoginForm : React.FC<LoginFormProps> = (props : LoginFormProps) => {
  const userContext = useContext(UserContext);
  const [loggingIn, setLoggingIn] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      bilkentId: "",
      password: ""
    },
    validate: {
      bilkentId: (value: string) => value.length > 0 ? null: "Lütfen Bilkent ID'nizi giriniz.",
      password: (value: string) => value.length > 0 ? null: "Lütfen bir şifre giriniz.",
    }
  });

  async function onLogin(event: FormEvent) {
    event.preventDefault();

    const validation = form.validate();
    if(validation.hasErrors) return;

    setLoggingIn(true);

    const formData = form.getValues();
    const loginData: LoginData = {
      bilkentID: formData.bilkentId.toString(),
      password: formData.password
    };

    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      const res = await fetch(import.meta.env.VITE_BACKEND_API_ADDRESS + "/auth/login", {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify(loginData)
      });

      if(res.ok) {
        const token = await res.text();

        if(token.length > 0) {
          notifications.show({
            color: "green",
            title: "Giriş başarılı!",
            message: "Başarıyle giriş yapıldı. Ana sayfaya yönlendiriliyorsunuz."
          });
          userContext.setAuthToken(token);
        }
        else {
          notifications.show({
            color: "red",
            title: "Giriş başarısız!",
            message: "Giriş yapılamadı. ID'nizi ve şifrenizi kontrol ediniz."
          });
          setLoggingIn(false);
        }
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
        });
        setLoggingIn(false);
      }
    }
    catch (e) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
      });
      setLoggingIn(false);
    }
  }

  function onRegisterClick() {
    props.setRegistering(true);
  }

  return (
    <form onSubmit={onLogin} className="w-full md:w-[28rem] m-auto lg:m-0 p-10 bg-blue-700 rounded outline outline-2 outline-white">
      <TextInput label="Bilkent ID" withAsterisk placeholder="Bilkent ID" size="lg" radius="sm"
                   className=""
                   classNames={{
                     label: "text-white text-lg m-2",
                     input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                     error: "ml-2"
                   }}
                   key = {form.key("bilkentId")}
                   {...form.getInputProps("bilkentId")}
      />
      <br/>
      <PasswordInput label="Şifre" withAsterisk placeholder="Şifre" size="lg" radius="sm"
                 className=""
                 classNames={{
                   label: "text-white text-xl m-2",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                   error: "ml-2"
                 }}
                 key = {form.key("password")}
                 {...form.getInputProps("password")}
      />
      <br/>
      <hr/>
      <br/>

      <Button size="lg" radius="md"
              className={`text-center ${loggingIn ? "border-gray-700 brightness-75": "border-white"} bg-blue-600
              border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 
              focus:outline-blue-800 hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300`}
              type="submit"
              disabled={loggingIn}>
        <span className={`align-text-top text-2xl mr-2 transition-all iconify
              ${loggingIn ? "solar--traffic-line-duotone animate-spin" : "solar--login-2-linear"}`}/>
        <span>Giriş Yap</span>
      </Button>
      &nbsp; &nbsp;
      <br className="sm:hidden"/>
      <br className="sm:hidden"/>
      <Button size="lg" radius="md"
              className="text-center border-white bg-blue-600
              border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 
              focus:outline-blue-800 hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300"
              onClick={onRegisterClick}>
        <span className="align-text-top iconify solar--clipboard-add-linear text-2xl mr-2"/><span>Rehber Ol</span>
      </Button>

      <br/>
      <br/>
      <span className="text-gray-200 font-medium text-base">
        Tanıtım ofisinde bir çalışan veya gönüllü değil misiniz?
        <br/>
        <Link reloadDocument to="/" className="underline">Buraya tıklayarak</Link> ziyaretçi
        sayfasına gidebilirsiniz.
      </span>
    </form>
  )
};

export default LoginForm;