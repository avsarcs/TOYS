import React, {useContext, useEffect, useState} from "react";
import {Avatar, Button, FileButton, Loader, MultiSelect, Select} from "@mantine/core";
import EditProfileField from "./EditProfileField";
import {EMPTY_USER, UserContext} from "../../../context/UserContext";
import {HighschoolData, HighschoolDataForProfile} from "../../../types/data";
import {BackendDepartment, DayOfTheWeek, Department, UserRole} from "../../../types/enum.ts";
import {notifications} from "@mantine/notifications";

// Mapping between Department and BackendDepartment
const departmentMapping: { [key in BackendDepartment]: Department } = {
    [BackendDepartment.ARCHITECTURE]: Department.ARCHITECTURE,
    [BackendDepartment.COMMUNICATION_AND_DESIGN]: Department.COMMUNICATION_AND_DESIGN,
    [BackendDepartment.FINE_ARTS]: Department.FINE_ARTS,
    [BackendDepartment.GRAPHIC_DESIGN]: Department.GRAPHIC_DESIGN,
    [BackendDepartment.INTERIOR_ARCHITECTURE_AND_ENVIRONMENTAL_DESIGN]: Department.INTERIOR_ARCHITECTURE_AND_ENVIRONMENTAL_DESIGN,
    [BackendDepartment.URBAN_DESIGN_AND_LANDSCAPE_ARCHITECTURE]: Department.URBAN_DESIGN_AND_LANDSCAPE_ARCHITECTURE,
    [BackendDepartment.MANAGEMENT]: Department.MANAGEMENT,
    [BackendDepartment.ECONOMICS]: Department.ECONOMICS,
    [BackendDepartment.INTERNATIONAL_RELATIONS]: Department.INTERNATIONAL_RELATIONS,
    [BackendDepartment.POLITICAL_SCIENCE_AND_PUBLIC_ADMINISTRATION]: Department.POLITICAL_SCIENCE_AND_PUBLIC_ADMINISTRATION,
    [BackendDepartment.PSYCHOLOGY]: Department.PSYCHOLOGY,
    [BackendDepartment.COMPUTER_ENGINEERING]: Department.COMPUTER_ENGINEERING,
    [BackendDepartment.ELECTRICAL_AND_ELECTRONICS_ENGINEERING]: Department.ELECTRICAL_AND_ELECTRONICS_ENGINEERING,
    [BackendDepartment.INDUSTRIAL_ENGINEERING]: Department.INDUSTRIAL_ENGINEERING,
    [BackendDepartment.MECHANICAL_ENGINEERING]: Department.MECHANICAL_ENGINEERING,
    [BackendDepartment.AMERICAN_CULTURE_AND_LITERATURE]: Department.AMERICAN_CULTURE_AND_LITERATURE,
    [BackendDepartment.ARCHAEOLOGY]: Department.ARCHAEOLOGY,
    [BackendDepartment.ENGLISH_LANGUAGE_AND_LITERATURE]: Department.ENGLISH_LANGUAGE_AND_LITERATURE,
    [BackendDepartment.PHILOSOPHY]: Department.PHILOSOPHY,
    [BackendDepartment.CHEMISTRY]: Department.CHEMISTRY,
    [BackendDepartment.MATHEMATICS]: Department.MATHEMATICS,
    [BackendDepartment.MOLECULAR_BIOLOGY_AND_GENETICS]: Department.MOLECULAR_BIOLOGY_AND_GENETICS,
    [BackendDepartment.PHYSICS]: Department.PHYSICS,
    [BackendDepartment.MUSIC]: Department.MUSIC,
    [BackendDepartment.INFORMATION_SYSTEMS_AND_TECHNOLOGIES]: Department.INFORMATION_SYSTEMS_AND_TECHNOLOGIES,
    [BackendDepartment.TOURISM_AND_HOTEL_MANAGEMENT]: Department.TOURISM_AND_HOTEL_MANAGEMENT,
    [BackendDepartment.HISTORY]: Department.HISTORY,
    [BackendDepartment.TRANSLATION_AND_INTERPRETATION]: Department.TRANSLATION_AND_INTERPRETATION,
    [BackendDepartment.TURKISH_LITERATURE]: Department.TURKISH_LITERATURE,
};

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
        iban: "", // Add iban field
        major: "", // Add major field
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
                    iban: profileData.iban || "", // Set iban
                    major: profileData.major || "", // Set major
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

        // Convert displayed major to backend major
        const backendMajor = Object.keys(departmentMapping).find(key => departmentMapping[key as BackendDepartment] === formData.major) || "";

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
                iban: formData.iban, // Add iban
                major: backendMajor, // Use backend major
            };
        }
        else {
            updatedProfile = {
                ...EMPTY_USER.profile,
                fullname: formData.name,
                role: userContext.user.role,
                major: "MANAGEMENT",
                id: userContext.user.id,
                email: formData.email,
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
            {(userContext.user.role !== UserRole.COORDINATOR && userContext.user.role !== UserRole.DIRECTOR) ? <div className="flex items-center gap-4 mb-6">
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
            </div> : null}

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
            {(userContext.user.role !== UserRole.COORDINATOR && userContext.user.role !== UserRole.DIRECTOR) ? <EditProfileField
                label="Telefon"
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                editable
            />: null}
            {(userContext.user.role !== UserRole.COORDINATOR && userContext.user.role !== UserRole.DIRECTOR) ? <EditProfileField
                label="Açıklama"
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                editable
            />: null}
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

            {/* IBAN and Major Fields */}
            {(userContext.user.role === UserRole.TRAINEE || userContext.user.role === UserRole.GUIDE || userContext.user.role === UserRole.ADVISOR) ?
                <>
                    <EditProfileField
                        label="IBAN"
                        value={formData.iban}
                        onChange={(value) => handleInputChange("iban", value)}
                        editable
                    />
                    <Select
                        label="Bölüm"
                        value={formData.major}
                        onChange={(value) => handleInputChange("major", value || "")}
                        data={Object.values(Department).map((dept) => ({ value: dept, label: dept }))}
                        placeholder="Bölüm seçin"
                        className="mb-4"
                    />
                </>
            : null}

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