import React, { useState } from 'react';
import { Button, Alert } from '@mantine/core';
import { IconChevronRight, IconChevronLeft, IconAlertCircle } from "@tabler/icons-react"
import { Stepper } from '@mantine/core';
import "./GroupTourApplication.css";
import { GroupApplication } from '../../types/designed';
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';

import { useNavigate } from 'react-router-dom';

import TeacherInfoStage from '../../components/TourApplication/TeacherInfoStage';
import TimeSlotStage from '../../components/TourApplication/TimeSlotStage';
import NotesStage from '../../components/TourApplication/NotesStage';


export const GroupTourApplication: React.FC = () => {

  const [applicationInfo, setApplicationInfo] = useState<GroupApplication>({
    "highschool_name": "",
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

  /**************
   * VALIDATION
  **************/

  const [warnings, setWarnings] = useState({
    "empty_fields": false,
    "not_email": false,
    "not_phone_no": false,
    "not_enough_dates": false,
    "no_student_count": false
  })

  // Validate if Stage 1 is done
  const validateStage1 = () => {
    let stagePass = true
    let empty_fields = false
    const firstStageFields = ["fullname", "email", "phone", "role"]
    for (const field of firstStageFields) {
      // @ts-expect-error key coming from applicationInfo, there will be no conflict
      if (isEmpty(applicationInfo.applicant[field], { ignore_whitespace: true }) || isEmpty(applicationInfo.highschool_name)) {

        stagePass = false
        setWarnings((warnings) => ({
          ...warnings,
          "empty_fields": true
        }))

        empty_fields = true
      }
    }

    if (!empty_fields) {
      console.log("empty_fields is being set to false")
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
    if (applicationInfo.visitor_count < 1) {
      setWarnings((warnings) => ({
        ...warnings,
        "no_student_count": true
      }))
      return false
    }
    else {
      setWarnings((warnings) => ({
        ...warnings,
        "no_student_count": false
      }))
      return true
    }
  }

  const navigate = useNavigate()
  // Placeholder function
  const attemptSubmitForm = () => {
    // Do whatever the fuck you need to submit applicationInfo to the backend.
    if (validateStage3()) {
      navigate("/application-success")
    }

  }

  return (
    <>
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
              {warnings["no_student_count"] && (<><br />  <strong>0'dan büyük bir öğrenci sayısı giriniz.</strong></>)} <br />
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
              className="fat-button bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center px-4 py-2"
              onClick={() => { attemptSubmitForm() }}
            >
              Başvuruyu Tamamlayın
            </Button>
          }
        </div>
      </div>
    </>
  );
};

export default GroupTourApplication;