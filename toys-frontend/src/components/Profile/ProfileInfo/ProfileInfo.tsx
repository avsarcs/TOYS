import { Button, Title } from "@mantine/core";
import "./ProfileInfo.css";

import { UserRole, UserRoleText } from "../../../types/enum.ts";
import { UserContext } from "../../../context/UserContext.tsx";
import {useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FIRE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/fire");
const PROFILE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile");

const ProfileInfo: React.FC = () => {
    const userContext = useContext(UserContext);
    const params = useParams();
    const profileId = params.profileId;
    const [error, setError] = useState<Error | undefined>(undefined);
    const [profile, setProfile] = useState(userContext.user.profile);

    const getProfile = useCallback(async (profileId: string) => {
        const profileUrl = new URL(PROFILE_URL);
        profileUrl.searchParams.append("profileId", profileId);
        profileUrl.searchParams.append("auth", userContext.authToken);

        const res = await fetch(profileUrl, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Something went wrong");
        }

        const profileText = await res.text();
        if(profileText.length === 0) {
            throw new Error("Profile not found");
        }

        setProfile(JSON.parse(profileText));
    }, [userContext.authToken]);

    const fireUser = useCallback(async () => {
        if (!profileId) {
            alert("Profile ID is not defined.");
            return;
        }

        try {
            const fireUrl = new URL(FIRE_URL);
            fireUrl.searchParams.append("id", profileId);
            fireUrl.searchParams.append("auth", userContext.authToken);

            const res = await fetch(fireUrl, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error("Failed to fire the user.");
            }

            alert("User has been successfully removed from TOYS.");
        } catch (err) {
            if (err instanceof Error) {
                alert(`Error: ${err.message}`);
            } else {
                alert("An unknown error occurred.");
            }
        }
    }, [profileId, userContext.authToken]);

    useEffect(() => {
        if(profileId === undefined) {
            return;
        }
        getProfile(params.profileId as string).catch((reason) => {
            setError(reason);
        });
    }, [params.profileId, getProfile]);

    if(error) {
        throw error;
    }
    


    return (
        <div className="profile-info">
            <Title order={3} className="text-blue-700 font-bold font-main">
                Kullanıcı Bilgileri
            </Title>
            <div className="personal-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    Kişisel Bilgiler
                </Title>
                <p><strong>İsim:</strong> {profile.fullname} </p>
                <p><strong>E-Mail:</strong> {profile.email} </p>
                <p><strong>ID:</strong> {profile.id}</p>
                {profile.role !== UserRole.DIRECTOR ? <p><strong>Lise:</strong> {profile.highschool.name} </p> : null}
                {profile.role !== UserRole.DIRECTOR ? <p><strong>Bölüm:</strong> {profile.major}</p> : null}
            </div>
            <div className="toys-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    TOYS'a Dair Bilgiler
                </Title>
                <p><strong>Rol:</strong> {UserRoleText[profile.role as keyof typeof UserRoleText]} </p>
                <p><strong>Rehber Edilen Tur Sayısı:</strong> {profile.previous_tour_count} </p>
                <p><strong>Deneyim:</strong> {profile.experience} </p>
            </div>
            <div className = "button-group">
                {profileId === undefined ? <div className="button">
                    <Button
                        component="a"
                        href="/edit-profile"
                        variant="filled"
                        color="violet"
                        style={{ marginRight: "10px" }}
                    >
                        Kişisel Bilgileri Düzenle
                    </Button>
                </div> : null}
                {(profile.role === UserRole.DIRECTOR || profile.role === UserRole.COORDINATOR) && profileId !== undefined ? <div className="button">
                    <Button
                        component="a"
                        href="/edit-profile"
                        variant="filled"
                        color="violet"
                        style={{ marginRight: "10px" }}
                        onClick={fireUser}
                    >
                        Kullanıcıyı TOYS'dan Çıkart

                    </Button>
                </div> : null}
            </div>
        </div>
    );
};

export default ProfileInfo;
