import React from 'react';
import { Container, Title, Text, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconMail, IconPhone, IconUser } from '@tabler/icons-react';

const Contact: React.FC = () => {
  return (
    <Container size="sm" style={{ marginTop: '50px' }}>
      <Title order={2} style={{ marginBottom: '20px', textAlign: 'center' }}>
        Bize Ulaşın
      </Title>
      <Stack gap="md">
        <Group>
          <ThemeIcon variant="light" size={40}>
            <IconMail size={24} />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={500}>
              Email
            </Text>
            <Text size="md">iletisim@ornek.com</Text>
          </div>
        </Group>
        <Group>
          <ThemeIcon variant="light" size={40}>
            <IconPhone size={24} />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={500}>
              Telefon
            </Text>
            <Text size="md">+90 555 555 55 55</Text>
          </div>
        </Group>
        <Group>
          <ThemeIcon variant="light" size={40}>
            <IconUser size={24} />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={500}>
              İlgili Kişi
            </Text>
            <Text size="md">Ahmet Yılmaz</Text>
          </div>
        </Group>
      </Stack>
    </Container>
  );
};

export default Contact;