import React from "react";
import { Button, Title, Grid, Flex, Card } from "@mantine/core";
import { Link } from "react-router-dom";

const ProfileInfo: React.FC = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} className="text-blue-700 font-bold font-main" mb="md">
            User Details
        </Title>

        <Grid>
            <Grid.Col span={12}>
                <Title order={5} className="text-blue-700 font-bold font-main">
                    Personal Information
                </Title>
                <p><strong>Name:</strong> Scarlett Johansson</p>
                <p><strong>E-Mail:</strong> ege.celik@ug.bilkent.edu.tr</p>
                <p><strong>ID:</strong> 2202321</p>
                <p><strong>High School:</strong> ODTÜ GVO Lisesi</p>
                <p><strong>Department:</strong> CS</p>
            </Grid.Col>
            <Grid.Col span={12}>
                <Title order={5} className="text-blue-700 font-bold font-main">
                    TOYS Specific Information
                </Title>
                <p><strong>Current Role:</strong> Advisor</p>
                <p><strong>Tours Guided:</strong> 45</p>
                <p><strong>Total Experience:</strong> 2 years</p>
            </Grid.Col>
        </Grid>

        <Flex
            gap="md"
            mt="md"
            direction={{ base: "column", sm: "row" }}
            align="stretch"
        >
            <Button component={Link} to="/edit-profile" variant="filled" color="violet">
                Edit Personal Information
            </Button>
            <Button variant="filled" color="violet">
                Apply to Be an Advisor
            </Button>
        </Flex>
    </Card>
);

export default ProfileInfo;
