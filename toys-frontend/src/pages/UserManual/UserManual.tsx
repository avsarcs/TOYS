import React, { useContext, useEffect, useState } from 'react';
import { Box, Title, Text, Divider, Stack, Container, Card } from '@mantine/core';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';

const UserManual: React.FC = () => {
  const userContext = useContext(UserContext);
  const [manualContent, setManualContent] = useState<JSX.Element | null>(null);

  // Content for each user role
const roleContent: Record<UserRole, JSX.Element> = {
    [UserRole.NONE]: (
        <Text>
            TOYS'a hoşgeldiniz. Eğer bir TOYS çalışanıysaız, lütfen giriş yapın. Eğer bir ziyaretçiyseniz, bu sayfayı kullanarak:
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Lise grup turlarına başvurabilirsiniz.</li>
                    <li>Bireysel turlara başvurabilirsiniz.</li>
                    <li>Lisenizin fuarlarına katılmamız için bize davet gönderebilirsiniz.</li>
            </ul>
        </Text>
    ),
    [UserRole.TRAINEE]: (
        <Stack>
            <Title order={3}>Acemi Rehber Kılavuzu</Title>
            <Text>
                Acemi rehber olarak, şunları yapabilirsiniz:
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Turlara davet edilirseniz, turlara katılabilirsiniz.</li>
                    <li>Kendi başınıza bir turda görevli olamazsınız, deneyimli bir rehberin size eşlik etmesi gerek.</li>
                </ul>
            </Text>
        </Stack>
    ),
    [UserRole.GUIDE]: (
        <Stack>
            <Title order={3}>Rehber Kılavuzu</Title>
            <Text>
                Rehber olarak, şunları yapabilirsiniz:
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Rehberi olmak için turlara başvurabilirsiniz.</li>
                    <li>Size atanan turları görebilirsiniz.</li>
                    <li>Programınızı düzenleyebilirsiniz.</li>
                </ul>
            </Text>
        </Stack>
    ),
    [UserRole.ADVISOR]: (
        <Stack>
            <Title order={3}>Danışman Kılavuzu</Title>
            <Text>
                Danışman olarak, şunları yapabilirsiniz:
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Sorumlu olduğunuz rehberleri yönetebilirsiniz.</li>
                    <li>Rehberlerinize tur atayabilirsiniz.</li>
                    <li>Turlara rehber olarak katılabilirsiniz.</li>
                </ul>
            </Text>
        </Stack>
    ),
    [UserRole.COORDINATOR]: (
        <Stack>
            <Title order={3}>Koordinatör Kılavuzu</Title>
            <Text>
                Koordinatör olarak, şunları yapabilirsiniz:
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Acemi rehberlere tur atayabilirsiniz.</li>
                    <li>Fuarları yönetebilirsiniz.</li>
                    <li>Sistemin işleyişini yönetebilirsiniz, ödemeleri yapabilirsiniz.</li>
                </ul>
            </Text>
        </Stack>
    ),
    [UserRole.DIRECTOR]: (
        <Stack>
            <Title order={3}>Direktör Kılavuzu</Title>
            <Text>
                Direktör olarak, şunları yapabilirsiniz:
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Tüm organizasyonel etkinlikleri ve faaliyetleri denetleyebilirsiniz.</li>
                    <li>Tur ve öğrenci istatistiklerine erişebilirsiniz.</li>
                    <li>Tüm çalışanlaro yönetebilir, ödeme yapabilirsiniz.</li>
                </ul>
            </Text>
        </Stack>
    ),
    [UserRole.ADMIN]: (
        <Stack>
            <Title order={3}>Admin Kılavuzu</Title>
            <Text>
                Admin olarak, şunları yapabilirsiniz:
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>Kullanıcı ekleyip çıkartabilir ve onları yönetebilirsiniz.</li>
                </ul>
            </Text>
        </Stack>
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
                Kullanıcı Kılavuzu
            </Title>
            <Divider my="sm" />
            <Box>{manualContent || <Text>Yükleniyor...</Text>}</Box>
        </Card>
    </Container>
);
};
export default UserManual;