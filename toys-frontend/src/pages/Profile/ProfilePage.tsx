import React, {useCallback, useContext, useEffect, useState} from "react";
import ProfileInfo from "../../components/Profile/ProfileInfo/ProfileInfo.tsx";
import WeeklySchedule from "../../components/Profile/WeeklySchedule/WeeklySchedule.tsx";
import {Box, Divider, Flex, LoadingOverlay, Space, Title} from "@mantine/core";
import {UserContext} from "../../context/UserContext.tsx";
import {UserRoleText, UserRole} from "../../types/enum.ts";
import { useParams } from "react-router-dom";
import { ProfileData } from "../../types/data.ts";
import { isObjectEmpty } from "../../lib/utils.tsx";
const PROFILE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile");

const ProfilePage: React.FC = () =>
{
    const userContext = useContext(UserContext);
    const params = useParams();
    const profileId = params.profileId;
    const [error, setError] = useState<Error | undefined>(undefined);
    const [profile, setProfile] = useState(userContext.user.profile);
    
    useEffect(() => {
        if(profileId === undefined || profileId === userContext.user.profile.id){
            setProfile(userContext.user.profile);
        }
    }, [userContext.user]);

    const getProfile = useCallback(async (profileId: string) => {
        setProfile({} as ProfileData);
        const profileUrl = new URL(PROFILE_URL);
        profileUrl.searchParams.append("id", profileId);
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
    
    console.log(profile);
    
    return(
        !isObjectEmpty(profile) ? 
            <div className="profile-page">
                <Box className="content" p="xl" pt="">
                    <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                        {UserRoleText[profile.role]} Profili
                    </Title>
                    {profileId === userContext.user.profile.id ? <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                        Burada kişisel ve TOYS'a dair bilgilerinizi görüntüleyebilirsiniz.
                    </Title> : <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                        Burada seçilen kullanıcının kişisel ve TOYS'a dair bilgilerini görüntüleyebilirsiniz.
                    </Title>}
                    <Space h="xl"/>
                    <Divider className="border-gray-400"/>
                    <Space h="xl"/>
                    <Flex
                        direction={{base: "column", md: "row"}} // Stack on small screens, row on medium and up
                        gap="md"
                        justify="start"
                        align="flex-start"
                        p="lg"
                        wrap="wrap"

                    >
                        <ProfileInfo profile={profile}/>
                        {(profile.role === UserRole.GUIDE || profile.role === UserRole.ADVISOR) ? <WeeklySchedule profile={profile}/> : null}
                    </Flex>
                </Box>
            </div> :     <Box w={"100%"} h={"100vh"} pos="relative">
                    <LoadingOverlay
                    visible zIndex={10}
                    overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
                </Box>);
}
export default ProfilePage;
