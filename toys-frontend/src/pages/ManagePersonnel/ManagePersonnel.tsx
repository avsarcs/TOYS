import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  Group,
  TextInput,
  Title,
  Text,
  Stack,
  Badge,
  Button,
  Space,
  Chip
} from '@mantine/core';

import { showNotification } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';
import { IconSearch, IconUser, IconStarFilled, IconBriefcase } from '@tabler/icons-react';
import { SimpleGuideData } from '../../types/data';
import { Department } from '../../types/enum.ts';

const GUIDES_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/guides");
const PROMOTION_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/people/promote");

const ManagePersonnel: React.FC = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [guides, setGuides] = useState<SimpleGuideData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const fetchGuides = useCallback(async () => {
    const guidesUrl = new URL(GUIDES_URL);
    guidesUrl.searchParams.append("auth", await userContext.getAuthToken());
    guidesUrl.searchParams.append("name", searchQuery);

    // Always send type parameter, but as empty if nothing selected
    if (selectedTypes.length > 0) {
      selectedTypes.forEach(type => {
        guidesUrl.searchParams.append("type[]", type);
      });
    } else {
      guidesUrl.searchParams.append("type[]", "");
    }

    const res = await fetch(guidesUrl, {
      method: "GET"
    });

    if (res.ok) {
      const data = await res.json();
      setGuides(data);
    }
  }, [searchQuery, selectedTypes]);


  const handlePromotion = async (guideId: string) => {
    const promoteUrl = new URL(PROMOTION_URL);
    promoteUrl.searchParams.append("auth", await userContext.getAuthToken());
    promoteUrl.searchParams.append("user_id", guideId);

    const res = await fetch(promoteUrl, {
      method: "POST"
    });

    if (res.ok) {
      await fetchGuides();
      showNotification({
        title: 'Başarılı',
        message: 'Yükseltme işlemi başarıyla gerçekleşmiştir!',
        color: 'green',
        icon: <IconCheck />,
        autoClose: 5000,
      });
    } else {
      showNotification({
        title: 'Başarısız',
        message: 'Yükseltme işlemi başarısız!',
        color: 'red',
        icon: <IconX />,
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    fetchGuides().catch(console.error);
  }, [fetchGuides]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'TRAINEE':
        return <IconUser size={20} />;
      case 'GUIDE':
        return <IconStarFilled size={20} />;
      case 'ADVISOR':
        return <IconBriefcase size={20} />;
      default:
        return <IconUser size={20} />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TRAINEE':
        return 'blue';
      case 'GUIDE':
        return 'green';
      case 'ADVISOR':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const formatExperience = (experience: string) => {
    return experience.replace(/(\d+)\s+events?/, '$1 etkinlik');
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'TRAINEE':
        return 'Amatör Rehber';
      case 'GUIDE':
        return 'Rehber';
      case 'ADVISOR':
        return 'Danışman';
      default:
        return role;
    }
  };

  return (
    <Container size="xl" p="md">
      <Title order={1} className="text-blue-700 font-bold mb-6">
        Personel Yönetimi
      </Title>

      <Card shadow="sm" p="lg" radius="md" withBorder className="mb-6">
        <Stack gap="md">
          <TextInput
            placeholder="İsme göre ara..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Group>
            <Text fw={500}>Filtrele:</Text>
            <Chip.Group multiple value={selectedTypes} onChange={setSelectedTypes}>
              <Group>
                <Chip value="TRAINEE" color="blue" variant="outline">
                  Amatör Rehberler
                </Chip>
                <Chip value="GUIDE" color="blue" variant="outline">
                  Rehberler
                </Chip>
                <Chip value="ADVISOR" color="blue" variant="outline">
                  Danışmanlar
                </Chip>
              </Group>
            </Chip.Group>
          </Group>
        </Stack>
      </Card>

      <Stack gap="md">
        {guides.map((guide) => (
          <Card
            key={guide.id}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/profile/${guide.id}`)}
          >
            <Group wrap="nowrap" justify="space-between">
              <Group wrap="nowrap" gap="md">
                <Box>{getRoleIcon(guide.role)}</Box>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Text fw={700}>{guide.name}</Text>
                    <Badge color={getRoleColor(guide.role)} variant="light">
                      {getRoleName(guide.role)}
                    </Badge>
                  </Group>
                  <Group gap="lg">
                    <Text size="sm" c="dimmed">
                      Bölüm: {Department[guide.major]}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Deneyim: {formatExperience(guide.experience)}
                    </Text>
                  </Group>
                </Stack>
              </Group>

              <Stack align="center">
                <Text c="dimmed" size="sm">Kimlik: {guide.id}</Text>
                {guide.role === 'GUIDE' && (
                  <Button
                    style={{
                      backgroundColor: 'lightblue',
                      color: 'darkblue',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handlePromotion(guide.id);
                    }}
                  >
                    <b>Danışman'a Yükselt</b>
                  </Button>
                )}
                {guide.role === 'ADVISOR' && (
                  <Button
                    style={{
                      backgroundColor: '#f7bf8b',
                      color: '#c44123',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handlePromotion(guide.id);
                    }}
                  >
                    <b>Koordinatör'e Yükselt</b>
                  </Button>
                )}
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
      <Space h="xl" />
    </Container>
  );
};

export default ManagePersonnel;
