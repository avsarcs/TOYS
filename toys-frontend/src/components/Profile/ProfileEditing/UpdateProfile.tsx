import React, { useState, useEffect, useContext } from "react";
import { Button, Avatar, FileButton, Loader } from "@mantine/core";
import EditProfileField from "./EditProfileField";
import DropdownBox from "./DropdownBox";
import { UserContext } from "../../../context/UserContext";
import { HighschoolData } from "../../../types/data";

const UpdateProfile: React.FC = () => {
    const userContext = useContext(UserContext);
    const [profilePicture, setProfilePicture] = useState<string | File | null>(null);
    const [highSchoolOptions, setHighSchoolOptions] = useState<HighschoolData[]>([]);
    const [selectedHighSchool, setSelectedHighSchool] = useState<HighschoolData | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch high schools and profile
    useEffect(() => {
        const fetchProfileAndHighSchools = async () => {
            setIsLoading(true);
            try {
                // Fetch profile data
                const profileData = userContext.user.profile;

                // Set initial form data
                setFormData({
                    name: profileData.fullname,
                    email: profileData.email,
                    phone: profileData.phone || "",
                    description: profileData.profile_description || "",
                });

                setSelectedHighSchool(profileData.highschool); // Set the high school

                // Set the profile picture URL
                if (profileData.profile_picture) {
                    setProfilePicture(profileData.profile_picture);
                }

                // Fetch high schools
                const highSchoolUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/analytics/high-schools/all");
                highSchoolUrl.searchParams.append("auth", userContext.authToken);

                const highSchoolResponse = await fetch(highSchoolUrl);
                if (!highSchoolResponse.ok) {
                    throw new Error("Failed to fetch high schools.");
                }
                const highSchoolData: HighschoolData[] = await highSchoolResponse.json();
                setHighSchoolOptions(highSchoolData);
            } catch (err) {
                console.error(err);
                setError("An error occurred while loading data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileAndHighSchools();
    }, [userContext.authToken]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleHighSchoolChange = (highSchoolName: string) => {
        const selected = highSchoolOptions.find((school) => school.name === highSchoolName) || null;
        setSelectedHighSchool(selected);
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);

        if (!selectedHighSchool) {
            setError("Please select a valid high school.");
            setIsLoading(false);
            return;
        }

        const updatedProfile = {
            ...userContext.user.profile,
            fullname: formData.name,
            email: formData.email,
            phone: formData.phone,
            profile_description: formData.description,
            highschool: selectedHighSchool, // Use the full high school data
        };

        try {
            const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile/update");
            url.searchParams.append("auth", userContext.authToken);

            const formDataToSend = new FormData();
            formDataToSend.append("profileModel", JSON.stringify(updatedProfile));
            if (profilePicture && profilePicture instanceof File) {
                formDataToSend.append("profilePicture", profilePicture);
            }

            const response = await fetch(url.toString(), {
                method: "POST",
                body: JSON.stringify({...formDataToSend})
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
                    src={
                        profilePicture instanceof File
                            ? URL.createObjectURL(profilePicture)
                            : profilePicture || undefined
                    }
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
                label="Lise"
                value={selectedHighSchool?.name || ""}
                onChange={handleHighSchoolChange}
                options={highSchoolOptions.map((school) => school.name)}
            />

            {/* Save Button */}
            <Button
                onClick={handleSave}
                fullWidth
                color="violet"
                size="md"
                disabled={isLoading || highSchoolOptions.length === 0}
            >
                Kaydet
            </Button>
        </div>
    );
};

export default UpdateProfile;
