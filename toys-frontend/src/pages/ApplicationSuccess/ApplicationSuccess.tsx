import { Box, Title } from '@mantine/core';
import React from 'react';
import { Container, Text, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';

import "./ApplicationSuccess.css"

export const ApplicationSuccess: React.FC = () => {
    return (
        <>
            <div className='application-success-container'>
                <br></br>
                <Title>Başvurunuzu aldık!</Title>
                <div>Size geri dönüş yapacağız. Bu sayfayı kapatabilirsiniz.</div>
                <br></br>
                <img src="/bilkent_drone.jpg" style={{ border: '10px solid black' }} />
            </div>
            <div style={{ position: 'fixed', right: '10px', bottom: '10px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px', borderRadius: '8px' }}>
                <Container size="sm">
                    <Title order={2} style={{ marginBottom: '20px', textAlign: 'center', color: '#ecf0f1' }}>
                        Bize Ulaşın
                    </Title>
                    <Stack spacing="md">
                        <Group>
                            <ThemeIcon variant="light" size={40} style={{ backgroundColor: '#34495e' }}>
                                <IconMail size={24} color="#ecf0f1" />
                            </ThemeIcon>
                            <div>
                                <Text size="lg" fw={500} style={{ color: '#ecf0f1' }}>
                                    Email
                                </Text>
                                <Text size="md" style={{ color: '#bdc3c7' }}>iletisim@ornek.com</Text>
                            </div>
                        </Group>
                        <Group>
                            <ThemeIcon variant="light" size={40} style={{ backgroundColor: '#34495e' }}>
                                <IconPhone size={24} color="#ecf0f1" />
                            </ThemeIcon>
                            <div>
                                <Text size="lg" fw={500} style={{ color: '#ecf0f1' }}>
                                    Telefon
                                </Text>
                                <Text size="md" style={{ color: '#bdc3c7' }}>+90 555 555 55 55</Text>
                            </div>
                        </Group>
                        <Group>
                            <ThemeIcon variant="light" size={40} style={{ backgroundColor: '#34495e' }}>
                                <IconUser size={24} color="#ecf0f1" />
                            </ThemeIcon>
                            <div>
                                <Text size="lg" fw={500} style={{ color: '#ecf0f1' }}>
                                    İlgili Kişi
                                </Text>
                                <Text size="md" style={{ color: '#bdc3c7' }}>Ahmet Yılmaz</Text>
                            </div>
                        </Group>
                    </Stack>
                </Container>
            </div>
        </>
    );
};

export default ApplicationSuccess;
