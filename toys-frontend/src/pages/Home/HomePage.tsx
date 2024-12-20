import { Image } from "@mantine/core"
import LoginForm from "../../components/Login/LoginForm";
import {useContext, useState} from "react";
import RegisterForm from "../../components/Login/RegisterForm.tsx";
import { Link, useNavigate } from "react-router-dom";
import {UserContext} from "../../context/UserContext.tsx";

const HomePage: React.FC = () => {
  const [registering, setRegistering] = useState(false);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if(userContext?.isLoggedIn) {
    navigate("/dashboard");
  }

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

            <div className="flex flex-col items-center gap-4 mt-8">
                <h2 className="text-white mb-4 text-2xl lg:text-3xl text-center"><b>Devam etmek için yapmak istediğiniz başvuruyu seçiniz:</b></h2>
            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full w-full max-w-md h-16 text-xl whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 flex items-center justify-center" to="/group-tour-application">
              Lise Grup Turu Başvurusu Yap
            </Link>
            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full w-full max-w-md h-16 text-xl whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 flex items-center justify-center" to="/individual-tour-application">
              Bireysel Öğrenci Turu Başvurusu Yap
            </Link>
            <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full w-full max-w-md h-16 text-xl whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 flex items-center justify-center" to="/fair-application">
              Fuar Katılımı Başvurusu Yap
            </Link>
            <div className="mt-8">
              <h2 className="text-white mb-4 text-1xl lg:text-2xl text-center"><b>TOYS çalışanı mısınız? </b></h2>
                <Link className="bg-purple-400 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full w-full max-w-md h-16 text-xl whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 flex items-center justify-center" to="/login">
                Giriş Yap / Kayıt Ol
                </Link>
            </div>
        </div>
        }
      </div>
    
    </div>
  )
}

export default HomePage;