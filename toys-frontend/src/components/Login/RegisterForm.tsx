import { ChangeEvent, useState } from "react";
import { Button, Center, Checkbox, NumberInput, PasswordInput, Select, Textarea, TextInput } from "@mantine/core";
import { Link } from "react-router-dom";
import PhoneInput from "./PhoneInput.tsx";
import EmailInput from "./EmailInput.tsx";
import { Department, RegisterFormProps } from "../../types/designed.ts";

const RegisterForm: React.FC<RegisterFormProps> = (props: RegisterFormProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  function onChangeAcceptTerms(event: ChangeEvent<HTMLInputElement>) {
    setAcceptedTerms(event.currentTarget.checked)
  }

  function onPressBack() {
    props.setRegistering(false);
  }

  return (
    <div
      className="flex flex-col flex-nowrap w-80 md:w-96 lg:w-[28rem] m-auto p-8 bg-blue-700 lg:m-0 overflow-x-clip rounded outline outline-2 outline-white">
      <span className="text-white text-xl">
        <Button onClick={onPressBack} className={`text-center bg-blue-600 border-2 border-white outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800 
              focus:outline-2 hover:outline-2`}>
          <span className="iconify solar--arrow-left-linear text-xl mt-2 mb-2"></span>
        </Button>
        &nbsp; Rehber Bilgileri
      </span>
      <br/>
      <hr/>
      <br/>
      <div className={"flex-1 p-2 basis-80 overflow-y-auto"}>
        <NumberInput label="Bilkent ID" withAsterisk placeholder="Bilkent ID" size="lg" radius="sm"
                 classNames={{
                   controls: "hidden",
                   root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                   wrapper: "p-2",
                   label: "text-white text-lg m-2 mb-0",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                 }}
        />
        <PasswordInput label="Şifre" withAsterisk placeholder="Şifre" size="lg" radius="sm"
                 classNames={{
                   root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                   wrapper: "p-2",
                   label: "text-white text-xl m-2",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                 }}
        />
        <TextInput label="İsim Soyisim" withAsterisk placeholder="İsim Soyisim" size="lg" radius="sm"
                 className=""
                 classNames={{
                   root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                   wrapper: "p-2",
                   label: "text-white text-lg m-2 mb-0",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                 }}
        />
        <EmailInput label="E-mail" withAsterisk placeholder="your@email.com" size="lg" radius="sm"
                 classNames={{
                   root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                   wrapper: "p-2",
                   label: "text-white text-lg m-2 mb-0",
                   input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                 }}
        />
        <PhoneInput label="Telefon Numarası" withAsterisk countryCode={90} placeholder="+90 (000)-000-00-00" size="lg" radius="sm"
                classNames={{
                  root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                  wrapper: "p-2",
                  label: "text-white text-lg m-2 mb-0",
                  input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                }}
        />
        <Select label = "Bölüm" placeholder="Bölüm seç" size="lg" radius="sm"
                classNames={{
                  root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                  wrapper: "p-2",
                  label: "text-white text-lg m-2 mb-0",
                  input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                }}
                data={Object.values(Department)}
        />
        {/*Select breaks the even-odd ordering of the later elements for some reason.*/}
        <NumberInput label="Dönem" withAsterisk placeholder="Dönem" size="lg" radius="sm"
                     classNames={{
                       controls: "hidden",
                       root: "even:bg-blue-600 odd:bg-blue-700 pb-4",
                       wrapper: "p-2",
                       label: "text-white text-lg m-2 mb-0",
                       input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                     }}
        />
        <Checkbox
          label="Sonraki dönem değişim programım var."
          classNames={{
            root: "odd:bg-blue-600 even:bg-blue-700 p-4",
            body: "flex flex-row items-center",
            input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
            label: "align-middle text-gray-200 font-medium text-base"
          }}
        />
        <Textarea label="Tanıtım ofisini nasıl duyudunuz?" placeholder="Arkadaşımdan, Bilkent sitesinden vb..." size="lg" radius="sm" autosize
                  minRows={3}
                  classNames={{
                    root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                    wrapper: "p-2",
                    label: "text-white text-lg m-2 mb-0",
                    input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                  }}/>
        <Textarea label="Neden rehber olmak istiyorsunuz?" placeholder="Sebep..." size="lg" radius="sm" autosize
                  minRows={3}
                  classNames={{
                    root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                    wrapper: "p-2",
                    label: "text-white text-lg m-2 mb-0",
                    input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                  }}/>
      </div>
      <br/>
      <hr/>
      <br/>
      <div className={"flex-1"}>
        <Checkbox
          label={
            <span>
              <Link reloadDocument to="/" target="_blank" className="underline">Gönüllülük koşullarını</Link> kabul ediyorum.
            </span>
          }
          classNames={{
            body: "flex flex-row items-center",
            root: "bg-blue-600 p-4",
            input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
            label: "align-middle text-gray-200 font-medium text-base"
          }}
          onChange={onChangeAcceptTerms}/>
        <br/>
        <Button size="lg" radius="md"
                className={`text-center ${acceptedTerms ? "border-white" : "border-gray-700 brightness-75"} bg-blue-600
          border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 
          hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300`}
                disabled={!acceptedTerms}>
          <span className="align-text-top iconify solar--file-send-linear text-2xl mr-2"/><span>Gönder</span>
        </Button>
      </div>
    </div>
  )
};

export default RegisterForm;