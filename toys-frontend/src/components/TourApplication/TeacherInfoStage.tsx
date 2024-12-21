import React, { useCallback, useEffect, useState } from 'react';
import { GroupApplicationStageProps } from '../../types/designed';
import { SearchableSelect } from '../SearchableSelect/SearchableSelect';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput, Select } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const TeacherInfoStage: React.FC<GroupApplicationStageProps> = ({ applicationInfo, setApplicationInfo, warnings }) => {
  const [schoolName, setSchoolName] = useState<string | null>(applicationInfo.highschool.name || null);
  const [schools, setSchools] = useState<string[]>([]);

  const getSchools = useCallback(async () => {
    const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
    const url = new URL(apiURL + "internal/analytics/high-schools/all");

    try {
      url.searchParams.append("auth", "");

      const res = await fetch(url, {
        method: "GET",
      });

      if (!res.ok) {
        notifications.show({
          color: "red",
          title: "Error",
          message: "Unable to fetch high schools.",
        });
      } else {
        const resText = await res.text();
        const resJson = JSON.parse(resText);

        const schoolNames = resJson.map((school: { name: string }) => school.name);

        if (schoolNames.length === 0) {
          notifications.show({
            color: "yellow",
            title: "No Schools Found",
            message: "No high schools are available at the moment.",
          });
        }

        setSchools(schoolNames);
      }
    } catch (e) {
      console.error("Error fetching schools:", e);
      notifications.show({
        color: "red",
        title: "Oops!",
        message: "Something went wrong. Please contact the site administrator.",
      });
    }
  }, []);

  useEffect(() => {
    getSchools();
  }, [getSchools]);

  useEffect(() => {
    if (applicationInfo.highschool.name) {
      setSchoolName(applicationInfo.highschool.name);
    }
  }, [applicationInfo.highschool.name]);

  useEffect(() => {
    if (typeof schoolName === "string") {
      setApplicationInfo((appInfo) => ({
        ...appInfo,
        highschool: {
          ...appInfo.highschool,
          name: schoolName
        }
      }));
    }
  }, [schoolName, setApplicationInfo]);

  return (
    <>
      <h1 className='header text-3xl font-semibold mb-2'>Grup Lideri Bilgileri <br /> (Rehber Öğretmen, Müdür Yardımcısı vs.)</h1>
      <h2 className='subheader mb-4'>Grup lideri hakkındaki bilgileri giriniz.</h2>
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
                  fullname: e.target.value,
                },
              }));
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
                  email: e.target.value,
                },
              }));
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
                  phone: e.target.value,
                },
              }));
            }}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="school" className="block font-medium mb-2">Okul <span className='text-red-400'>*</span></label>
          <div className={`${(warnings["empty_fields"] && isEmpty(applicationInfo.highschool.name)) ? 'border-red-600 border-2 rounded-md' : 'border-gray-300'}`}>
            {schoolName && `Şu anki seçiminiz: ${schoolName}`}
            <SearchableSelect 
              available_options={schools} 
              value={schoolName} 
              setValue={setSchoolName} 
              placeholder='Okulunuzun adını giriniz' 
            />
          </div>
        </div>

        <div className="mb-4">
          <Select
            label="Rolünüz"
            placeholder="Öğrenci"
            data={["Öğrenci", "Görevli, Öğretmen vs."]}
            onChange={(_value) => {
              const englishValue = _value === "Öğrenci" ? "STUDENT" : _value === "Görevli, Öğretmen vs." ? "TEACHER" : "";
              setApplicationInfo((appInfo) => ({
                ...appInfo,
                applicant: {
                  ...appInfo.applicant,
                  role: englishValue,
                },
              }));
            }}
          />
        </div>
      </form>
    </>
  );
};

export default TeacherInfoStage;