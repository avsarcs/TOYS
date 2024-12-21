import React, { useState } from 'react';
import { Button, Alert } from '@mantine/core';
import { IconChevronRight, IconChevronLeft, IconAlertCircle } from "@tabler/icons-react"
import { Stepper } from '@mantine/core';
import "./IndividualTourApplication.css";
import { IndividualApplication } from '../../types/designed';
import isEmail from 'validator/lib/isEmail'
import isMobilePhone from 'validator/lib/isMobilePhone';
import isEmpty from 'validator/lib/isEmpty';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Container, Title, Text, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';

import { useNavigate } from 'react-router-dom';

import IndividualInfoStage from '../../components/TourApplication/IndividualInfoStage';
import TimeSlotStage from '../../components/TourApplication/TimeSlotStage';
import MajorSelectionStage from '../../components/TourApplication/MajorSelectionStage';
import IndividualNotesStage from '../../components/TourApplication/IndividualNotesStage';
const TOUR_APPLICATION_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/tour")


const IndividualTourApplication: React.FC = () => {

    const userContext = useContext(UserContext);

    const [applicationInfo, setApplicationInfo] = useState<IndividualApplication>({
        "highschool": {
            "id": "id of the highschool", "name": "Ankara Fen", "location": "Ankara", "priority": 1
        },
        "requested_times": [],
        "requested_majors": ["", "", ""],
        "visitor_count": -1,
        "applicant": {
            "fullname": "",
            "role": "student",
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

    const attemptSubmitForm = async () => {
        // Do whatever you need to submit applicationInfo to the backend.
        if (validateStage3()) {

            const applicationUrl = new URL(TOUR_APPLICATION_URL)
            
            const res = await fetch(applicationUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(applicationInfo)
            })
      
            if (res.status == 200)
              navigate("/application-success")
          }

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
                <div style={{ position: 'fixed', right: '10px', bottom: '10px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px' }}>
                                <Container size="sm">
                                    <Title order={2} style={{ marginBottom: '20px', textAlign: 'center', color: '#ecf0f1' }}>
                                        Bize Ulaşın
                                    </Title>
                                    <Stack spacing="md">
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

export default IndividualTourApplication;