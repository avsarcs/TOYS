import React, { useState } from 'react';
import { Button, Alert } from '@mantine/core';
import { IconChevronRight, IconChevronLeft, IconAlertCircle } from "@tabler/icons-react"
import { Stepper } from '@mantine/core';
import "./IndividualTourApplication.css";
import { IndividualApplication } from '../../types/designed';
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';

import { useNavigate } from 'react-router-dom';

import IndividualInfoStage from '../../components/TourApplication/IndividualInfoStage';
import TimeSlotStage from '../../components/TourApplication/TimeSlotStage';
import MajorSelectionStage from '../../components/TourApplication/MajorSelectionStage';
import IndividualNotesStage from '../../components/TourApplication/IndividualNotesStage';


const IndividualTourApplication: React.FC = () => {

    const [applicationInfo, setApplicationInfo] = useState<IndividualApplication>({
        "highschool_name": "",
        "requested_times": [],
        "requested_majors": ["", "", ""],
        "visitor_count": -1,
        "applicant": {
            "fullname": "",
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

        if (currentStage == 3 && validateStage4()) {
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
    })

    const clearWarnings = () => {
        for (const field in warnings) {
            setWarnings((warnings) => ({
                ...warnings,
                [field]: false
            }))
        }
    }

    // Validate if Stage 1 is done
    const validateStage1 = () => {
        let stagePass = true
        let empty_fields = false
        const firstStageFields = ["fullname", "email", "phone"]
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

        if (!isEmail(applicationInfo.applicant["email"])) {
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

        if (!isMobilePhone(applicationInfo.applicant["phone"])) {
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

    // stage2 is valid all the time
    const validateStage2 = () => {
        return true
    }

    // Validate if stage 3 is done.
    const validateStage3 = () => {
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

    // Validate if stage 4 is done.
    const validateStage4 = () => {
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
        if (validateStage4())
            navigate("/application-success")
    }

    return (
        <>
            <div className='application-wrapper p-8'>
                <Stepper active={currentStage} onStepClick={attemptStageChange}>
                    <Stepper.Step label="1. Aşama" description="Hakkınızda">
                    </Stepper.Step>
                    <Stepper.Step label="2. Aşama" description="Bölüm Seçimleriniz">
                    </Stepper.Step>
                    <Stepper.Step label="3. Aşama" description="Zaman Seçimleriniz">
                    </Stepper.Step>
                    <Stepper.Step label="4. Aşama" description="Notlarınız">
                    </Stepper.Step>
                    <Stepper.Completed>
                        -
                    </Stepper.Completed>
                </Stepper>

                <div className='mt-4 flex-col content-center'>
                    {Object.values(warnings).some(value => value) &&
                        <Alert variant="light" color="red" title="Bu aşamayı tamamlayın" icon={<IconAlertCircle />} className='my-4'>
                            Sonraki aşamalara geçebilmek için bu aşamadaki tüm gerekli bilgileri doğru doldurmanız gerekmektedir.
                            {warnings["empty_fields"] && (<><br /> <strong>Bıraktığınız boş alanları doldurun.</strong></>)}
                            {warnings["not_email"] && (<><br />  <strong>Geçerli bir e-posta adresi girin.</strong></>)}
                            {warnings["not_phone_no"] && (<><br />  <strong>Geçerli bir telefon numarası girin.</strong></>)}
                            {warnings["not_enough_dates"] && (<><br />  <strong>En az bir zaman aralığı seçin.</strong></>)}<br />
                        </Alert>
                    }
                    {currentStage == 0 && <IndividualInfoStage
                        applicationInfo={applicationInfo}
                        setApplicationInfo={setApplicationInfo}
                        warnings={warnings}
                    />}

                    {currentStage == 1 && <MajorSelectionStage
                        applicationInfo={applicationInfo}
                        setApplicationInfo={setApplicationInfo}
                        warnings={warnings}
                    />}
                    {currentStage == 2 && <TimeSlotStage
                        applicationInfo={applicationInfo}
                        setApplicationInfo={setApplicationInfo}
                        warnings={warnings}
                    />}
                    {currentStage == 3 && <IndividualNotesStage
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

                    {currentStage < 3 &&
                        <Button
                            className="fat-button bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center px-4 py-2"
                            onClick={() => { attemptStageChange(currentStage + 1) }}
                        >
                            Sonraki Aşama
                            <IconChevronRight size={16} className="ml-2" />
                        </Button>
                    }
                    {currentStage == 3 &&
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

export default IndividualTourApplication;