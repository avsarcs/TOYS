import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Text, Group, Stack, Button, Title, Paper, Loader, Alert } from '@mantine/core';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';

const REVIEW_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/review");
const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour");

const ReviewDetailsPage = () => {
  const { review_id } = useParams();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<any>(null);
  const [tourData, setTourData] = useState<any>(null);

  useEffect(() => {
    const fetchReviewAndTour = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch review details
        const reviewUrl = new URL(REVIEW_URL);
        reviewUrl.searchParams.append('review_id', review_id || '');
        reviewUrl.searchParams.append('auth', userContext.authToken);

        const reviewRes = await fetch(reviewUrl);
        if (!reviewRes.ok) {
          throw new Error('Failed to fetch review details');
        }
        const reviewData = await reviewRes.json();
        setReview(reviewData);

        // Fetch tour details
        const tourUrl = new URL(TOUR_URL);
        tourUrl.searchParams.append('auth', userContext.authToken);
        tourUrl.searchParams.append('tid', reviewData.tour_id);

        const tourRes = await fetch(tourUrl);
        if (!tourRes.ok) {
          throw new Error('Failed to fetch tour details');
        }
        const tourDetails = await tourRes.json();
        setTourData(tourDetails);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (review_id && userContext.authToken) {
      fetchReviewAndTour();
    }
  }, [review_id, userContext.authToken]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'RECEIVED': 'Alındı',
      'TOYS_WANTS_CHANGE': 'TOYS Değişiklik İstiyor',
      'APPLICANT_WANTS_CHANGE': 'Başvuran Değişiklik İstiyor',
      'CONFIRMED': 'Onaylandı',
      'REJECTED': 'Reddedildi',
      'CANCELLED': 'İptal Edildi',
      'ONGOING': 'Devam Ediyor',
      'FINISHED': 'Tamamlandı'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'RECEIVED': 'blue',
      'TOYS_WANTS_CHANGE': 'yellow',
      'APPLICANT_WANTS_CHANGE': 'yellow',
      'CONFIRMED': 'green',
      'REJECTED': 'red',
      'CANCELLED': 'red',
      'ONGOING': 'blue',
      'FINISHED': 'green'
    };
    return colorMap[status] || 'gray';
  };

  if (isLoading) {
    return (
      <Stack justify="center" align="center" h="100vh">
        <Loader size="lg" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Hata" color="red" variant="filled">
        {error}
      </Alert>
    );
  }

  if (!review || !tourData) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Hata" color="yellow" variant="filled">
        İnceleme veya tur bilgileri bulunamadı.
      </Alert>
    );
  }

  return (
    <Stack gap="xl" maw={1000} mx="auto" p="md">
      <Group>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          variant="subtle"
          color="violet"
          onClick={() => navigate(-1)}
        >
          Geri
        </Button>
      </Group>

      <Paper shadow="sm" radius="md" p="lg" withBorder>
        <Stack gap="md">
          <Stack gap="xs">
            <Title order={2}>İnceleme</Title>
            <Text size="sm" c="gray.7">
              {review.for === "TOUR"
                ? `${formatDate(review.tour_date)} tarihli tur üzerine`
                : `${review.guide?.name || 'Rehber'} üzerine`}
            </Text>
          </Stack>
          <Group>
            <Text size="xl" fw={700} c="violet">
              {review.score}
            </Text>
            <Text size="sm" c="gray.7">/ 10 puan</Text>
          </Group>
          {review.body && <Text>{review.body}</Text>}
        </Stack>
      </Paper>

      <Card withBorder shadow="sm" radius="md" p="lg">
        <Stack gap="lg">
          <Title order={3}>Tur Bilgileri</Title>
          <Stack gap="lg">
            <Group grow>
              <DetailItem label="Lise" value={tourData.highschool?.name} />
              <DetailItem
                label="Durum"
                value={getStatusText(tourData.status)}
                valueProps={{
                  c: getStatusColor(tourData.status),
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
                value={tourData.guides?.map(guide => guide.full_name).join(', ')}
              />
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

const DetailItem = ({ 
  label, 
  value, 
  valueProps = {} 
}: { 
  label: string; 
  value: string | number; 
  valueProps?: Record<string, any>; 
}) => (
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