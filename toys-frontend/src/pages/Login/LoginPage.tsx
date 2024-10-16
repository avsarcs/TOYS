import { Button, NumberInput, TextInput } from "@mantine/core";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className={"w-full min-h-screen grid lg:grid-cols-2 grid-cols-1 lg:grid-rows-1 grid-rows-2"}>
      <div className={`relative flex flex-col lg:flex-row flex-nowrap justify-center lg:justify-end items-center 
        shadow-md lg:shadow-xl shadow-gray-700 text-white border-b lg:border-r lg:border-b-0`}>
        <div className={`absolute w-full h-full bg-blue-600 brightness-75 
          lg:bg-gradient-to-bl lg:from-50% lg:from-blue-600 lg:via-blue-500 lg:to-red-300`} />

        <div
          className="text-center selection:bg-gray-600 selection:text-gray-300 lg:text-end text-5xl lg:mr-20 z-10">
          <span className={"font-bold"}>TOYS'a</span>
          <br/>
          <span>hoşgeldiniz.</span>
          <br/>
          <br/>
          <hr/>
          <span className="text-xl">Tanıtım Ofisi Yönetim Sistemi</span>
        </div>
      </div>
      <div
        className={`flex flex-col flex-nowrap justify-start lg:justify-center items-top lg:items-start
          text-center lg:text-left p-8 lg:p-20 border-t lg:border-l lg:border-t-0 bg-blue-600 
          bg-gradient-to-bl from-50% from-blue-600 via-blue-500 to-red-300 lg:via-blue-600 lg:to-blue-600`}>
        <div className="p-10 bg-blue-700 rounded outline outline-2 outline-white w-fit m-auto lg:m-0">
          <NumberInput label="Bilkent ID" withAsterisk placeholder="Bilkent ID" size="lg" radius="sm"
                       className=""
                       classNames={{
                         controls: "hidden",
                         label: "text-white text-xl m-2",
                         input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                       }}/>
          <br/>
          <TextInput label="Şifre" withAsterisk placeholder="Şifre" size="lg" radius="sm"
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

          <br/>
          <br/>
          <span className="text-gray-200 font-medium text-base">
            Tanıtım ofisinde bir çalışan değil misiniz?
            <br/>
            <Link to="/" className="underline">Buraya tıklayarak</Link> ziyaretçi
            sayfasına gidebilirsiniz.
          </span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;