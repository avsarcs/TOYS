import React from 'react';
import { Card, Text, Group, Stack, Button, Title, Paper } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

const ReviewDetailsPage = () => {
  const mockReview = {
    for: "TOUR",
    tour_date: "2024-10-15T11:00:00Z",
    score: 8,
    body: "Bu tur deneyimi mükemmeldi. Rehber çok bilgili ve tüm oturum boyunca ilgi çekiciydi.",
    guide: { name: "John Smith" }
  };

  // Mock tour data
  const tourData = {
    highschool: {
      name: "Ankara Fen Lisesi"
    },
    guides: [
      {
        id: "guide_123",
        full_name: "Scarlett Johansson",
      }
    ],
    accepted_time: "2024-10-15T11:00:00Z",
    visitor_count: 50,
    classroom: "Mithat Çoruh",
    status: "COMPLETED"
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'COMPLETED': 'Tamamlandı',
      'PENDING': 'Beklemede',
      'CANCELLED': 'İptal Edildi'
    };
    return statusMap[status] || status;
  };

  return (
    <Stack gap="xl" maw={1000} mx="auto" p="md">
      {/* Back Button */}
      <Group>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          variant="subtle"
          color="violet"
        >
          Geri
        </Button>
      </Group>

      {/* Review Section */}
      <Paper shadow="sm" radius="md" p="lg" withBorder>
        <Stack gap="md">
          <Stack gap="xs">
            <Title order={2}>İnceleme</Title>
            <Text size="sm" c="gray.7">
              {mockReview.for === "TOUR"
                ? `${formatDate(mockReview.tour_date)} tarihli tur üzerine`
                : `${mockReview.guide.name} üzerine`}
            </Text>
          </Stack>

          <Group>
            <Text size="xl" fw={700} c="violet">
              {mockReview.score}
            </Text>
            <Text size="sm" c="gray.7">/ 10 puan</Text>
          </Group>

          <Text>{mockReview.body}</Text>
        </Stack>
      </Paper>

      {/* Tour Details Section */}
      <Card withBorder shadow="sm" radius="md" p="lg">
        <Stack gap="lg">
          <Title order={3}>Tur Bilgileri</Title>

          <Stack gap="lg">
            <Group grow>
              <DetailItem label="Lise" value={tourData.highschool.name} />
              <DetailItem 
                label="Durum" 
                value={getStatusText(tourData.status)}
                valueProps={{ 
                  c: tourData.status === 'COMPLETED' ? 'green' : 'blue',
                  fw: 500 
                }}
              />
            </Group>
            <Group grow>
              <DetailItem 
                label="Tarih ve Saat" 
                value={formatDate(tourData.accepted_time)} 
              />
              <DetailItem label="Sınıf" value={tourData.classroom} />
            </Group>
            <Group grow>
              <DetailItem 
                label="Katılımcı Sayısı" 
                value={tourData.visitor_count} 
              />
              <DetailItem 
                label="Rehber" 
                value={tourData.guides.map(guide => guide.full_name).join(', ')} 
              />
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

const DetailItem = ({ label, value, valueProps = {} }) => (
  <Stack gap={4}>
    <Text size="sm" c="gray.7" fw={500}>
      {label}
    </Text>
    <Text fw={500} {...valueProps}>
      {value}
    </Text>
  </Stack>
);

export default ReviewDetailsPage;