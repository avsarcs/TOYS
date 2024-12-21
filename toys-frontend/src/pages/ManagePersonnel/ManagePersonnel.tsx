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
  Space,
  Chip
} from '@mantine/core';
import { UserContext } from '../../context/UserContext';
import { IconSearch, IconUser, IconStarFilled, IconBriefcase } from '@tabler/icons-react';
import { SimpleGuideData } from '../../types/data';
import MockSimpleGuides from "../../mock_data/mock_simple_guides1.json"

const GUIDES_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/guides");

const ManagePersonnel: React.FC = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [guides, setGuides] = useState<SimpleGuideData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const fetchGuides = useCallback(async () => {
    const guidesUrl = new URL(GUIDES_URL);
    guidesUrl.searchParams.append("auth", userContext.authToken);
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

    setGuides(MockSimpleGuides)
  }, [userContext.authToken, searchQuery, selectedTypes]);

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
                <Box>
                  {getRoleIcon(guide.role)}
                </Box>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Text fw={700}>{guide.name}</Text>
                    <Badge color={getRoleColor(guide.role)} variant="light">
                      {getRoleName(guide.role)}
                    </Badge>
                  </Group>
                  <Group gap="lg">
                    <Text size="sm" c="dimmed">Bölüm: {guide.major}</Text>
                    <Text size="sm" c="dimmed">Deneyim: {formatExperience(guide.experience)}</Text>
                  </Group>
                </Stack>
              </Group>
              
              <Text c="dimmed" size="sm">Kimlik: {guide.id}</Text>
            </Group>
          </Card>
        ))}
      </Stack>
      <Space h="xl" />
    </Container>
  );
};

export default ManagePersonnel;