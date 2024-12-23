import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Box, Card, Text, Group, Title, Divider, Button, Avatar, Tooltip, Stack } from '@mantine/core';
import { IconUsers, IconUserCheck } from '@tabler/icons-react';
import { UserContext } from "../../context/UserContext";
import { TourStatus, UserRole } from "../../types/enum";
import ManageGuidesWindow from "./ManageGuidesWindow";
import { TourData } from "../../types/data";
import { Link } from 'react-router-dom';
import { SimpleGuideData } from '../../types/data';

interface TourSectionProps {
  tour: TourData;
  refreshTour: () => void;
}

interface GuideSectionProps {
  title: string;
  guides?: {
    id: string;
    full_name: string;
    highschool: {
      id: string;
      name: string;
    };
  }[];
  color?: string;
}

export const VISITOR_PER_GUIDE = 60;

export const GuideInformation: React.FC<TourSectionProps> = ({ tour, refreshTour }) => {
  const userContext = useContext(UserContext);
  const [manageGuidesOpen, setManageGuidesOpen] = useState(false);
  const totalGuidesNeeded = Math.ceil(tour.visitor_count / VISITOR_PER_GUIDE);

  const [invitedGuides, setInvitedGuides] = useState<SimpleGuideData[]>([]);
  const [, setLoadingInvites] = useState(false);

  const fetchInvitedGuides = useCallback(async () => {
    if (!tour.tour_id) return;

    setLoadingInvites(true);
    try {
      const invitesUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/invites-of");
      invitesUrl.searchParams.append("event_id", tour.tour_id);
      invitesUrl.searchParams.append("auth", await userContext.getAuthToken());

      const response = await fetch(invitesUrl);
      if (!response.ok) throw new Error("Failed to fetch invites");

      const data = await response.json();
      setInvitedGuides(data);
    } catch (error) {
      console.error("Error fetching invites:", error);
    } finally {
      setLoadingInvites(false);
    }
  }, [tour.tour_id]);


  useEffect(() => {
    fetchInvitedGuides();
  }, [fetchInvitedGuides]);

  const GuideSection: React.FC<GuideSectionProps> = ({ title, guides = [], color = "blue" }) => (
    <Box>
      <Text size="sm" fw={600} c="gray.6" mb="xs">{title}</Text>
      {guides && guides.length > 0 && guides[0]?.full_name ? (
        <Group gap="sm">
          {guides.map((guide, index) => (
            <Tooltip
              key={index}
              label={guide?.highschool?.name ? `${guide.full_name} (${guide.highschool.name})` : guide.full_name}
            >
              <Link to={`/profile/${guide?.id}`}>
                <Card withBorder p="xs" className={`bg-${color}-50`}>
                  <Group gap="sm">
                    <Avatar size="sm" color={color} radius="xl">
                      {guide.full_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Text size="sm" fw={500}>{guide.full_name}</Text>
                      <Text size="xs" c="gray.6">{guide.highschool?.name || ''}</Text>
                    </Box>
                  </Group>
                </Card>
              </Link>
            </Tooltip>
          ))}
        </Group>
      ) : (
        <Text c="gray.5" fz="sm" fs="italic">Henüz atanmamış</Text>
      )}
    </Box>
  );

  return (
    <Card withBorder radius="md" className="bg-white shadow-sm">
      <Card.Section p="md" className="bg-blue-50">
        <Group justify="space-between">
          <Group gap="sm">
            <IconUsers size={24} className="text-blue-600" />
            <Title order={3} className="text-blue-800">Rehber Bilgileri</Title>
          </Group>
          {(userContext.user.role === UserRole.ADVISOR || userContext.user.role === UserRole.COORDINATOR || userContext.user.role === UserRole.DIRECTOR) && tour.status === TourStatus.CONFIRMED && (
            <Button
              variant="light"
              leftSection={<IconUserCheck size={18} />}
              onClick={() => setManageGuidesOpen(true)}
            >
              Rehberleri Yönet
            </Button>
          )}
        </Group>
      </Card.Section>
      <Stack p="md" gap="lg">
        <GuideSection
          title="Rehberler"
          guides={tour?.guides || []}
          color="blue"
        />
        <Divider variant="dashed" />
        <GuideSection
          title="Amatör Rehberler"
          guides={tour?.trainee_guides || []}
          color="cyan"
        />
        
        {invitedGuides.length > 0 && (
          <>
            <Divider variant="dashed" />
            <Box>
              <Text size="sm" fw={600} c="gray.6" mb="xs">Davet Edilmiş Rehberler</Text>
              <Group gap="sm">
                {invitedGuides.map((guide, index) => (
                  <Tooltip
                    key={index}
                    label={`${guide.name} (Yanıt Bekliyor)`}
                  >
                    <Card withBorder p="xs" className="bg-yellow-50">
                      <Group gap="sm">
                        <Avatar size="sm" color="yellow" radius="xl">
                          {guide.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Text size="sm" fw={500}>{guide.name}</Text>
                          <Text size="xs" c="gray.6">Yanıt Bekliyor</Text>
                        </Box>
                      </Group>
                    </Card>
                  </Tooltip>
                ))}
              </Group>
            </Box>
          </>
        )}

        <Box>
          <Text size="sm" c="gray.6">
            Bu tur için gereken toplam rehber sayısı: {totalGuidesNeeded}
          </Text>
        </Box>
      </Stack>
      {tour && (
        <ManageGuidesWindow
          opened={manageGuidesOpen}
          onClose={() => setManageGuidesOpen(false)}
          tour={tour}
          totalGuidesNeeded={totalGuidesNeeded}
          refreshTour={refreshTour}
        />
      )}
    </Card>
  );
};

export default GuideInformation;