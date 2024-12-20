import React, { useEffect, useState } from 'react';
import { FairApplicationProps } from '../../types/designed';
import { SearchableSelect } from '../SearchableSelect/SearchableSelect';
import isEmpty from 'validator/lib/isEmpty';
import { TextInput } from '@mantine/core';

const ApplicantInfoStage: React.FC<FairApplicationProps> = ({ applicationInfo, setApplicationInfo, warnings }) => {
  const [schoolName, setSchoolName] = useState<string | null>(applicationInfo.applicant.school.name || null);

  const schools = ["Hüseyin Avni Ulaş Anadolu Lisesi", "Bilkent Erzurum Laboratuvar Lisesi", "Arı Okulları", "Zart Zurt Okulları"];

  // Sync `schoolName` with `applicationInfo` on initial render
  useEffect(() => {
    if (applicationInfo.applicant.school.name) {
      setSchoolName(applicationInfo.applicant.school.name);
    }
  }, [applicationInfo.applicant.school.name]);

  // Update applicationInfo when `schoolName` changes
  useEffect(() => {
    if (typeof schoolName === 'string') {
      setApplicationInfo((prev) => ({
        ...prev,
        applicant: {
          ...prev.applicant,
          role: "STUDENT",
          school: {
            ...prev.applicant.school,
            name: schoolName,
          },
        },
      }));
    }
  }, [schoolName, setApplicationInfo]);

  return (
    <>
      <h1 className="header text-3xl font-semibold mb-2">
        Başvuru Yapan Kişi Hakkında Bilgiler <br /> (Rehber Öğretmen, Müdür Yardımcısı, Öğrenci vs.)
      </h1>
      <h2 className="subheader mb-4">Başvuruyu yapan kişi hakkındaki bilgileri giriniz.</h2>
      <form className="p-6 rounded-md teacher-info">
        {/* Name Field */}
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

        {/* Email Field */}
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

        {/* Phone Field */}
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

        {/* School Selection */}
        <div className="mb-4">
          <label htmlFor="school" className="block font-medium mb-2">
            Okul <span className="text-red-400">*</span>
          </label>
          <div
            className={`${
              warnings.empty_fields && isEmpty(applicationInfo.applicant.school.name)
                ? "border-red-600 border-2 rounded-md"
                : "border-gray-300"
            }`}
          >
            {schoolName && `Şu anki seçiminiz: ${schoolName}`}
            <SearchableSelect
              available_options={schools}
              value={schoolName}
              setValue={setSchoolName}
              placeholder="Okulunuzun adını giriniz"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default ApplicantInfoStage;
