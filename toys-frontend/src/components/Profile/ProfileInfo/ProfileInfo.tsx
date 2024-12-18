import { Button, Title } from "@mantine/core";
import "./ProfileInfo.css";

import { UserRole, UserRoleText } from "../../../types/enum.ts";
import { UserContext } from "../../../context/UserContext.tsx";
import {useCallback, useContext } from "react";
import {Link, useParams} from "react-router-dom";
import { ProfileComponentProps } from "../../../types/designed.ts";

const FIRE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/fire");

const ProfileInfo: React.FC<ProfileComponentProps> = (props: ProfileComponentProps) => {
    const profile  = props.profile;
    const userContext = useContext(UserContext);
    const params = useParams();
    const profileId = params.profileId;

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
                <p><strong>Telefon:</strong>{profile.phone}</p>
                <p><strong>Açıklama:</strong> {profile.profile_description}</p>
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Lise:</strong> {profile.highschool.name} </p> : null}
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR)  ? <p><strong>Bölüm:</strong> {profile.major}</p> : null}
            </div>
            <div className="toys-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    TOYS'a Dair Bilgiler
                </Title>
                <p><strong>Rol:</strong> {UserRoleText[profile.role as keyof typeof UserRoleText]} </p>
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Rehber Edilen Tur Sayısı:</strong> {profile.previous_tour_count} </p> : null}
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Deneyim:</strong> {profile.experience} </p> : null}
            </div>
            <div className = "button-group">
                {profileId === undefined ? <div className="button">
                    <Button
                        component={Link}
                        to="/edit-profile"
                        variant="filled"
                        color="violet"
                        style={{ marginRight: "10px" }}
                    >
                        Kişisel Bilgileri Düzenle
                    </Button>
                </div> : null}
                {(profile.role === UserRole.DIRECTOR || profile.role === UserRole.COORDINATOR) && profileId !== undefined ? <div className="button">
                    <Button
                        component={Link}
                        to="/edit-profile"
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
