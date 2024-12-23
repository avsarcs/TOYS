import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Card,
  Container,
  Group,
  Title,
  Text,
  Stack,
  Badge,
  LoadingOverlay,
  Collapse,
  Divider,
  Button
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { UserContext } from '../../context/UserContext';
import { 
  IconSchool, 
  IconBriefcase, 
  IconMail, 
  IconPhone, 
  IconWorld,
  IconInfoCircle,
  IconTarget
} from '@tabler/icons-react';
import { TraineeGuideApplicationData } from '../../types/data';
import {Department} from "../../types/enum.ts";

const APPLICATIONS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/people/applications");
const RESPOND_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/guide");

const ToysApplications: React.FC = () => {
  const userContext = useContext(UserContext);
  const [applications, setApplications] = useState<TraineeGuideApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const applicationsUrl = new URL(APPLICATIONS_URL);
      applicationsUrl.searchParams.append("auth", await userContext.getAuthToken());
      const res = await fetch(applicationsUrl, {
        method: "GET"
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }, [userContext]);

  const handleApplicationResponse = async (applicantId: string, accept: boolean) => {
    try {
      const respondUrl = new URL(RESPOND_URL);
      respondUrl.searchParams.append("auth", await userContext.getAuthToken());
      respondUrl.searchParams.append("applicant_id", applicantId);
      respondUrl.searchParams.append("response", accept.toString());

      const res = await fetch(respondUrl, {
        method: "POST"
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı',
          message: accept ? 'Başvuru kabul edildi.' : 'Başvuru reddedildi.',
          color: 'green'
        });
        // Refresh the applications list
        fetchApplications();
      } else {
        throw new Error('Response not ok');
      }
    } catch (error) {
      console.error('Error responding to application:', error);
      notifications.show({
        title: 'Hata',
        message: 'Bir şeyler yanlış gitti. Lütfen tekrar deneyin.',
        color: 'red'
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCardClick = (id: string) => {
    setOpenCardId(openCardId === id ? null : id);
  };

  return (
    <Container size="xl" p="md">
      <Title order={1} className="text-blue-700 font-bold mb-6">
        Rehber Adayı Başvuruları
      </Title>
     
      <Stack gap="md" pos="relative">
        <LoadingOverlay visible={loading} />
       
        {applications.map((application) => (
          <Card
            key={application.id}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleCardClick(application.id)}
          >
            <Stack gap="md">
              <Group justify="space-between" wrap="nowrap">
                <Group gap="md">
                  <IconSchool size={24} />
                  <div>
                    <Text fw={700}>{application.fullname}</Text>
                    <Text size="sm" c="dimmed">Öğrenci No: {application.id}</Text>
                  </div>
                </Group>
                <Badge color="blue">
                  {Department[application.major as keyof typeof Department]}
                </Badge>
              </Group>

              <Group gap="lg">
                <Group gap="xs">
                  <IconBriefcase size={16} />
                  <Text size="sm">{application.highschool.name}</Text>
                </Group>
                <Group gap="xs">
                  <IconMail size={16} />
                  <Text size="sm">{application.email}</Text>
                </Group>
                <Group gap="xs">
                  <IconPhone size={16} />
                  <Text size="sm">{application.phone}</Text>
                </Group>
              </Group>

              <Group justify="flex-end" gap="md">
                <Button
                  variant="outline"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card collapse
                    handleApplicationResponse(application.id, false);
                  }}
                >
                  Başvuruyu Reddet
                </Button>
                <Button
                  color="blue"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card collapse
                    handleApplicationResponse(application.id, true);
                  }}
                >
                  Başvuruyu Kabul Et
                </Button>
              </Group>

              <Collapse in={openCardId === application.id}>
                <Divider my="sm" />
                <Stack gap="md" mt="md">
                  <Group gap="xs">
                    <IconWorld size={18} />
                    <Text fw={500}>Gelecek Dönem Değişim Programı:</Text>
                    <Text>{application.next_semester_exchange ? 'Evet' : 'Hayır'}</Text>
                  </Group>

                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconInfoCircle size={18} />
                      <Text fw={500}>Bizi nereden duydunuz?</Text>
                    </Group>
                    <Text size="sm" ml={26}>{application.how_did_you_hear}</Text>
                  </Stack>

                  <Stack gap="xs">
                    <Group gap="xs">
                      <IconTarget size={18} />
                      <Text fw={500}>Neden başvurdunuz?</Text>
                    </Group>
                    <Text size="sm" ml={26}>{application.why_apply}</Text>
                  </Stack>
                </Stack>
              </Collapse>
            </Stack>
          </Card>
        ))}

        {!loading && applications.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            Bekleyen başvuru bulunmamaktadır.
          </Text>
        )}
      </Stack>
    </Container>
  );
};

export default ToysApplications;