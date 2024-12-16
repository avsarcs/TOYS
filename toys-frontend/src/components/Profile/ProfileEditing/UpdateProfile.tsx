import React, { useState } from "react";
import { Button, Avatar, FileButton } from "@mantine/core";
import EditProfileField from "./EditProfileField";
import DropdownBox from "./DropdownBox";

const UpdateProfile: React.FC = () => {
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        name: "Scarlett Johansson",
        email: "ege.celik@ug.bilkent.edu.tr",
        id: "22202321",
        highSchool: "ODTÜ GVO Lisesi",
    });

    const highSchoolOptions = [
        "ODTÜ GVO Lisesi",
        "TED Ankara Koleji",
        "İzmir Amerikan Koleji",
        "Robert Koleji",
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSave = () => {
        console.log("Saved Data:", formData, profilePicture);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            {/* Profile Picture */}
            <div className="flex items-center gap-4 mb-6">
                <Avatar
                    src={profilePicture ? URL.createObjectURL(profilePicture) : undefined}
                    size={120}
                    radius={60}
                    alt="Profile Picture"
                    className="shadow-md"
                />
                <FileButton onChange={(file) => setProfilePicture(file)} accept="image/*">
                    {(props) => (
                        <Button {...props} variant="outline" color="blue">
                            Upload Picture
                        </Button>
                    )}
                </FileButton>
            </div>

            {/* Profile Fields */}
            <EditProfileField
                label="Name"
                value={formData.name}
                onChange={(value) => handleInputChange("name", value)}
                editable
            />
            <EditProfileField
                label="E-mail"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                editable
            />
            <EditProfileField label="ID" value={formData.id} editable={false} />
            <DropdownBox
                label="High School"
                value={formData.highSchool}
                onChange={(value) => handleInputChange("highSchool", value)}
                options={highSchoolOptions}
            />

            {/* Save Button */}
            <Button onClick={handleSave} fullWidth color="violet" size="md">
                Save
            </Button>
        </div>
    );
};

export default UpdateProfile;
