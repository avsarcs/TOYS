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
  Button,
  TextInput,
  Pagination
} from '@mantine/core';
import { UserContext } from '../../context/UserContext';
import { IconUserCheck, IconUserX, IconClock, IconSearch } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { EventTypeText, EventType, TourStatusText, FairStatusText } from '../../types/enum';

interface InvitationModel {
  inviter: {
    id: string;
    name: string;
  };
  invited: {
    id: string;
    name: string;
  };
  event: {
    event_type: string;
    event_subtype: string;
    event_id: string;
    event_status: string;
    highschool: {
      id: string;
      name: string;
      location: string;
      priority: number;
      ranking: number;
    };
    accepted_time: string;
    requested_times: string[];
  };
  status: "WAITING_RESPONSE" | "ACCEPTED" | "REJECTED";
}

const INVITATIONS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/invitations");
const ITEMS_PER_PAGE = 5;

const GuideInvitations: React.FC = () => {
  const userContext = useContext(UserContext);
  const [invitations, setInvitations] = useState<InvitationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);

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

      // Always send all parameters
      url.searchParams.append('auth', authToken);
      url.searchParams.append('my_invitations', showOnlyMine.toString());
      url.searchParams.append('invited_name', searchName || '');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('per_page', ITEMS_PER_PAGE.toString());

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setInvitations(data);
      } else {
        throw new Error('Failed to fetch invitations');
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
      notifications.show({
        color: 'red',
        title: 'Hata!',
        message: 'Davetiyeler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setLoading(false);
    }
  }, [userContext, showOnlyMine, searchName, page]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPage(1); // Reset to first page when searching
      fetchInvitations();
    }
  };

  return (
    <Container size="xl" p="md">
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={1} className="text-blue-700 font-bold">
            Rehberlik Etme Davetiyeleri
          </Title>
          <Switch
            checked={showOnlyMine}
            onChange={(event) => {
              setShowOnlyMine(event.currentTarget.checked);
              setPage(1); // Reset to first page when toggling
            }}
            label="Sadece Benim Gönderdiğim Davetiyeleri Göster"
            labelPosition="left"
          />
        </Group>

        <TextInput
          placeholder="Rehber ismi ile ara..."
          value={searchName}
          onChange={(event) => setSearchName(event.currentTarget.value)}
          onKeyPress={handleSearch}
          leftSection={<IconSearch size={16} />}
        />

        <Divider className="border-gray-400" />

        <div style={{ position: 'relative', minHeight: '200px' }}>
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          <Stack gap="md">
            {invitations.length > 0 ? (
              invitations.map((invitation) => (
                <Card key={`${invitation.event.event_id}-${invitation.invited.id}`} shadow="sm" p="lg" radius="md" withBorder>
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
                          href={`/tour/${invitation.event.event_id}`}
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
                        Okul: {invitation.event.highschool.name}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Etkinlik Türü: {EventTypeText[invitation.event.event_type as keyof typeof EventTypeText]}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Etkinlik Durumu: {
                          invitation.event.event_type === EventType.TOUR
                            ? TourStatusText[invitation.event.event_status as keyof typeof TourStatusText]
                            : FairStatusText[invitation.event.event_status as keyof typeof FairStatusText]
                        }
                      </Text>
                      {invitation.event.accepted_time && (
                        <Text size="sm" c="dimmed">
                          Kabul Edilen Zaman: {new Date(invitation.event.accepted_time).toLocaleString('tr-TR')}
                        </Text>
                      )}
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

        {invitations.length > 0 && (
          <Group justify="center" mt="xl">
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.ceil(invitations.length / ITEMS_PER_PAGE)}
            />
          </Group>
        )}
      </Stack>
    </Container>
  );
};

export default GuideInvitations;