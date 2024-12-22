import React, { useCallback, useEffect, useState } from 'react';
import { FairApplicationProps } from '../../types/designed';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput, Autocomplete } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';
import { HighschoolData } from '../../types/data';
import { City } from '../../types/enum';

const ApplicantInfoStage: React.FC<FairApplicationProps> = ({ applicationInfo, setApplicationInfo, warnings }) => {
  // Store complete highschool objects
  const [schools, setSchools] = useState<HighschoolData[]>([]);
  
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
        
        // Group schools by name to handle duplicates
        const schoolsByName = resJson.reduce((acc: { [key: string]: HighschoolData }, school: HighschoolData) => {
          if (!acc[school.name]) {
            acc[school.name] = school;
          }
          return acc;
        }, {});

        // Convert back to array
        const uniqueSchools = Object.values(schoolsByName);
        
        if (uniqueSchools.length === 0) {
          notifications.show({
            color: "yellow",
            title: "No Schools Found",
            message: "No high schools are available at the moment.",
          });
        }
  
        setSchools(uniqueSchools);
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

  // Get unique school names for the Autocomplete
  const schoolNames = schools.map(school => school.name);

  // Function to find the complete school object by name
  const findSchoolByName = (name: string): HighschoolData | undefined => {
    return schools.find(school => school.name === name);
  };

  return (
    <>
      <h1 className="header text-3xl font-semibold mb-2">
        Başvuru Yapan Kişi Hakkında Bilgiler <br /> (Rehber Öğretmen, Müdür Yardımcısı, Öğrenci vs.)
      </h1>
      <h2 className="subheader mb-4">Başvuruyu yapan kişi hakkındaki bilgileri giriniz.</h2>
      <form className="p-6 rounded-md teacher-info">
        <div className="mb-4">
          <TextInput
            type="text"
            label="Adınız"
            withAsterisk
            id="fullname"
            name="fullname"
            placeholder="Adınızı giriniz"
            error={warnings.empty_fields && isEmpty(applicationInfo.applicant.fullname) ? "Bu alanı boş bırakamazsınız." : false}
            maxLength={100}
            value={applicationInfo.applicant.fullname}
            onChange={(e) =>
              setApplicationInfo((prev) => ({
                ...prev,
                applicant: { ...prev.applicant, fullname: e.target.value },
              }))
            }
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
            error={warnings.not_email ? "Geçerli bir e-posta adresi girin." : false}
            maxLength={100}
            value={applicationInfo.applicant.email}
            onChange={(e) =>
              setApplicationInfo((prev) => ({
                ...prev,
                applicant: { ...prev.applicant, email: e.target.value },
              }))
            }
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
            error={warnings.not_phone_no ? "Geçerli bir telefon numarası girin." : false}
            maxLength={60}
            value={applicationInfo.applicant.phone}
            onChange={(e) =>
              setApplicationInfo((prev) => ({
                ...prev,
                applicant: { ...prev.applicant, phone: e.target.value },
              }))
            }
            required
          />
        </div>

        <div className="mb-4">
          <Autocomplete
            label="Okul"
            placeholder="Okulunuzun adını giriniz"
            data={schoolNames}
            limit={5}
            value={applicationInfo.highschool.name}
            onChange={(value) => {
              const selectedSchool = findSchoolByName(value);
              setApplicationInfo({
                ...applicationInfo,
                highschool: selectedSchool || {
                  id: "",
                  name: value,
                  location: "" as City,
                  priority: 1,
                  ranking: 0
                } as HighschoolData
              });
            }}
            leftSection={<IconSearch size={16} />}
            withAsterisk
            error={warnings.empty_fields && isEmpty(applicationInfo.highschool.name) ? "Bu alanı boş bırakamazsınız." : false}
          />
        </div>
      </form>
    </>
  );
};

export default ApplicantInfoStage;