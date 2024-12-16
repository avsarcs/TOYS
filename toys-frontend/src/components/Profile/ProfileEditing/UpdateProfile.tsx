import React, { useState, useEffect, useContext } from "react";
import { Button, Avatar, FileButton, Loader } from "@mantine/core";
import EditProfileField from "./EditProfileField";
import DropdownBox from "./DropdownBox";
import { UserContext } from "../../../context/UserContext";

const UpdateProfile: React.FC = () => {
    const userContext = useContext(UserContext);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [highSchoolOptions, setHighSchoolOptions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: userContext.user.profile.fullname,
        email: userContext.user.profile.email,
        phone: userContext.user.profile.phone,
        description: userContext.user.profile.profile_description,
        highSchool: userContext.user.profile.highschool.name,
    });

    // Fetch high schools dynamically
    useEffect(() => {
        const fetchHighSchools = async () => {
            setIsLoading(true);
            try {
                const editProfileUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/analytics/high-schools/all");
                editProfileUrl.searchParams.append("auth", userContext.authToken);
                const response = await fetch(editProfileUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch high schools.");
                }
                const data = await response.json();
                setHighSchoolOptions(data.map((school: { name: string }) => school.name));
            } catch (err) {
                console.error(err);
                setError("Unable to load high schools. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchHighSchools();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        const updatedProfile = {
            ...userContext.user.profile,
            fullname: formData.name,
            email: formData.email,
            highschool: { name: formData.highSchool },
        };

        try {
            const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile/update");
            url.searchParams.append("auth", userContext.authToken);

            const formDataToSend = new FormData();
            formDataToSend.append("profileModel", JSON.stringify(updatedProfile));
            if (profilePicture) {
                formDataToSend.append("profilePicture", profilePicture);
            }

            const response = await fetch(url.toString(), {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error("Failed to save profile.");
            }

            console.log("Profile updated successfully.");
        } catch (err) {
            console.error(err);
            setError("An error occurred while saving your profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            {isLoading && (
                <div className="flex justify-center items-center mb-4">
                    <Loader color="violet" size="md" />
                </div>
            )}

            {error && (
                <div className="text-red-500 text-center mb-4">
                    {error}
                </div>
            )}

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
                label="İsim"
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
            <EditProfileField
                label="Telefon"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                editable            
            />
            <EditProfileField
                label="Açıklama"
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                editable
            />
            <DropdownBox
                label="High School"
                value={formData.highSchool}
                onChange={(value) => handleInputChange("highSchool", value)}
                options={highSchoolOptions}
            />

            {/* Save Button */}
            <Button
                onClick={handleSave}
                fullWidth
                color="violet"
                size="md"
                disabled={isLoading || highSchoolOptions.length === 0}
            >
                Save
            </Button>
        </div>
    );
};

export default UpdateProfile;
