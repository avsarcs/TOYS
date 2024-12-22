import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Container,
  Title,
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
  LoadingOverlay,
  Switch,
  Button
} from '@mantine/core';
import { UserContext } from '../../context/UserContext';
import { IconUserCheck, IconUserX, IconClock } from '@tabler/icons-react';

interface InvitationModel {
  inviter: {
    id: string;
    name: string;
  };
  invited: {
    id: string;
    name: string;
  };
  event_id: string;
  status: "WAITING_RESPONSE" | "ACCEPTED" | "REJECTED";
}

const INVITATIONS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/invitations");

const GuideInvitations: React.FC = () => {
  const userContext = useContext(UserContext);
  const [invitations, setInvitations] = useState<InvitationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING_RESPONSE':
        return 'yellow';
      case 'ACCEPTED':
        return 'green';
      case 'REJECTED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WAITING_RESPONSE':
        return <IconClock size={18} />;
      case 'ACCEPTED':
        return <IconUserCheck size={18} />;
      case 'REJECTED':
        return <IconUserX size={18} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WAITING_RESPONSE':
        return 'Yanıt Bekleniyor';
      case 'ACCEPTED':
        return 'Kabul Edildi';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = await userContext.getAuthToken();
      const url = new URL(INVITATIONS_URL);
      url.searchParams.append('auth', authToken);
      url.searchParams.append('my_invitations', showOnlyMine ? 'true' : 'false');

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  }, [userContext, showOnlyMine]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  return (
    <Container size="xl" p="md">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1} className="text-blue-700 font-bold">
            Rehberlik Etme Davetiyeleri
          </Title>
          <Switch
            checked={showOnlyMine}
            onChange={(event) => setShowOnlyMine(event.currentTarget.checked)}
            label="Sadece Benim Gönderdiğim Davetiyeleri Göster"
            labelPosition="left"
          />
        </Group>
        <Divider className="border-gray-400" />
        
        <div style={{ position: 'relative', minHeight: '200px' }}>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          <Stack gap="md">
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <Card key={invitation.event_id} shadow="sm" p="lg" radius="md" withBorder>
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Group>
                        <Text size="lg" fw={500}>
                          Davet Edilen: {invitation.invited.name}
                        </Text>
                        <Badge 
                          color={getStatusColor(invitation.status)}
                          leftSection={getStatusIcon(invitation.status)}
                        >
                          {getStatusText(invitation.status)}
                        </Badge>
                      </Group>
                      <Group gap="xs">
                        <Button 
                          variant="light" 
                          color="blue"
                          component="a"
                          href={`/profile/${invitation.invited.id}`}
                          size="xs"
                        >
                          Rehber Profili
                        </Button>
                        <Button
                          variant="light"
                          color="blue"
                          component="a"
                          href={`/tour/${invitation.event_id}`}
                          size="xs"
                        >
                          Tur Sayfası
                        </Button>
                      </Group>
                    </Group>
                    <Group gap="md">
                      <Text size="sm" c="dimmed">
                        Davet Eden: {invitation.inviter.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Etkinlik ID: {invitation.event_id}
                      </Text>
                    </Group>
                  </Stack>
                </Card>
              ))
            ) : (
              <Text ta="center" c="dimmed" size="lg">
                {showOnlyMine ? 
                  'Henüz bir rehberlik daveti göndermemişsiniz.' : 
                  'Herhangi bir rehberlik daveti bulunmamaktadır.'}
              </Text>
            )}
          </Stack>
        </div>
      </Stack>
    </Container>
  );
};

export default GuideInvitations;