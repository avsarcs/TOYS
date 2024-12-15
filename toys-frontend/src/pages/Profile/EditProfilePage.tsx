import React from "react";
import {Title, Divider, Space, Flex, Box} from "@mantine/core";
import UpdateProfile from "../../components/Profile/ProfileEditing/UpdateProfile.tsx";

const EditProfilePage: React.FC = () => {
    return (
        <div className="edit-profile-page">
            <Box className="content" p="xl" pt="">
                <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                    Edit Profile Information
                </Title>
                <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                    Here you can update your personal details and profile picture.
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
                    {/* Update Profile Section */}
                    <UpdateProfile />
                </Flex>
            </Box>
        </div>
    );
};

export default EditProfilePage;
