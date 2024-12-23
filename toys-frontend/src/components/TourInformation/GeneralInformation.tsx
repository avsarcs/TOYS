import React from 'react';
import { Department } from '../../types/enum';
import { TourSectionProps } from "../../types/designed";
import { Box, Card, Text, Group, Badge, Title, Divider, Grid, Stack, Popover, Button } from '@mantine/core';
import { IconCalendarTime, IconSchool, IconNotebook, IconMapPin, IconCalendarDue, IconUsers, IconUser, IconMail, IconPhone, IconCopy } from '@tabler/icons-react';
import { TourStatus } from "../../types/enum";
import dayjs from 'dayjs';
import { parsePhoneNumber } from "libphonenumber-js/max";

const GeneralInformation: React.FC<TourSectionProps> = ({ tour }) => {
  const formatTimeRange = (startTime: string) => {
    const start = dayjs(startTime);
    return `${start.format("DD MMMM YYYY")} ${start.format("HH:mm")}`;
  };

  const getTurkishMajorName = (major: string): string => {
    return Department[major as keyof typeof Department] || major;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const TimeDisplay = () => {
    if (tour.status === TourStatus.CONFIRMED || tour.status === TourStatus.ONGOING || tour.status === TourStatus.FINISHED) {
      return (
        <Grid.Col span={12}>
          <Group gap="xs" align="flex-start">
            <IconCalendarTime size={20} className="text-gray-600" />
            <Box>
              <Text fw={600}>Onaylanan Zaman:</Text>
              <Text>{formatTimeRange(tour.accepted_time)}</Text>
            </Box>
          </Group>
        </Grid.Col>
      );
    }
    return (
      <Grid.Col span={12}>
        <Group gap="xs" align="flex-start">
          <IconCalendarDue size={20} className="text-gray-600" />
          <Box>
            <Text fw={600}>İstenen Zamanlar:</Text>
            <Stack gap="xs" mt="xs">
              {tour.requested_times.map((time, index) => (
                <Text key={index} size="sm">
                  {index + 1}. Tercih: {formatTimeRange(time)}
                </Text>
              ))}
            </Stack>
          </Box>
        </Group>
      </Grid.Col>
    );
  };

  return (
    <Card withBorder radius="md" className="bg-white shadow-sm">
      <Card.Section p="md" className="bg-blue-50">
        <Group gap="sm">
          <IconSchool size={24} className="text-blue-600" />
          <Title order={3} className="text-blue-800">Genel Bilgiler</Title>
        </Group>
      </Card.Section>

      <Stack p="md" gap="md">
        <Grid>
          <Grid.Col span={6}>
            <Group gap="xs">
              <IconMapPin size={20} className="text-gray-600" />
              <Text fw={600}>Lise:</Text>
              <Text>{tour.highschool.name}</Text>
            </Group>
          </Grid.Col>
          {tour.classroom && (
            <Grid.Col span={6}>
              <Group gap="xs">
                <IconNotebook size={20} className="text-gray-600" />
                <Text fw={600}>Soru-Cevap Odası:</Text>
                <Text>{tour.classroom}</Text>
              </Group>
            </Grid.Col>
          )}

          <Grid.Col span={6}>
            <Group gap="xs">
              <IconUsers size={20} className="text-gray-600" />
              <Text fw={600}>Katılımcı Sayısı:</Text>
              <Text>{tour.visitor_count}</Text>
            </Group>
          </Grid.Col>

          <Grid.Col span={12}>
            <Divider my="sm" />
            <Group gap="lg" align="flex-start">
              <Group gap="xs">
                <IconUser size={20} className="text-gray-600" />
                <Text fw={600}>Başvuran:</Text>
                <Text>{tour.applicant.fullname}</Text>
              </Group>

              <Popover width={300} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Button variant="light" size="sm">
                    İletişim Bilgileri
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Stack gap="md">
                    <Group gap="xs">
                      <IconMail size={18} />
                      <Text fw={500}>{tour.applicant.email}</Text>
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => handleCopy(tour.applicant.email)}
                        p={4}
                      >
                        <IconCopy size={16} />
                      </Button>
                    </Group>
                    <Group gap="xs">
                      <IconPhone size={18} />
                      <Text fw={500}>
                        {parsePhoneNumber(tour.applicant.phone, "TR").formatInternational()}
                      </Text>
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => handleCopy(tour.applicant.phone)}
                        p={4}
                      >
                        <IconCopy size={16} />
                      </Button>
                    </Group>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            </Group>
          </Grid.Col>

          <TimeDisplay />
        </Grid>

        {tour.type === "INDIVIDUAL" && tour.requested_majors && tour.requested_majors.length > 0 && (
          <>
            <Divider />
            <Box>
              <Text fw={600} mb="xs">İstenen Rehber Bölümleri:</Text>
              <Group gap="xs">
                {tour.requested_majors.map((major, index) => (
                  <Badge key={index} color="blue" variant="light" size="lg">
                    {getTurkishMajorName(major)}
                  </Badge>
                ))}
              </Group>
            </Box>
          </>
        )}

        {tour.applicant.notes && tour.applicant.notes.trim() !== "" && (
          <>
            <Divider />
            <Box>
              <Group gap="xs" mb="xs">
                <IconNotebook size={20} className="text-gray-600" />
                <Text fw={600}>Başvuran Notları:</Text>
              </Group>
              <Text className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200">
                {tour.applicant.notes}
              </Text>
            </Box>
          </>
        )}
      </Stack>
    </Card>
  );
};

export default GeneralInformation;