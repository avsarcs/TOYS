import React, { useState } from 'react';
import { Button, Alert, Modal, Text } from '@mantine/core';
import { IconChevronRight, IconChevronLeft, IconAlertCircle, IconCircleCheck, IconX } from "@tabler/icons-react"
import { Stepper } from '@mantine/core';
import "./GroupTourApplication.css";
import { GroupApplication } from '../../types/designed';
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Container, Title, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';
import TeacherInfoStage from '../../components/TourApplication/TeacherInfoStage';
import TimeSlotStage from '../../components/TourApplication/TimeSlotStage';
import NotesStage from '../../components/TourApplication/NotesStage';
import {City} from "../../types/enum.ts";
const TOUR_APPLICATION_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/tour")

export const GroupTourApplication: React.FC = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userContext = useContext(UserContext);

  const [applicationInfo, setApplicationInfo] = useState<GroupApplication>({
    "highschool": {
      "id": "", "name": "", "location": "" as City, "priority": 1, "ranking": 1
    },
    "requested_times": [],
    "visitor_count": -1,
    "applicant": {
      "fullname": "",
      "role": "",
      "email": "",
      "phone": "",
      "notes": ""
    }
  })

  const [currentStage, setCurrentStage] = useState(0)

  const attemptStageChange = (newStage: number) => {
    if (newStage < currentStage) {
      setCurrentStage(newStage)
      return
    }

    if (currentStage == 0 && validateStage1()) {
      setCurrentStage(newStage)
    }

    if (currentStage == 1 && validateStage2()) {
      setCurrentStage(newStage)
    }

    if (currentStage == 2 && validateStage3()) {
      setCurrentStage(newStage)
    }
  }

  const [warnings, setWarnings] = useState({
    "empty_fields": false,
    "not_email": false,
    "not_phone_no": false,
    "not_enough_dates": false,
    "no_student_count": false,
    "invalid_student_count": false
  })
  
  const [, setIsStage3Valid] = useState(false)

  // Validate if Stage 1 is done
  const validateStage1 = () => {
    let stagePass = true
    let empty_fields = false
    const firstStageFields = ["fullname", "email", "phone", "role"]
    for (const field of firstStageFields) {
      // @ts-expect-error key coming from applicationInfo, there will be no conflict
      if (isEmpty(applicationInfo.applicant[field], { ignore_whitespace: true }) || isEmpty(applicationInfo.highschool.name)) {
        stagePass = false
        setWarnings((warnings) => ({
          ...warnings,
          "empty_fields": true
        }))
        empty_fields = true
      }
    }

    if (!empty_fields) {
      setWarnings((warnings) => ({
        ...warnings,
        "empty_fields": false
      }))
    }

    if (!isEmail(applicationInfo["applicant"]["email"])) {
      setWarnings((warnings) => ({
        ...warnings,
        "not_email": true
      }))
      stagePass = false
    } else {
      setWarnings((warnings) => ({
        ...warnings,
        "not_email": false
      }))
    }

    if (!isMobilePhone(applicationInfo["applicant"]["phone"])) {
      setWarnings((warnings) => ({
        ...warnings,
        "not_phone_no": true
      }))
      stagePass = false
    } else {
      setWarnings((warnings) => ({
        ...warnings,
        "not_phone_no": false
      }))
    }

    return stagePass
  }

  // Validate if stage 2 is done.
  const validateStage2 = () => {
    if (applicationInfo.requested_times.length > 0) {
      setWarnings((warnings) => ({
        ...warnings,
        "not_enough_dates": false
      }))
      return true
    } else {
      setWarnings((warnings) => ({
        ...warnings,
        "not_enough_dates": true
      }))
      return false
    }
  }

  // Validate if stage 3 is done.
  const validateStage3 = () => {
    let isValid = true;
    
    if (applicationInfo.visitor_count === -1) {
      setWarnings(prev => ({
        ...prev,
        "no_student_count": true,
        "invalid_student_count": false
      }));
      isValid = false;
    } else if (applicationInfo.visitor_count <= 0) {
      setWarnings(prev => ({
        ...prev,
        "no_student_count": false,
        "invalid_student_count": true
      }));
      isValid = false;
    } else {
      setWarnings(prev => ({
        ...prev,
        "no_student_count": false,
        "invalid_student_count": false
      }));
    }
    
    setIsStage3Valid(isValid);
    return isValid;
  }

  // Submit form function
  const attemptSubmitForm = async () => {
    if (validateStage3() && !isSubmitting) {
      setIsSubmitting(true);
      const applicationUrl = new URL(TOUR_APPLICATION_URL);
      applicationUrl.searchParams.append("auth", await userContext.getAuthToken());
      
      try {
        const res = await fetch(applicationUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(applicationInfo)
        });

        if (res.status === 200) {
          setShowSuccessModal(true);
        } else {
          setShowErrorModal(true);
          setIsSubmitting(false);
        }
      } catch (error) {
        setShowErrorModal(true);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Modal 
        opened={showSuccessModal} 
        onClose={() => {}} 
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        centered
      >
        <div className="text-center py-4">
          <IconCircleCheck size={48} className="text-green-500 mx-auto mb-4" />
          <Text size="xl" fw={700} className="text-green-700">
            Tur Başvurunuz Başarıyla İletildi!
          </Text>
          <Text className='text-green-600'>
            Size geri dönüş yapacağız.
          </Text>
        </div>
      </Modal>

      <Modal 
        opened={showErrorModal} 
        onClose={() => setShowErrorModal(false)}
        centered
      >
        <div className="text-center py-4">
          <IconX size={48} className="text-red-500 mx-auto mb-4" />
          <Text size="xl" fw={700} className="text-red-700 mb-2">
            Başvuru İletilirken Bir Hata Oluştu
          </Text>
          <Text size="sm" className="text-gray-600">
            Lütfen daha sonra tekrar deneyiniz.
          </Text>
        </div>
      </Modal>

      <div className='application-wrapper p-8'>
        <Stepper active={currentStage} onStepClick={attemptStageChange}>
          <Stepper.Step label="1. Aşama" description="Grup Lideri Bilgisi">
          </Stepper.Step>
          <Stepper.Step label="2. Aşama" description="Uygun Zamanlarınız">
          </Stepper.Step>
          <Stepper.Step label="3. Aşama" description="Notlarınız">
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <div className='mt-4 flex-col content-center'>
          {Object.values(warnings).some(value => value) &&
            <Alert variant="light" color="red" title="Bu aşamayı tamamlayın" icon={<IconAlertCircle />} className='my-4'>
              Sonraki aşamalara geçebilmek için bu aşamadaki tüm gerekli bilgileri doğru doldurmanız gerekmektedir.
              {warnings["empty_fields"] && (<><br /> <strong>Bıraktığınız boş alanları doldurun.</strong></>)}
              {warnings["not_email"] && (<><br />  <strong>Geçerli bir e-posta adresi girin.</strong></>)}
              {warnings["not_phone_no"] && (<><br />  <strong>Geçerli bir telefon numarası girin.</strong></>)}
              {warnings["not_enough_dates"] && (<><br />  <strong>En az bir zaman aralığı seçin.</strong></>)}
              {warnings["no_student_count"] && (<><br />  <strong>Lütfen öğrenci sayısını giriniz.</strong></>)}
              {warnings["invalid_student_count"] && (<><br />  <strong>Öğrenci sayısı 0'dan büyük olmalıdır.</strong></>)}
            </Alert>
          }
          {currentStage == 0 && <TeacherInfoStage
            applicationInfo={applicationInfo}
            setApplicationInfo={setApplicationInfo}
            warnings={warnings}
          />}

          {currentStage == 1 && <TimeSlotStage
            applicationInfo={applicationInfo}
            setApplicationInfo={setApplicationInfo}
            warnings={warnings}
          />}

          {currentStage == 2 && <NotesStage
            applicationInfo={applicationInfo}
            setApplicationInfo={setApplicationInfo}
            warnings={warnings}
          />}
        </div>

        <div className='flex'>
          {currentStage > 0 &&
            <Button
              className="fat-button bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center px-4 py-2 mr-2"
              onClick={() => { attemptStageChange(currentStage - 1) }}
            >
              <IconChevronLeft size={16} className="mr-2" />
              Önceki Aşama
            </Button>
          }

          {currentStage < 2 &&
            <Button
              className="fat-button bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center px-4 py-2"
              onClick={() => { attemptStageChange(currentStage + 1) }}
            >
              Sonraki Aşama
              <IconChevronRight size={16} className="ml-2" />
            </Button>
          }
          {currentStage == 2 &&
            <Button
              className="fat-button bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center px-4 py-2"
              onClick={attemptSubmitForm}
              disabled={isSubmitting}
            >
              Başvuruyu Tamamlayın
            </Button>
          }
        </div>
        
        <div style={{ position: 'fixed', right: '10px', bottom: '10px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px' }}>
          <Container size="sm">
            <Title order={2} style={{ marginBottom: '20px', textAlign: 'center', color: '#ecf0f1' }}>
              Bize Ulaşın
            </Title>
            <Stack gap="md">
              <Group>
                <ThemeIcon variant="light" size={40} style={{ backgroundColor: '#34495e' }}>
                  <IconMail size={24} color="#ecf0f1" />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={500} style={{ color: '#ecf0f1' }}>
                    Email
                  </Text>
                  <Text size="md" style={{ color: '#bdc3c7' }}>iletisim@ornek.com</Text>
                </div>
              </Group>
              <Group>
                <ThemeIcon variant="light" size={40} style={{ backgroundColor: '#34495e' }}>
                  <IconPhone size={24} color="#ecf0f1" />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={500} style={{ color: '#ecf0f1' }}>
                    Telefon
                  </Text>
                  <Text size="md" style={{ color: '#bdc3c7' }}>+90 555 555 55 55</Text>
                </div>
              </Group>
              <Group>
                <ThemeIcon variant="light" size={40} style={{ backgroundColor: '#34495e' }}>
                  <IconUser size={24} color="#ecf0f1" />
                </ThemeIcon>
                <div>
                  <Text size="lg" fw={500} style={{ color: '#ecf0f1' }}>
                    İlgili Kişi
                  </Text>
                  <Text size="md" style={{ color: '#bdc3c7' }}>Ahmet Yılmaz</Text>
                </div>
              </Group>
            </Stack>
          </Container>
        </div>
      </div>
    </>
  );
};

export default GroupTourApplication;