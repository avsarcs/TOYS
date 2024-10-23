import { Button, NumberInput, PasswordInput } from "@mantine/core";
import { Link } from "react-router-dom";
import { LoginFormProps } from "../../types/designed.ts";

const LoginForm : React.FC<LoginFormProps> = (props : LoginFormProps) => {
  function onRegisterClick() {
    props.setRegistering(true);
  }

  return (
    <div className="w-full md:w-[28rem] m-auto lg:m-0 p-10 bg-blue-700 rounded outline outline-2 outline-white">
      <NumberInput label="Bilkent ID" withAsterisk placeholder="Bilkent ID" size="lg" radius="sm"
                   className=""
                   classNames={{
                     controls: "hidden",
                     label: "text-white text-lg m-2",
                     input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                   }}/>
      <br/>
      <PasswordInput label="Şifre" withAsterisk placeholder="Şifre" size="lg" radius="sm"
                 className=""
                 classNames={{
                   label: "text-white text-xl m-2",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                 }}/>
      <br/>
      <hr/>
      <br/>

      <Button size="lg" radius="md" className={`text-center bg-blue-600 border-2 border-white outline outline-0
                hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800 
                focus:outline-2 hover:outline-2`}>
        <span className="align-text-top iconify solar--login-2-linear text-2xl mr-2"/><span>Giriş Yap</span>
      </Button>
      &nbsp; &nbsp;
      <br className="lg:hidden"/>
      <br className="lg:hidden"/>
      <Button size="lg" radius="md" className={`text-center bg-blue-600 border-2 border-white outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800 
              focus:outline-2 hover:outline-2`} onClick={onRegisterClick}>
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
    </div>
  )
};

export default LoginForm;