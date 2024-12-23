import {Image} from "@mantine/core"
import LoginForm from "../../components/Login/LoginForm";
import {useContext, useEffect, useState} from "react";
import RegisterForm from "../../components/Login/RegisterForm.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {UserContext} from "../../context/UserContext.tsx";
import {UserRole} from "../../types/enum.ts";

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [registering, setRegistering] = useState(false);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(userContext.isLoggedIn) {
      if(searchParams.has("redirect")) {
        navigate(searchParams.get("redirect") as string);
      }
      else {
        switch(userContext.user.role) {
          case UserRole.COORDINATOR:
            navigate("/tours");
            break;
          case UserRole.DIRECTOR:
            navigate("/universitieslist");
            break;
          case UserRole.ADMIN:
            navigate("/admin");
            break;
          default:
            navigate("/dashboard");
        }
      }
    }
  }, [userContext.user.role]);

  return (
    <div className={"w-full min-h-screen grid lg:grid-cols-2 grid-cols-1 lg:grid-rows-1 grid-rows-2"}>
      <div className={`relative flex flex-col lg:flex-row flex-nowrap justify-center lg:justify-end items-center 
        shadow-md lg:shadow-2xl shadow-gray-700 text-white border-b lg:border-r lg:border-b-0`}>
        <div className={`absolute w-full h-full bg-blue-600 brightness-75 
          lg:bg-gradient-to-bl lg:from-50% lg:from-blue-600 lg:via-blue-500 lg:to-red-300`}>
        </div>
        <div
          className="flex flex-wrap justify-center lg:justify-end gap-8 text-center selection:bg-gray-600 selection:text-gray-300 lg:text-end text-5xl m-2 lg:mr-16 z-10">
            <Image src={"/bilkent-tr-amblem.png"} fit={"contain"} className={"flex-shrink w-1/4"}/>
          <div>
            <span className={"font-bold"}>TOYS'a</span>
            <br/>
            <span>hoşgeldiniz.</span>
            <br/>
            <br/>
            <hr/>
            <span className="text-xl">Tanıtım Ofisi Yönetim Sistemi</span>
          </div>
        </div>
        <div className={"lg:hidden animate-bounce text-center"}>
          <br/>
          <span className={"bottom-4 iconify solar--arrow-down-linear text-4xl text-white"} />
        </div>
      </div>
      <div
        className={`max-h-screen overflow-y-auto flex flex-col flex-nowrap justify-start lg:justify-safe-center items-top
          md:p-8 lg:p-14 border-t lg:border-l lg:border-t-0 bg-blue-600 
          bg-gradient-to-bl from-50% from-blue-600 via-blue-500 to-red-300 lg:via-blue-600 lg:to-blue-600`}>
        {
          registering ? <RegisterForm setRegistering={setRegistering}/> : <LoginForm setRegistering={setRegistering}/>
        }
      </div>
    </div>
  )
}

export default LoginPage;