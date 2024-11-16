import React, { useState } from "react";
import { Button, Title } from "@mantine/core";
import ApplicationModal from "./ApplicationModal"; // Import the generic component
import "./ProfileInfo.css";

const ProfileInfo: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApplicationDisabled, setIsApplicationDisabled] = useState(false); // Track if button is disabled

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleApplicationSubmit = (reason: string) => {
        console.log("Application submitted with reason:", reason);
        setIsApplicationDisabled(true); // Disable the "Apply to Be an Advisor" button
    };

    return (
        <div className="profile-info">
            <Title order={3} className="text-blue-700 font-bold font-main">
                User Details
            </Title>
            <div className="personal-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    Personal Information
                </Title>
                <p><strong>Name:</strong> Scarlett Johansson</p>
                <p><strong>E-Mail:</strong> ege.celik@ug.bilkent.edu.tr</p>
                <p><strong>ID:</strong> 2202321</p>
                <p><strong>High School:</strong> ODTÜ GVO Lisesi</p>
                <p><strong>Department:</strong> CS</p>
            </div>
            <div className="toys-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    TOYS Specific Information
                </Title>
                <p><strong>Current Role:</strong> Advisor</p>
                <p><strong>Tours Guided:</strong> 45</p>
                <p><strong>Total Experience:</strong> 2 years</p>
            </div>
            <div className="button-group">
                <Button
                    component="a"
                    href="/edit-profile"
                    variant="filled"
                    color="violet"
                    style={{ marginRight: "10px" }}
                >
                    Edit Personal Information
                </Button>
                <Button
                    onClick={openModal}
                    variant="filled"
                    color="violet"
                    disabled={isApplicationDisabled}
                >
                    Apply to Be an Advisor
                </Button>
            </div>

            {/* Application Modal */}
            <ApplicationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleApplicationSubmit}
                title="Explanation of Application"
            />
        </div>
    );
};

export default ProfileInfo;
