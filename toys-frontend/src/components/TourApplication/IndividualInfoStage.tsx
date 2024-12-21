import React, { useEffect, useState } from 'react';
import { GroupApplicationStageProps, IndividualApplication, IndividualApplicationStageProps } from '../../types/designed';
import { SearchableSelect } from '../SearchableSelect/SearchableSelect';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput } from '@mantine/core';

const IndividualInfoStage: React.FC<IndividualApplicationStageProps> = ({ applicationInfo, setApplicationInfo, warnings }) => {

  const [schoolName, setSchoolName] = useState<string | null>(null)

  const schools = ["Hüseyin Avni Ulaş Anadolu Lisesi", "Bilkent Erzurum Laboratuvar Lisesi", "Arı Okulları", "Zart Zurt Okulları"]

  useEffect(() => {
    if (typeof schoolName == "string") {
      setApplicationInfo((appInfo) => ({
        ...appInfo,
          highschool: {
            ...appInfo.highschool,
            name: schoolName
          }
        }
      ))
    }
  }, [schoolName])


  return (
    <>
      <h1 className='header text-3xl font-semibold mb-2'>Öğrenci Bilgileri<br/></h1>
      <h2 className='subheader mb-4'>Tura katılacak öğrenci hakkındaki bilgileri giriniz.</h2>
      <form className="p-6 rounded-md teacher-info">

        <div className="mb-4">
          <TextInput
            type="text"
            label="İsim Soyisim"
            withAsterisk
            id="name"
            name="name"
            placeholder="Adınız ve Soyadınız"
            error={(warnings["empty_fields"] && isEmpty(applicationInfo.applicant.fullname)) ? "Bu alanı boş bırakamazsınız." : false}
            maxLength={100}
            value={applicationInfo.applicant["fullname"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                applicant: {
                  ...appInfo.applicant,
                  fullname: e.target.value
                }
              }))
            }}
            required
          />
        </div>

        <div className="mb-4">
          <TextInput
            type="email"
            label="E-Posta"
            withAsterisk
            id="email"
            name="email"
            placeholder="E-postanız"
            error={warnings["not_email"] ? "Geçerli bir e-posta adresi girin." : false}
            maxLength={100}
            value={applicationInfo.applicant["email"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                applicant: {
                  ...appInfo.applicant,
                  email: e.target.value
                }
              }))
            }}
            required
          />
        </div>

        <div className="mb-4">
          <TextInput
            type="tel"
            label="Telefon Numarası"
            withAsterisk
            id="phone"
            name="phone"
            placeholder="İletişim numaranız"
            error={warnings["not_phone_no"] ? "Geçerli bir telefon numarası girin." : false}
            maxLength={60}
            value={applicationInfo.applicant["phone"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                applicant: {
                  ...appInfo.applicant,
                  phone: e.target.value
                }
              }))
            }}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="school" className="block font-medium mb-2">Okul <span className='text-red-400'>*</span></label>
          <div className={`${(warnings["empty_fields"] && isEmpty(applicationInfo.highschool.name)) ? 'border-red-600 border-2 rounded-md' : 'border-gray-300'}`}>
            {applicationInfo.highschool.name && `Şu anki seçiminiz: ${applicationInfo.highschool.name}`}
            <SearchableSelect available_options={schools} value={schoolName} setValue={setSchoolName} placeholder='Okulunuzun adını giriniz' />
          </div>
        </div>
      </form>
    </>
  );
};

export default IndividualInfoStage;
