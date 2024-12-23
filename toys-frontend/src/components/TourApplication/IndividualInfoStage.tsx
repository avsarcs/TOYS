import React, { useCallback, useEffect, useState } from 'react';
import { IndividualApplicationStageProps } from '../../types/designed';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput, Autocomplete } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons-react';
import { HighschoolData } from '../../types/data';
import { HoverCard, Text, Group } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const IndividualInfoStage: React.FC<IndividualApplicationStageProps> = ({
  applicationInfo,
  setApplicationInfo,
  warnings
}) => {
  const [schools, setSchools] = useState<HighschoolData[]>([]);
  const [searchInput, setSearchInput] = useState('');

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

        const schoolsByName = resJson.reduce((acc: { [key: string]: HighschoolData }, school: HighschoolData) => {
          if (!acc[school.name]) {
            acc[school.name] = school;
          }
          return acc;
        }, {});

        const uniqueSchools: HighschoolData[] = Object.values(schoolsByName);

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

  const schoolNames = schools.map(school => school.name);

  const handleSchoolSelect = (value: string) => {
    const selectedSchool = schools.find(school => school.name === value);
    if (selectedSchool) {
      setApplicationInfo(prev => ({
        ...prev,
        highschool: selectedSchool
      }));
    }
    setSearchInput(value);
  };

  const validateStage = () => {
    const isValidSchool = schools.some(school => school.name === applicationInfo.highschool.name);
    return isValidSchool;
  };

  return (
    <>
      <h1 className='header text-3xl font-semibold mb-2'>Öğrenci Bilgileri<br /></h1>
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
            error={warnings.empty_fields && isEmpty(applicationInfo.applicant.fullname) ? "Bu alanı boş bırakamazsınız." : false}
            maxLength={100}
            value={applicationInfo.applicant.fullname}
            onChange={(e) => {
              setApplicationInfo((prev) => ({
                ...prev,
                applicant: { ...prev.applicant, fullname: e.target.value },
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
            error={warnings.not_email ? "Geçerli bir e-posta adresi girin." : false}
            maxLength={100}
            value={applicationInfo.applicant.email}
            onChange={(e) => {
              setApplicationInfo((prev) => ({
                ...prev,
                applicant: { ...prev.applicant, email: e.target.value },
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
            error={warnings.not_phone_no ? "Geçerli bir telefon numarası girin." : false}
            maxLength={60}
            value={applicationInfo.applicant.phone}
            onChange={(e) => {
              setApplicationInfo((prev) => ({
                ...prev,
                applicant: { ...prev.applicant, phone: e.target.value },
              }));
            }}
            required
          />
        </div>

        <div className="mb-4">
          <Autocomplete
            label="Okul"
            placeholder="Okulunuzun adını giriniz"
            data={schoolNames}
            limit={5}
            value={searchInput.split(' ').map(word => word.charAt(0).toLocaleUpperCase("TR") + word.slice(1).toLocaleLowerCase("TR")).join(' ')}
            onChange={handleSchoolSelect}
            leftSection={<IconSearch size={16} />}
            withAsterisk
            error={
              (warnings.empty_fields && isEmpty(searchInput)) ? "Bu alanı boş bırakamazsınız." :
                (!isEmpty(searchInput) && !validateStage()) ? "Lütfen listeden geçerli bir okul seçin" :
                  false
            }
          />

          <HoverCard width={350} shadow="md">
            <HoverCard.Target>
              <Group gap="xs" mt="xs">
                <Text size="xs" className="text-blue-600 cursor-pointer">
                  Liseniz burda yok mu?
                </Text>
                <IconInfoCircle size={12} className="text-blue-600" />
              </Group>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                Liseniz bu listede yoksa eklenmesi için ornek@email.com'a istek atın. <br />
                Şu an için herhangi bir liseyi seçip son aşamada notlarınıza asıl lisenizi yazabilirsiniz.
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </div>
      </form>
    </>
  );
};

export default IndividualInfoStage;