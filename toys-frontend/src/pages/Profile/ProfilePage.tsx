import React, {useCallback, useContext, useEffect, useState} from "react";
import ProfileInfo from "../../components/Profile/ProfileInfo/ProfileInfo.tsx";
import WeeklySchedule from "../../components/Profile/WeeklySchedule/WeeklySchedule.tsx";
import {Box, Divider, Flex, Space, Title} from "@mantine/core";
import {UserContext} from "../../context/UserContext.tsx";
import {UserRoleText} from "../../types/enum.ts";
import { useParams } from "react-router-dom";
const PROFILE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/profile");

const ProfilePage: React.FC = () =>
{
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
    <div className="profile-page">
        <Box className="content" p="xl" pt="">
            <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                {UserRoleText[userContext.user.role]} Profili
            </Title>
            <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                Burada kişisel bilgilerinizi ve TOYS'a dair verilerinizi görüntüleyebilirsiniz.
            </Title>
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
                <WeeklySchedule profile={profile}/>
            </Flex>
        </Box>
    </div>);
}
export default ProfilePage;
