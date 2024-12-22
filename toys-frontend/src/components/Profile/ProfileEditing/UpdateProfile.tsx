import React, {useContext, useEffect, useState} from "react";
import {Avatar, Button, FileButton, Loader, MultiSelect, Select} from "@mantine/core";
import EditProfileField from "./EditProfileField";
import {UserContext} from "../../../context/UserContext";
import {HighschoolData, HighschoolDataForProfile} from "../../../types/data";
import {DayOfTheWeek, UserRole} from "../../../types/enum.ts";
import {notifications} from "@mantine/notifications";
import {EMPTY_USER} from "../../../context/UserContext";

const UpdateProfile: React.FC = () => {
    const userContext = useContext(UserContext);
    const [profilePicture, setProfilePicture] = useState<string | File | null>(null);
    const [highSchoolOptions, setHighSchoolOptions] = useState<HighschoolData[]>([]);
    const [selectedHighSchool, setSelectedHighSchool] = useState<HighschoolDataForProfile | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
        responsible_days: [] as string[], // Add responsible_days field
        profile_picture: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

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
                    responsible_days: profileData.responsible_days || [], // Set responsible_days
                    profile_picture: profileData.profile_picture || "",
                });

                setSelectedHighSchool(profileData.highschool); // Set the high school

                // Set the profile picture URL
                if (profileData.profile_picture) {
                    setProfilePicture(profileData.profile_picture);
                }

                // Fetch high schools
                const highSchoolUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/analytics/high-schools/all");
                highSchoolUrl.searchParams.append("auth", await userContext.getAuthToken());

                const highSchoolResponse = await fetch(highSchoolUrl);
                if (!highSchoolResponse.ok) {
                    notifications.show({ title: "Error", message: "Failed to fetch high schools.", color: "red" });
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
    }, [userContext.getAuthToken]);

    const handleInputChange = (field: string, value: string | string[]) => {
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

        if (!selectedHighSchool && userContext.user.role !== UserRole.DIRECTOR && userContext.user.role !== UserRole.COORDINATOR) {
            setError("Lütfen geçerli bir lise seçin.");
            setIsLoading(false);
            return;
        }

        let profilePictureBase64 = formData.profile_picture;
        if (profilePicture && profilePicture instanceof File) {
            profilePictureBase64 = await convertFileToBase64(profilePicture);
        }
        console.log(userContext.user.profile);
        let updatedProfile;
        if (userContext.user.role !== UserRole.DIRECTOR && userContext.user.role !== UserRole.COORDINATOR) {
            updatedProfile = {
                ...userContext.user.profile,
                profile_picture: profilePictureBase64 || "", // Add profile picture
                fullname: formData.name,
                email: formData.email,
                phone: formData.phone,
                profile_description: formData.description,
                highschool: selectedHighSchool, // Use the full high school data
                responsible_days: formData.responsible_days, // Add responsible_days
            };
        }
        else {
            updatedProfile = {
                ...EMPTY_USER.profile,
                profile_picture: profilePictureBase64 || "", // Add profile picture
                fullname: formData.name,
                email: formData.email,
                phone: formData.phone,
                profile_description: formData.description,
                role: userContext.user.role,
                major: "MANAGEMENT"
            };
        }
        try {
            const url = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile/update");
            url.searchParams.append("id", userContext.user.id);
            url.searchParams.append("auth", await userContext.getAuthToken());
            
            const response = await fetch(url.toString(), {
                method: "POST",
                body: JSON.stringify(updatedProfile),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                notifications.show({ title: "Error", message: "Failed to update profile.", color: "red" });
            }
            userContext.updateUser(); // Update the user context
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
            {(userContext.user.role !== UserRole.DIRECTOR && userContext.user.role !== UserRole.COORDINATOR) ? <Select
                label="Lise"
                limit={7}
                value={selectedHighSchool?.name || ""}
                onChange={(value) => handleHighSchoolChange(value || "")}
                data={[...new Set(highSchoolOptions.map((school) => school.name))]}
                searchable
                placeholder="Lise seçin"
                className="mb-4"
            /> : null}

            {/* Responsible Days */}
            {userContext.user.role === UserRole.ADVISOR ? <MultiSelect
                label="Sorumlu Günler"
                data={Object.entries(DayOfTheWeek).map(([key, value]) => ({ label: value, value: key }))}
                value={formData.responsible_days}
                onChange={(value) => handleInputChange("responsible_days", value)}
                placeholder="Sorumlu günler seçin"
                className="mb-4"
            /> : null}

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