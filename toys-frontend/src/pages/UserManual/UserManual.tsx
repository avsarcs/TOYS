import React, { useContext, useEffect, useState } from 'react';
import { Box, Title, Text, Divider, Container, Card, Stepper, Group, Button, Space } from '@mantine/core';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';
import { Accordion } from '@mantine/core';
import AdminTexts from "./AdminTexts.ts";
import AdvisorTexts from "./AdvisorTexts.ts";
import CoordinatorTexts from "./CoordinatorTexts.ts";
import DirectorTexts from "./DirectorTexts.ts";
import GuideTexts from "./GuideTexts.ts";
import TraineeTexts from "./TraineeTexts.ts";
import VisitorTexts from "./VisitorTexts.ts";

export interface UserManualItem  {
    title: string;
    content?: string;
    image?: string;
    dynamicSteps?: {title: string; content: string; image?: string }[];
    staticSteps?: {title: string; content: string; image?: string }[];
}

const DynamicStepGenerator: React.FC<{ steps: {title: string; content: string; image?: string }[] }> = ({ steps }) => {
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < steps.length - 1 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <>
            <Stepper active={active} onStepClick={setActive}>
                {steps.map((step, index) => (
                    <Stepper.Step key={index} label={step.title}>
                        {step.image && <img src={step.image} alt={step.title} />}
                        {step.content}
                    </Stepper.Step>
                ))}
            </Stepper>

            <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Geri</Button>
                <Button onClick={nextStep}>İleri</Button>
            </Group>
        </>
    );
}

const StaticStepGenerator: React.FC<{ steps: {title: string; content: string; image?: string }[] }> = ({ steps }) => {
    return (
        <ol style={{ listStyleType: 'decimal' }}>
            {steps.map((step, index) => (
                <li key={index} style={{ marginBottom: '1em' }}>
                    <strong>{step.title}</strong>
                    {step.image && <img src={step.image} alt={step.title} />}
                    <p>{step.content}</p>
                </li>
            ))}
        </ol>
    );
};

const UserManual: React.FC = () => {
    const userContext = useContext(UserContext);
    const [manualContent, setManualContent] = useState<JSX.Element | null>(null);

    const roleTitle = (() => {
        switch (userContext.user.role) {
            case UserRole.NONE:
                return "Ziyaretçi";
            case UserRole.TRAINEE:
                return "Acemi Rehber";
            case UserRole.GUIDE:
                return "Rehber";
            case UserRole.ADVISOR:
                return "Danışman";
            case UserRole.COORDINATOR:
                return "Koordinatör";
            case UserRole.DIRECTOR:
                return "Direktör";
            case UserRole.ADMIN:
                return "Admin";
            default:
                return "Misafir";
        }
    })();

  // Content for each user role
const roleContent: Record<UserRole, JSX.Element> = {
    [UserRole.NONE]: (
        <Accordion>
            {VisitorTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    ),
    [UserRole.TRAINEE]: (
        <Accordion>
            {TraineeTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    ),
    [UserRole.GUIDE]: (
        <Accordion>
            {GuideTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    ),
    [UserRole.ADVISOR]: (
        <Accordion>
            {AdvisorTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    ),
    [UserRole.COORDINATOR]: (
        <Accordion>
            {CoordinatorTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    ),
    [UserRole.DIRECTOR]: (
        <Accordion>
            {DirectorTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
            </Accordion.Item>
            ))}
        </Accordion>
    ),
    [UserRole.ADMIN]: (
        <Accordion>
            {AdminTexts.map((item: UserManualItem) => (
                <Accordion.Item key={item.title} value={item.title}>
                    <Accordion.Control>
                        <Title order={3}>{item.title}</Title>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {item.content}
                        <Space h="md" />
                        {item.staticSteps && item.staticSteps.length > 0 && <StaticStepGenerator steps={item.staticSteps} />}
                        <Space h="md" />
                        {item.dynamicSteps && item.dynamicSteps.length > 0 && <DynamicStepGenerator steps={item.dynamicSteps} />}
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    ),
};

useEffect(() => {
    if (userContext && userContext.user) {
        setManualContent(roleContent[userContext.user.role]);
    } else {
        setManualContent(<Text>Loading...</Text>);
    }
}, [userContext]);

return (
    <Container>
        <Card shadow="sm" padding="lg" radius="md">
            <Title ta="center" mb="sm">
                {roleTitle} Kullanıcı Kılavuzu
            </Title>
            <Divider my="sm" />
            <Box>{manualContent || <Text>Yükleniyor...</Text>}</Box>
        </Card>
    </Container>
);
};
export default UserManual;