import React, { useEffect, useState, useContext } from 'react';
import { Paper, Stack, Text, Group, Title, Container, Badge, Alert } from '@mantine/core';
import { IconStarFilled, IconAlertCircle } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { Review } from '../../types/data';

const REVIEW_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/review/of_tour");

interface TourReviewsProps {
  tourId: string;
}

const TourReviews: React.FC<TourReviewsProps> = ({ tourId }) => {
  const userContext = useContext(UserContext);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewUrl = new URL(REVIEW_URL);
        reviewUrl.searchParams.append('tour_id', tourId);
        reviewUrl.searchParams.append('auth', await userContext.getAuthToken());
        
        const response = await fetch(reviewUrl);
        if (!response.ok) {
          throw new Error('İncelemeler alınırken bir hata oluştu');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [tourId, userContext.getAuthToken]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <Text p="lg">İncelemeler yükleniyor...</Text>;
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
        {error}
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        color="blue" 
        variant="light" 
        title="Bu tur için henüz inceleme yapılmadı"
      >
        Tur başvurusunu yapan yetkiliye e-postasına gönderilen linkten inceleme yapması için hatırlatmada bulunabilirsiniz.
      </Alert>
    );
  }

  return (
    <Container size="md" px={0}>
      <Stack gap="xl">
        <Group justify="space-between" align="center">
          <Title order={3} className="text-gray-800">İncelemeler</Title>
          <Text size="sm" c="gray.6" fw={500}>Toplam: {reviews.length}</Text>
        </Group>
        
        {reviews.map((review) => (
          <Paper 
            key={review.id} 
            shadow="sm" 
            radius="lg" 
            p="xl"
            withBorder
            className={`border-l-4 ${review.for === 'TOUR' ? 'border-l-blue-500' : 'border-l-violet-500'}`}
          >
            <Stack gap="lg">
              <Group justify="space-between" wrap="nowrap">
                <Stack gap="xs">
                  <Group gap="md">
                    <Text fw={600} size="lg" className="text-gray-800">
                      {review.for === 'TOUR'
                        ? 'Tur İncelemesi'
                        : `${review?.guide?.name} için İnceleme`}
                    </Text>
                    <Badge 
                      variant="light"
                      color={review.for === 'TOUR' ? 'blue' : 'violet'}
                    >
                      {review.for === 'TOUR' ? 'Tur' : 'Rehber'}
                    </Badge>
                  </Group>
                  <Text size="sm" c="gray.6" className="leading-relaxed">
                    {formatDate(review.tour_date)} tarihli tur
                  </Text>
                </Stack>
                <Group gap="xs" className="bg-gray-50 px-4 py-2 rounded-full">
                  <IconStarFilled size={24} className="text-amber-400" />
                  <Text fw={700} size="xl" className="text-gray-800">
                    {review.score}
                  </Text>
                  <Text size="sm" c="gray.6">/10</Text>
                </Group>
              </Group>
              
              {review.body ? (
                <Text className="text-gray-600 leading-relaxed">
                  {review.body}
                </Text>
              ) : (
                <Text c="gray.5" fs="italic" className="leading-relaxed">
                  Bu incelemede yazılı yorum bulunmuyor.
                </Text>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default TourReviews;