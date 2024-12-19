import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Slider,
    Textarea,
    Button,
    Stack,
    Paper,
    Box,
    LoadingOverlay,
    Center,
    Collapse,
    Alert,
    Group
} from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconInfoCircle, IconMessageCircle } from '@tabler/icons-react';

interface Guide {
    id: string;
    name: string;
}

interface TourToReviewModel {
    tour_id: string;
    tour_date: string;
    guides: {
        id: string;
        name: string;
    }[];
}

interface ReviewCreateModel {
    for: 'TOUR' | 'GUIDE';
    tour_id: string;
    tour_date: string;
    guide?: {
        id: string;
        name: string;
    };
    score: number;
    body?: string;
}

interface GuideReview {
    guideId: string;
    score: number;
    comment: string;
}

const REVIEW_DETAILS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/review/tour-details");
const SUBMIT_REVIEW_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/review/tour");

const TourReviewPage: React.FC = () => {
    const { 'reviewer-id': reviewerId } = useParams<{ 'reviewer-id': string }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tourData, setTourData] = useState<TourToReviewModel | null>(null);
    const [optionalFieldsOpen, setOptionalFieldsOpen] = useState<boolean>(false);
    const [hasOpenedOptionalFields, setHasOpenedOptionalFields] = useState<boolean>(false);
    const [showPrompt, setShowPrompt] = useState<boolean>(false);
    const [hasComments, setHasComments] = useState<boolean>(false);

    const [tourScore, setTourScore] = useState<number>(5);
    const [tourComment, setTourComment] = useState<string>('');
    const [guideReviews, setGuideReviews] = useState<GuideReview[]>([]);
    
    useEffect(() => {
        const fetchTourDetails = async () => {
            if (!reviewerId) {
                setError('Invalid reviewer ID');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const detailsUrl = new URL(REVIEW_DETAILS_URL);
                detailsUrl.searchParams.append('reviewer_id', reviewerId);
                
                const response = await fetch(detailsUrl);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch tour details');
                }

                const tourToReviewData: TourToReviewModel = await response.json();
                setTourData(tourToReviewData);
                
                // Initialize guide reviews
                setGuideReviews(tourToReviewData.guides.map(guide => ({
                    guideId: guide.id,
                    score: 5,
                    comment: ''
                })));
            } catch (err) {
                setError('Failed to load tour details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTourDetails();
    }, [reviewerId]);

    useEffect(() => {
        const hasAnyComments = tourComment.trim() !== '' ||
            guideReviews.some(review => review.comment.trim() !== '');
        setHasComments(hasAnyComments);
    }, [tourComment, guideReviews]);

    const handleOptionalFieldsToggle = () => {
        setOptionalFieldsOpen(!optionalFieldsOpen);
        setHasOpenedOptionalFields(true);
        setShowPrompt(false);
    };

    const handleGuideReviewChange = (index: number, field: 'score' | 'comment', value: number | string): void => {
        setGuideReviews(prev => {
            const newReviews = [...prev];
            newReviews[index] = {
                ...newReviews[index],
                [field]: value
            };
            return newReviews;
        });
    };

    const handleSubmitInitial = () => {
        if (!hasOpenedOptionalFields) {
            setOptionalFieldsOpen(false);
            setShowPrompt(true);
            return;
        }

        handleFinalSubmit();
    };

    const handleYorumYap = () => {
        setShowPrompt(false);
        setOptionalFieldsOpen(true);
        setHasOpenedOptionalFields(true);
    };

    const handleFinalSubmit = async () => {
        if (!tourData || !reviewerId) return;

        try {
            setIsLoading(true);

            // Create review models array
            const reviews: ReviewCreateModel[] = [
                // Tour review
                {
                    for: 'TOUR',
                    tour_id: tourData.tour_id,
                    tour_date: tourData.tour_date,
                    score: tourScore,
                    body: tourComment.trim() || ""
                },
                // Guide reviews
                ...tourData.guides.map((guide, index) => ({
                    for: 'GUIDE' as const,
                    tour_id: tourData.tour_id,
                    tour_date: tourData.tour_date,
                    guide: {
                        id: guide.id,
                        name: guide.name
                    },
                    score: guideReviews[index].score,
                    body: guideReviews[index].comment.trim() || ""
                }))
            ];

            const submitUrl = new URL(SUBMIT_REVIEW_URL);
            submitUrl.searchParams.append('reviewer_id', reviewerId);

            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviews)
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            // Handle successful submission (you might want to redirect or show a success message)
            
        } catch (err) {
            setError('Failed to submit review. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (isoDate: string): string => {
        return new Date(isoDate).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (error) {
        return (
            <Center h={200}>
                <Text className="text-red-600 font-medium">{error}</Text>
            </Center>
        );
    }

    if (!tourData) {
        return (
            <Center h={200}>
                <LoadingOverlay visible={isLoading} />
            </Center>
        );
    }

    const renderSubmitButton = () => {
        if (showPrompt) {
            return null;
        }

        return (
            <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2 rounded-lg transition-colors mt-6 w-full sm:w-auto"
                onClick={hasOpenedOptionalFields ? handleFinalSubmit : handleSubmitInitial}
            >
                {hasComments ? "Yorumlarla Birlikte Gönder" : "Gönder"}
            </Button>
        );
    };

    // Rest of the component remains the same...
    return (
        <Container size="sm" className="py-8 relative max-w-2xl mx-auto">
            <LoadingOverlay visible={isLoading} />

            <Title order={2} className="text-blue-700 font-sans text-3xl mb-6">
                Turu İnceleyin!
            </Title>

            <Text className="text-gray-600 font-sans text-lg mb-8 leading-relaxed">
                Turumuzu incelediğiniz için teşekkür ederiz!
                Burada verdiğiniz geribildirimi gelecekteki turlarımızı iyileştirmek için kullanacağız.
            </Text>

            <Stack gap="lg">
                <Paper shadow="sm" p="lg" className="bg-white rounded-lg">
                    <Text className="text-gray-800 font-medium text-xl mb-6">
                        {formatDate(tourData.tour_date)} tarihli Bilkent turunuz nasıldı?
                    </Text>
                    <Box className="px-6">
                        <Slider
                            min={0}
                            max={10}
                            step={1}
                            value={tourScore}
                            onChange={setTourScore}
                            marks={[
                                { value: 0, label: 'Çok Kötü' },
                                { value: 5, label: 'Normal' },
                                { value: 10, label: 'Çok İyi' }
                            ]}
                            className="mb-4"
                            styles={{
                                mark: { borderColor: '#4A90E2' },
                                markLabel: { fontSize: '0.9rem', color: '#4A5568' },
                                thumb: { borderColor: '#4A90E2', backgroundColor: '#fff' },
                                track: { backgroundColor: '#4A90E2' }
                            }}
                        />
                    </Box>
                </Paper>

                {tourData.guides.map((guide, index) => (
                    <Paper key={guide.id} shadow="sm" p="lg" className="bg-white rounded-lg">
                        <Text className="text-gray-800 font-medium text-xl mb-6">
                            Rehberiniz {guide.name} nasıldı?
                        </Text>
                        <Box className="px-6">
                            <Slider
                                min={0}
                                max={10}
                                step={1}
                                value={guideReviews[index]?.score ?? 5}
                                onChange={(value) => handleGuideReviewChange(index, 'score', value)}
                                marks={[
                                    { value: 0, label: 'Çok Kötü' },
                                    { value: 5, label: 'Normal' },
                                    { value: 10, label: 'Çok İyi' }
                                ]}
                                className="mb-4"
                                styles={{
                                    mark: { borderColor: '#4A90E2' },
                                    markLabel: { fontSize: '0.9rem', color: '#4A5568' },
                                    thumb: { borderColor: '#4A90E2', backgroundColor: '#fff' },
                                    track: { backgroundColor: '#4A90E2' }
                                }}
                            />
                        </Box>
                    </Paper>
                ))}

                {showPrompt && (
                    <Alert
                        icon={<IconInfoCircle size={16} />}
                        title="Ek Geribildirimi Düşünür müsünüz?"
                        color="blue"
                        className="mb-4 bg-blue-50 border border-blue-200"
                    >
                        <Stack gap="md">
                            <Text className="text-blue-800">
                                Fikirlerinizi bizimle biraz daha paylaşmak ister misiniz?
                            </Text>
                            <Group className="gap-4">
                                <Button
                                    size="md"
                                    variant="light"
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2 rounded-lg transition-colors"
                                    onClick={handleYorumYap}
                                    leftSection={<IconMessageCircle size={20} />}
                                >
                                    Yorum Yap
                                </Button>
                                <Button
                                    size="md"
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-8 py-2 rounded-lg transition-colors"
                                    onClick={handleFinalSubmit}
                                >
                                    Yalnızca skorları gönder
                                </Button>
                            </Group>
                        </Stack>
                    </Alert>
                )}

                {!showPrompt && (
                    <Button
                        onClick={() => setOptionalFieldsOpen(!optionalFieldsOpen)}
                        variant="subtle"
                        leftSection={optionalFieldsOpen ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                        className="text-blue-600 hover:bg-blue-50 transition-colors w-full justify-start px-4"
                    >
                        <Text className="font-medium">İsteğe bağlı alanlar</Text>
                    </Button>
                )}

                <Collapse in={optionalFieldsOpen}>
                    <Stack gap="lg">
                        <Paper shadow="sm" p="lg" className="bg-white rounded-lg">
                            <Text className="text-gray-800 font-medium text-lg mb-4">
                                Tur sizde Bilkent üzerine nasıl bir izlenim bıraktı?
                            </Text>
                            <Textarea
                                value={tourComment}
                                onChange={(e) => setTourComment(e.currentTarget.value)}
                                minRows={3}
                                placeholder="Düşüncelerinizi paylaşın..."
                                className="focus:border-blue-500"
                            />
                        </Paper>

                        {tourData.guides.map((guide, index) => (
                            <Paper key={guide.id} shadow="sm" p="lg" className="bg-white rounded-lg">
                                <Text className="text-gray-800 font-medium text-lg mb-4">
                                    Rehberiniz {guide.name} hakkındaki yorumlarınız?
                                </Text>
                                <Textarea
                                    value={guideReviews[index]?.comment ?? ''}
                                    onChange={(e) => handleGuideReviewChange(index, 'comment', e.currentTarget.value)}
                                    minRows={3}
                                    placeholder="Düşüncelerinizi paylaşın..."
                                    className="focus:border-blue-500"
                                />
                            </Paper>
                        ))}
                    </Stack>
                </Collapse>

                {renderSubmitButton()}
            </Stack>
        </Container>
    );
};

export default TourReviewPage;