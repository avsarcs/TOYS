import React, { useState, useContext } from "react";
import { Button, Alert } from "@mantine/core";
import { IconChevronRight, IconChevronLeft, IconAlertCircle } from "@tabler/icons-react";
import { Stepper } from "@mantine/core";
import "./FairApplication.css";
import { FairApplicationModel } from "../../types/designed";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import isEmpty from "validator/lib/isEmpty";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../../context/UserContext";
import ApplicantInfoStage from "../../components/FairApplication/ApplicantInfoStage";
import TimeSelectionStage from "../../components/FairApplication/TimeSelectionStage";
import NotesStage from "../../components/FairApplication/NotesStage";

const FAIR_APPLICATION_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/fair");

export const FairApplication: React.FC = () => {
    const [applicationInfo, setApplicationInfo] = useState<FairApplicationModel>({
        applicant: {
            fullname: "",
            email: "",
            phone: "",
            role: "",
            school: {
                id: "",
                name: "",
                location: "",
                priority: 1,
                ranking: 1,
            },
            notes: "",
        },
        start_time: "",
        end_time: "",
        fair_name: "",
    });

    const [currentStage, setCurrentStage] = useState(0);
    const [warnings, setWarnings] = useState({
        empty_fields: false,
        not_email: false,
        not_phone_no: false,
        time_in_past: false,
        end_before_start: false,
    });
    const [isStage2Valid, setIsStage2Valid] = useState(false);

    const navigate = useNavigate();

    const attemptStageChange = (newStage: number) => {
        if (newStage < currentStage) {
            setCurrentStage(newStage);
            return;
        }

        if (currentStage === 0 && validateStage1()) {
            setCurrentStage(newStage);
        } else if (currentStage === 1) {
            // Validate the Time Selection Stage
            const startTime = new Date(applicationInfo.start_time);
            const endTime = new Date(applicationInfo.end_time);
            const now = new Date();

            if (!applicationInfo.start_time || !applicationInfo.end_time) {
                setWarnings((prev) => ({
                    ...prev,
                    empty_fields: true,
                }));
            } else if (startTime < now) {
                setWarnings((prev) => ({
                    ...prev,
                    empty_fields: false,
                    time_in_past: true,
                }));
            } else if (endTime <= startTime) {
                setWarnings((prev) => ({
                    ...prev,
                    empty_fields: false,
                    time_in_past: false,
                    end_before_start: true,
                }));
            } else {
                setWarnings((prev) => ({
                    ...prev,
                    empty_fields: false,
                    time_in_past: false,
                    end_before_start: false,
                }));
                setIsStage2Valid(true);
                setCurrentStage(newStage);
            }
        }
    };

    const validateStage1 = () => {
        let stagePass = true;
        let empty_fields = false;

        const firstStageFields = ["fullname", "email", "phone"];

        for (const field of firstStageFields) {
            // @ts-expect-error key coming from applicationInfo, there will be no conflict
            if (isEmpty(applicationInfo.applicant[field])) {
                stagePass = false;
                setWarnings((warnings) => ({
                    ...warnings,
                    empty_fields: true,
                }));
                empty_fields = true;
            }
        }

        if (isEmpty(applicationInfo.applicant.school.name)) {
            stagePass = false;
            setWarnings((warnings) => ({
                ...warnings,
                empty_fields: true,
            }));
            empty_fields = true;
        }

        if (!empty_fields) {
            setWarnings((warnings) => ({
                ...warnings,
                empty_fields: false,
            }));
        }

        if (!isEmail(applicationInfo.applicant.email)) {
            setWarnings((warnings) => ({
                ...warnings,
                not_email: true,
            }));
            stagePass = false;
        } else {
            setWarnings((warnings) => ({
                ...warnings,
                not_email: false,
            }));
        }

        if (!isMobilePhone(applicationInfo.applicant.phone)) {
            setWarnings((warnings) => ({
                ...warnings,
                not_phone_no: true,
            }));
            stagePass = false;
        } else {
            setWarnings((warnings) => ({
                ...warnings,
                not_phone_no: false,
            }));
        }

        return stagePass;
    };

    const attemptSubmitForm = async () => {
        if (validateStage1()) {
            const applicationUrl = new URL(FAIR_APPLICATION_URL);
            const res = await fetch(applicationUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(applicationInfo),
            });

            if (res.status === 200) navigate("/application-success");
        }
    };

    return (
        <div className="application-wrapper p-8">
            <Stepper active={currentStage} onStepClick={attemptStageChange}>
                <Stepper.Step label="1. Aşama" description="Başvuru Yapan Kişi Hakkında Bilgiler" />
                <Stepper.Step label="2. Aşama" description="Tarih ve Saat Seçimi" />
                <Stepper.Step label="3. Aşama" description="Notlarınız" />
                <Stepper.Completed>Başvurunuz tamamlandı!</Stepper.Completed>
            </Stepper>

            <div className="mt-4 flex-col content-center">
                {Object.values(warnings).some((value) => value) && (
                    <Alert
                        variant="light"
                        color="red"
                        title="Bu aşamayı tamamlayın"
                        icon={<IconAlertCircle />}
                        className="my-4"
                    >
                        Sonraki aşamalara geçebilmek için bu aşamadaki tüm gerekli bilgileri doğru doldurmanız gerekmektedir.
                        {warnings.empty_fields && (
                            <>
                                <br />
                                <strong>Bıraktığınız boş alanları doldurun.</strong>
                            </>
                        )}
                        {warnings.not_email && (
                            <>
                                <br />
                                <strong>Geçerli bir e-posta adresi girin.</strong>
                            </>
                        )}
                        {warnings.not_phone_no && (
                            <>
                                <br />
                                <strong>Geçerli bir telefon numarası girin.</strong>
                            </>
                        )}
                        {warnings.time_in_past && (
                            <>
                                <br />
                                <strong>Başlangıç zamanı geçmişte olamaz.</strong>
                            </>
                        )}
                        {warnings.end_before_start && (
                            <>
                                <br />
                                <strong>Bitiş zamanı başlangıç zamanından önce olamaz.</strong>
                            </>
                        )}
                    </Alert>
                )}
                {currentStage === 0 && (
                    <ApplicantInfoStage
                        applicationInfo={applicationInfo}
                        setApplicationInfo={setApplicationInfo}
                        warnings={warnings}
                    />
                )}

                {currentStage === 1 && (
                    <TimeSelectionStage
                        applicationInfo={applicationInfo}
                        setApplicationInfo={setApplicationInfo}
                        onValidationSuccess={setIsStage2Valid}
                    />
                )}

                {currentStage === 2 && (
                    <NotesStage
                        applicationInfo={applicationInfo}
                        setApplicationInfo={setApplicationInfo}
                    />
                )}
            </div>

            <div className="flex">
                {currentStage > 0 && (
                    <Button
                        className="fat-button bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center px-4 py-2 mr-2"
                        onClick={() => {
                            attemptStageChange(currentStage - 1);
                        }}
                    >
                        <IconChevronLeft size={16} className="mr-2" />
                        Önceki Aşama
                    </Button>
                )}

                {currentStage < 2 && (
                    <Button
                        className="fat-button bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center px-4 py-2"
                        onClick={() => {
                            attemptStageChange(currentStage + 1);
                        }}
                    >
                        Sonraki Aşama
                        <IconChevronRight size={16} className="ml-2" />
                    </Button>
                )}
                {currentStage === 2 && (
                    <Button
                        className="fat-button bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center px-4 py-2"
                        onClick={attemptSubmitForm}
                    >
                        Başvuruyu Tamamlayın
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FairApplication;