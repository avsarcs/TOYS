import React, { useEffect, useState } from 'react';
import { GroupApplicationStageProps } from '../../types/designed';
import { SearchableSelect } from '../SearchableSelect/SearchableSelect';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput } from '@mantine/core';

const TeacherInfoStage: React.FC<GroupApplicationStageProps> = ({ applicationInfo, setApplicationInfo, warnings }) => {

  const [schoolName, setSchoolName] = useState<string | null>(null)

  const schools = ["Hüseyin Avni Ulaş Anadolu Lisesi", "Bilkent Erzurum Laboratuvar Lisesi", "Arı Okulları", "Zart Zurt Okulları"]

  useEffect(() => {
    if (typeof schoolName == "string") {
      setApplicationInfo((appInfo) => ({
        ...appInfo,
        group_leader: {
          ...appInfo.group_leader,
          school: schoolName
        }
      }))
    }
  }, [schoolName])


  return (
    <>
      <h1 className='header text-3xl font-semibold mb-2'>Grup Lideri Bilgileri <br /> (Rehber Öğretmen, Müdür Yardımcısı vs.)</h1>
      <h2 className='subheader mb-4'>Grup lideri hakkındaki bilgileri giriniz.</h2>
      <form className="p-6 rounded-md teacher-info">

        <div className="mb-4">
          <TextInput
            type="text"
            label="İsim"
            withAsterisk
            id="name"
            name="name"
            placeholder="Adınız"
            error={warnings["empty_fields"] ? "Bu alanı boş bırakamazsınız." : false}
            maxLength={100}
            value={applicationInfo["group_leader"]["name"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                group_leader: {
                  ...appInfo.group_leader,
                  name: e.target.value,
                },
              }))
            }}
            required
          />
        </div>

        <div className="mb-4">
          <TextInput
            type="text"
            label="Soyisim"
            withAsterisk
            id="surname"
            name="surname"
            placeholder="Soyadınız"
            error={warnings["empty_fields"] ? "Bu alanı boş bırakamazsınız." : false}
            maxLength={100}
            value={applicationInfo["group_leader"]["surname"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                group_leader: {
                  ...appInfo.group_leader,
                  surname: e.target.value,
                },
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
            value={applicationInfo["group_leader"]["email"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                group_leader: {
                  ...appInfo.group_leader,
                  email: e.target.value,
                },
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
            value={applicationInfo["group_leader"]["phone"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                group_leader: {
                  ...appInfo.group_leader,
                  phone: e.target.value,
                },
              }))
            }}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="school" className="block font-medium mb-2">Okul <span className='text-red-400'>*</span></label>
          <div className={`${(warnings["empty_fields"] && isEmpty(applicationInfo["group_leader"]["school"])) ? 'border-red-600 border-2 rounded-md' : 'border-gray-300'}`}>
            {applicationInfo["group_leader"]["school"] && `Şu anki seçiminiz: ${applicationInfo["group_leader"]["school"]}`}
            <SearchableSelect available_options={schools} value={schoolName} setValue={setSchoolName} placeholder='Okulunuzun adını giriniz' />
          </div>
        </div>

        <div className="mb-4">
          <TextInput
            type="text"
            label="Rolünüz"
            withAsterisk
            id="role"
            name="role"
            placeholder="Rolünüz; rehber öğretmen, müdür yardımcısı, öğretmen vs."
            error={warnings["empty_fields"] ? "Bu alanı boş bırakamazsınız." : false}
            maxLength={200}
            value={applicationInfo["group_leader"]["role"]}
            onChange={(e) => {
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                group_leader: {
                  ...appInfo.group_leader,
                  role: e.target.value,
                },
              }))
            }}
            required
          />
        </div>
      </form>
    </>
  );
};

export default TeacherInfoStage;
