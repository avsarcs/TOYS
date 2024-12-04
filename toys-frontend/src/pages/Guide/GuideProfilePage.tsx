import React from "react";
import ProfileInfo from "../../components/Profile/ProfileInfo/ProfileInfo.tsx";
import WeeklySchedule from "../../components/Profile/WeeklySchedule/WeeklySchedule.tsx";
import {Box, Divider, Flex, Space, Title} from "@mantine/core";

const ProfilePage: React.FC = () => (
    <div className="profile-page">
        <Box className="content" p="xl" pt="">
            <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                Guide Profile
            </Title>
            <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                You can see personal and TOYS specific information here.
            </Title>
            <Space h="xl"/>
            <Divider className="border-gray-400"/>
            <Space h="xl"/>
            <Flex
                direction={{ base: "column", md: "row" }} // Stack on small screens, row on medium and up
                gap="md"
                justify="start"
                align="flex-start"
                p="lg"
                wrap="wrap"

            >
                <ProfileInfo />
                <WeeklySchedule />
            </Flex>
        </Box>
    </div>
);

export default ProfilePage;
