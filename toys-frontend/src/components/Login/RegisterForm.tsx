import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Checkbox, NumberInput, PasswordInput, ScrollArea, Select, Textarea, TextInput } from "@mantine/core";
import { Link } from "react-router-dom";
import { Department } from "../../types/enum.ts";
import { RegisterFormProps } from "../../types/designed.ts";
import { GuideApplicationData } from "../../types/data.ts";
import { useForm } from "@mantine/form";
import validate from "validate.js"
import { isPossiblePhoneNumber } from "libphonenumber-js/max";
import { StatusCodes } from "http-status-codes";
import { notifications } from "@mantine/notifications";

const RegisterForm: React.FC<RegisterFormProps> = (props: RegisterFormProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      bilkentId: NaN,
      password: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      department: "",
      semester: NaN,
      hasExchange: false,
      howDidYouHear: "",
      whyApply: ""
      },
    validate: {
      bilkentId: (value: number) => !isNaN(value) ? null: "Lütfen Bilkent ID'nizi giriniz.",
      password: (value: string) => value.length > 0 ? null: "Lütfen bir şifre giriniz.",
      fullName: (value: string) => value.length > 0 ? null: "Lütfen tam adınızı giriniz.",
      email: (value: string) => validate({ from: value }, { from: { email: true } }) === undefined ? null : "Geçersiz e-mail.",
      phoneNumber: (value: string) => isPossiblePhoneNumber(value, "TR") ? null: "Geçersiz telefon numarası.",
      department: (value: string) => value.length > 0 ? null: "Lütfen bir bölüm seçiniz.",
      semester: (value: number) => !isNaN(value) ? null: "Lütfen Bilkent ID'nizi giriniz.",
      hasExchange: () => null,
      howDidYouHear: () => null,
      whyApply: () => null
    }
  });

  function onChangeAcceptTerms(event: ChangeEvent<HTMLInputElement>) {
    setAcceptedTerms(event.currentTarget.checked)
  }

  function onPressBack() {
    props.setRegistering(false);
  }

  async function onFormSubmit(event: FormEvent) {
    event.preventDefault();

    const validation = form.validate();
    if(validation.hasErrors) return;

    setRegistering(true);

    const applicationData: GuideApplicationData = form.getValues();
    try {
      const res = await fetch(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData)
      });

      if(res.status === StatusCodes.BAD_REQUEST) {
        notifications.show({
          color: "red",
          title: "Başvuru gönderilemedi!",
          message: "Başvurunuzda bir hata var. Lütfen tekrar deneyin."
        });
        setRegistering(false);
      }

      if(res.ok) {
        notifications.show({
          color: "green",
          title: "Başvuru gönderildi!",
          message: "Başvurunuz için teşekkür ederiz."
        });
        setRegistered(true);
        setRegistering(false);
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
        });
        setRegistering(false);
      }
    }
    catch (e) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
      });
      setRegistering(false);
    }
  }

  return (
    <form onSubmit={onFormSubmit}
      className="flex flex-col flex-nowrap w-full md:w-[28rem] m-auto p-6 bg-blue-700 lg:m-0 overflow-x-clip rounded outline outline-2 outline-white">
      <span className="text-white text-xl">
        <Button onClick={onPressBack} className={`text-center bg-blue-600 border-2 border-white outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800 
              focus:outline-2 hover:outline-2`}>
          <span className="iconify solar--arrow-left-linear text-xl mt-2 mb-2"></span>
        </Button>
        &nbsp;
        {
          registered ? "Başvuru yapıldı." : "Rehber Bilgileri"
        }
      </span>
      <br/>
      <hr/>
      <br/>
      {
        registered ?
        <p className="text-gray-200 font-medium text-base">
            Başvuru işleminiz bitmiştir. Yanıt gelene kadar beklemenizi rica ediyoruz. İyi günler dileriz :)
        </p> :
        <>
          <ScrollArea className="basis-80 border-8 border-blue-600">
              <NumberInput label="Bilkent ID" withAsterisk placeholder="Bilkent ID" size="lg" radius="sm"
                            classNames={{
                              controls: "hidden",
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2", label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            key = {form.key("bilkentId")}
                            {...form.getInputProps("bilkentId")}
              />
              <PasswordInput label="Şifre" withAsterisk placeholder="Şifre" size="lg" radius="sm"
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-xl m-2",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            key = {form.key("password")}
                            {...form.getInputProps("password")}
              />
              <TextInput label="İsim Soyisim" withAsterisk placeholder="İsim Soyisim" size="lg" radius="sm"
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            key = {form.key("fullName")}
                            {...form.getInputProps("fullName")}
              />
              <TextInput label="E-Mail" withAsterisk placeholder="your@email.com" size="lg" radius="sm"
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            key = {form.key("email")}
                            {...form.getInputProps("email")}
              />
              <TextInput label="Telefon Numarası" withAsterisk placeholder="Tel No." size="lg" radius="sm"
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            key = {form.key("phoneNumber")}
                            {...form.getInputProps("phoneNumber")}
              />
              <Select label = "Bölüm" withAsterisk placeholder="Bölüm seç" size="lg" radius="sm"
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            data={Object.values(Department)}
                            key = {form.key("department")}
                            {...form.getInputProps("department")}
              />
              {/*Select breaks the even-odd ordering of the later elements for some reason.*/}
              <NumberInput label="Dönem" withAsterisk placeholder="Dönem" size="lg" radius="sm"
                            classNames={{
                              controls: "hidden",
                              root: "even:bg-blue-600 odd:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              error: "ml-2"
                            }}
                            key = {form.key("semester")}
                            {...form.getInputProps("semester")}
              />
              <Checkbox label="Sonraki dönem değişim programım var."
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 p-4",
                              body: "flex flex-row items-center",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800",
                              label: "align-middle text-gray-200 font-medium text-base",
                            }}
                            key = {form.key("hasExchange")}
                            {...form.getInputProps("hasExchange")}
              />
              <Textarea label="Tanıtım ofisini nasıl duyudunuz?" placeholder="Arkadaşımdan, Bilkent sitesinden vb..." size="lg" radius="sm" autosize
                            minRows={3}
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                            }}
                            key = {form.key("howDidYouHear")}
                            {...form.getInputProps("howDidYouHear")}
              />
              <Textarea label="Neden rehber olmak istiyorsunuz?" placeholder="Sebep..." size="lg" radius="sm" autosize
                            minRows={3}
                            classNames={{
                              root: "odd:bg-blue-600 even:bg-blue-700 pb-4",
                              wrapper: "p-2",
                              label: "text-white text-lg m-2 mb-0",
                              input: "hover:outline focus:outline focus:outline-blue-800 outline-4 outline-blue-800"
                            }}
                            key = {form.key("whyApply")}
                            {...form.getInputProps("whyApply")}
              />
          </ScrollArea>
          <br/>
          <hr/>
          <br/>
          <div className={"flex-1 p-2"}>
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
            <Button type={"submit"} size="lg" radius="md"
                    className={`text-center ${acceptedTerms && !registering ? "border-white" : "border-gray-700 brightness-75"} 
                    bg-blue-600 border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 
                    focus:outline-blue-800 hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300`}
                    disabled={!(acceptedTerms || registering)}>
                      <span className={`align-text-top text-2xl mr-2 transition-all iconify
              ${registering ? "solar--traffic-line-duotone animate-spin" : "solar--file-send-linear "}`}/>
              <span>Başvur</span>
            </Button>
          </div>
        </>
      }
    </form>
  )
};

export default RegisterForm;