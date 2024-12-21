import React, { useCallback, useEffect, useState } from 'react';
import { GroupApplicationStageProps } from '../../types/designed';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput, Select, Autocomplete } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';
import { HighschoolData } from '../../types/data';

const TeacherInfoStage: React.FC<GroupApplicationStageProps> = ({ applicationInfo, setApplicationInfo, warnings }) => {
  const [schoolName, setSchoolName] = useState<string>(applicationInfo.highschool.name || '');
  const [schools, setSchools] = useState<HighschoolData[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);

  // Create a display string for a school that includes location if needed to differentiate
  const createSchoolDisplayName = (school: HighschoolData, allSchools: HighschoolData[]): string => {
    const duplicateNames = allSchools.filter(s => s.name === school.name);
    if (duplicateNames.length > 1) {
      return `${school.name} (${school.location})`;
    }
    return school.name;
  };

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
        const resJson: HighschoolData[] = JSON.parse(resText);

        setSchools(resJson);
        
        // Create unique display names for schools
        const uniqueOptions = resJson.map(school => createSchoolDisplayName(school, resJson));
        setSchoolOptions(Array.from(new Set(uniqueOptions)));

        if (resJson.length === 0) {
          notifications.show({
            color: "yellow",
            title: "No Schools Found",
            message: "No high schools are available at the moment.",
          });
        }

        // Update current school display name if exists
        if (applicationInfo.highschool.name) {
          const currentSchool = resJson.find(s => s.name === applicationInfo.highschool.name);
          if (currentSchool) {
            setSchoolName(createSchoolDisplayName(currentSchool, resJson));
          }
        }
      }
    } catch (e) {
      console.error("Error fetching schools:", e);
      notifications.show({
        color: "red",
        title: "Oops!",
        message: "Something went wrong. Please contact the site administrator.",
      });
    }
  }, [applicationInfo.highschool.name]);

  useEffect(() => {
    getSchools();
  }, [getSchools]);

  const handleSchoolChange = (value: string) => {
    setSchoolName(value);
    
    if (value === '') {
      // Reset highschool data if no school is selected
      setApplicationInfo(prevInfo => ({
        ...prevInfo,
        highschool: {
          id: '',
          name: '',
          location: '',
          priority: 1,
          ranking: 0
        }
      }));
      return;
    }

    // Find the school by matching either its name directly or the display name
    const selectedSchool = schools.find(school => {
      const displayName = createSchoolDisplayName(school, schools);
      return displayName === value || school.name === value;
    });
    
    if (selectedSchool) {
      setApplicationInfo(prevInfo => ({
        ...prevInfo,
        highschool: selectedSchool
      }));
    }
  };

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
            value={applicationInfo.applicant.fullname}
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
            value={applicationInfo.applicant.email}
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
            value={applicationInfo.applicant.phone}
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
          <Autocomplete
            limit={5}
            label="Okul"
            placeholder="Okulunuzun adını giriniz"
            leftSection={<IconSearch size="1rem" />}
            data={schoolOptions}
            value={schoolName}
            onChange={handleSchoolChange}
            error={(warnings["empty_fields"] && isEmpty(applicationInfo.highschool.name)) ? "Bu alanı boş bırakamazsınız." : false}
            withAsterisk
          />
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