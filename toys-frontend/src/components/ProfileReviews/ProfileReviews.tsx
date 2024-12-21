import React, { useEffect, useState, useContext } from 'react';
import { Paper, Stack, Text, Group, Title, Container, Alert, Card, Button } from '@mantine/core';
import { IconStarFilled, IconAlertCircle } from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { Review } from '../../types/data';

const GUIDE_REVIEW_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/review/of_guide");

interface GuideReviewsResponse {
  average: number;
  count: number;
  reviews: Review[];
}

interface ProfileRatingProps {
  guideId: string;
}

// Custom hook to share data fetching logic between components
const useGuideReviews = (guideId: string) => {
  const userContext = useContext(UserContext);
  const [reviewData, setReviewData] = useState<GuideReviewsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewUrl = new URL(GUIDE_REVIEW_URL);
        reviewUrl.searchParams.append('guide_id', guideId);
        reviewUrl.searchParams.append('auth', userContext.authToken);
        
        const response = await fetch(reviewUrl);
        if (!response.ok) {
          throw new Error('İncelemeler alınırken bir hata oluştu');
        }
        const data = await response.json();
        setReviewData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    if (userContext.authToken) {
      fetchReviews();
    }
  }, [guideId, userContext.authToken]);

  return { reviewData, error, loading };
};

// Top rating card component
export const ProfileRatingCard: React.FC<ProfileRatingProps> = ({ guideId }) => {
  const { reviewData, error, loading } = useGuideReviews(guideId);

  if (loading) {
    return null;
  }

  if (error || !reviewData) {
    return null;
  }

  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('profile-reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card 
      shadow="sm" 
      p="xl" 
      radius="md" 
      withBorder 
      className="bg-blue-50 mb-8"
    >
      <Stack align="center" gap="xs">
        <p>Rehberin İnceleme Puanı</p>
        <Group gap="xs" align="baseline">
          <IconStarFilled size={32} className="text-yellow-400" />
          <Text size="xl" fw={700} className="text-gray-800">
            {reviewData.average.toFixed(2)} / 10
          </Text>
        </Group>
        <Text size="sm" c="gray.6" className="text-center">
          ...{reviewData.count} turun ortalaması
        </Text>
        <Button
          variant="light"
          color="violet"
          onClick={scrollToReviews}
          className="mt-2"
        >
          İncelemeleri Gör
        </Button>
      </Stack>
    </Card>
  );
};

// Bottom reviews list component
export const ProfileReviewsList: React.FC<ProfileRatingProps> = ({ guideId }) => {
  const { reviewData, error, loading } = useGuideReviews(guideId);

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

  if (!reviewData || reviewData.count === 0) {
    return (
      <Alert 
        icon={<IconAlertCircle size={16} />} 
        color="blue" 
        variant="light" 
        title="Henüz inceleme yapılmadı"
      >
        Bu rehber için henüz inceleme bulunmuyor.
      </Alert>
    );
  }

  return (
    <Container size="md" px={0} id="profile-reviews-section">
      <Stack gap="xl">
        <Title order={3} className="text-gray-800">
          Tur İncelemeleri
        </Title>
        
        {reviewData.reviews.map((review) => (
          <Paper 
            key={review.id} 
            shadow="sm" 
            radius="lg" 
            p="xl" 
            withBorder
            className="border-l-4 border-l-violet-500"
          >
            <Stack gap="lg">
              <Group justify="space-between" wrap="nowrap">
                <Stack gap="xs">
                  <Text fw={600} size="lg" className="text-gray-800">
                    {formatDate(review.tour_date)} Tarihli Tur İncelemesi
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