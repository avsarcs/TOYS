import {Button, Title} from "@mantine/core";
import "./ProfileInfo.css";

import {UserRole, UserRoleText} from "../../../types/enum.ts";
import {UserContext} from "../../../context/UserContext.tsx";
import {useCallback, useContext} from "react";
import {Link, useParams} from "react-router-dom";
import {ProfileComponentProps} from "../../../types/designed.ts";
import {notifications} from "@mantine/notifications";

const FIRE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/fire");

const translateDays = (days: string[]): string => {
    const dayTranslations: { [key: string]: string } = {
        MONDAY: 'Pazartesi',
        TUESDAY: 'Salı',
        WEDNESDAY: 'Çarşamba',
        THURSDAY: 'Perşembe',
        FRIDAY: 'Cuma',
        SATURDAY: 'Cumartesi',
        SUNDAY: 'Pazar'
    };

    const dayOrder: string[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    const sortedDays = days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    return sortedDays.map(day => dayTranslations[day] || day).join(', ');
};

const ProfileInfo: React.FC<ProfileComponentProps> = (props: ProfileComponentProps) => {
    const profile = props.profile;
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
            fireUrl.searchParams.append("auth", await userContext.getAuthToken());

            const res = await fetch(fireUrl, {
                method: "GET",
            });

            if (!res.ok) {
                notifications.show({ title: "Error", message: "Failed to remove user from TOYS.", color: "red" });
            }

            alert("User has been successfully removed from TOYS.");
        } catch (err) {
            if (err instanceof Error) {
                alert(`Error: ${err.message}`);
            } else {
                alert("An unknown error occurred.");
            }
        }
    }, [userContext.getAuthToken, profileId]);


    return (
        <div className="profile-info">
            <Title order={3} className="text-blue-700 font-bold font-main">
                Kullanıcı Bilgileri
            </Title>
            <div className="personal-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    Kişisel Bilgiler
                </Title>
                <p><strong>İsim: </strong> {profile.fullname} </p>
                <p><strong>E-Mail: </strong> {profile.email} </p>
                <p><strong>ID: </strong> {profile.id}</p>
                {( profile.role !== UserRole.COORDINATOR && profile.role !== UserRole.DIRECTOR) ?
                <><p><strong>Telefon: </strong>{profile.phone}</p>
                <p><strong>Açıklama: </strong> {profile.profile_description}</p></>
                : null}
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Lise:</strong> {profile.highschool.name} </p> : null}
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Bölüm:</strong> {profile.major}</p> : null}
            </div>
            <div className="toys-info">
                <Title order={5} className="text-blue-700 font-bold font-main">
                    TOYS'a Dair Bilgiler
                </Title>
                <p><strong>Rol:</strong> {UserRoleText[profile.role as keyof typeof UserRoleText]} </p>
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Rehber Edilen Tur Sayısı:</strong> {profile.previous_tour_count} </p> : null}
                {(profile.role !== UserRole.DIRECTOR && profile.role !== UserRole.COORDINATOR) ? <p><strong>Deneyim:</strong> {profile.experience} </p> : null}
                {(profile.role === UserRole.ADVISOR) ? (
                    <p><strong>Sorumlu Olunan Gün: </strong> {translateDays(profile.responsible_days)} </p>
                ) : null}
            </div>
            <div className="button-group">
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
                {(userContext.user.profile.role === UserRole.DIRECTOR || userContext.user.profile.role === UserRole.COORDINATOR) && profileId !== undefined ? <div className="button">
                    <Button
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
