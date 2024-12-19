import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Title,
    Paper,
    Stack,
    Text,
    Group,
    Button,
    Radio,
    RadioGroup,
    Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const SIMPLE_TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/simple-tour");
const RESPOND_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/answer-modification");

const ApplicantRespond: React.FC = () => {
    const { tourId, passkey } = useParams();
    const navigate = useNavigate();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // Hardcoded sample data - used for display while backend is down
    const tourData = {
        event_type: "TOUR",
        event_subtype: "TOUR",
        event_id: "123",
        event_status: "TOYS_WANTS_CHANGE",
        highschool: {
            id: "1",
            name: "Ankara Fen Lisesi",
            location: "Ankara",
            priority: 1,
            ranking: 1
        },
        accepted_time: null,
        requested_times: [
            "2024-12-19T14:00:00+03:00",
            "2024-12-20T10:00:00+03:00",
            "2024-12-21T15:00:00+03:00"
        ],
        visitor_count: 25
    };

    // Fetch tour data
    useEffect(() => {
        const fetchTour = async () => {
            try {
                const url = new URL(SIMPLE_TOUR_URL);
                url.searchParams.append('auth', passkey || '');
                url.searchParams.append('tid', tourId || '');

                const response = await fetch(url, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tour data');
                }

                // When backend is up, uncomment this to use actual data
                // const data = await response.json();
                // setTourData(data);
                
            } catch (err) {
                console.error('Error fetching tour:', err);
                setFetchError('Tur bilgileri yüklenirken bir hata oluştu.');
            }
        };

        if (tourId && passkey) {
            fetchTour();
        }
    }, [tourId, passkey]);

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAccept = async () => {
        if (!selectedTime) {
            setError('Lütfen bir zaman seçiniz');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const url = new URL(RESPOND_URL);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'auth': passkey || '',
                    'tour_id': tourId || '',
                    'accepted_time': selectedTime
                })
            });

            if (!response.ok) {
                throw new Error('Failed to accept tour');
            }

            // Navigate to success page or show success message
            // When backend is up, uncomment this
            // navigate('/success');
            
        } catch (err) {
            console.error('Error accepting tour:', err);
            setError('Bir hata oluştu. Lütfen tekrar deneyiniz.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = new URL(RESPOND_URL);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'auth': passkey || '',
                    'tour_id': tourId || '',
                    'accepted_time': '' // Empty string for rejection
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reject tour');
            }

            // Navigate to rejection confirmation page
            // When backend is up, uncomment this
            // navigate('/rejected');
            
        } catch (err) {
            console.error('Error rejecting tour:', err);
            setError('Bir hata oluştu. Lütfen tekrar deneyiniz.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchError) {
        return (
            <Container size="lg" py="xl">
                <Alert color="red" variant="filled">
                    {fetchError}
                </Alert>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Paper shadow="sm" p="xl" withBorder>
                <Stack gap="xl">
                    <Title order={2} className="text-slate-600 mb-2">TURUNUZ İÇİN ZAMAN SEÇMENİZ GEREKİYOR</Title>
                    <Alert
                        color="blue"
                        variant="light"
                        className="text-sm leading-relaxed"
                    >
                        <Stack gap="xs">
                            <Text>• Tur başvurunuzu yaparken belirttiğiniz vakitler, Tanıtım Ofisi'nin programıyla uyuşmuyor. Tanıtım Ofisi'nin programına uyan vakitler aşağıda belirtilmiştir.</Text>
                            <Text>• Tanıtım Ofisi'nin teklif ettiği bu vakitlerden birinde tur yapmayı onaylayabilirsiniz.</Text>
                            <Text>• Veya, Tanıtım Ofisi tarafından teklif edilen hiçbir zaman programınıza uymuyorsa, teklifi reddedip başka bir zaman yeniden bir tur başvurusu yapabilirsiniz.</Text>
                        </Stack>
                    </Alert>

                    <Stack gap="md">
                        <Title order={3}>Önerilen Zamanlar</Title>
                        <RadioGroup value={selectedTime} onChange={setSelectedTime}>
                            <Stack gap="lg">
                                {tourData.requested_times.map((time) => (
                                    <Radio
                                        key={time}
                                        value={time}
                                        label={formatDate(time)}
                                        className="text-lg"
                                    />
                                ))}
                            </Stack>
                        </RadioGroup>
                    </Stack>

                    {error && (
                        <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
                            {error}
                        </Alert>
                    )}

                    <Group justify="apart">
                        <Button
                            color="red"
                            onClick={handleReject}
                            loading={loading}
                        >
                            Reddet
                        </Button>
                        <Button
                            color="green"
                            onClick={handleAccept}
                            loading={loading}
                            disabled={!selectedTime}
                        >
                            Seçili Zamanı Onayla
                        </Button>
                    </Group>

                    <Title order={2} className="text-blue-700">Tur Detayları</Title>

                    <Stack gap="md">
                        <Group>
                            <Text fw={700}>Okul:</Text>
                            <Text>{tourData.highschool.name}</Text>
                        </Group>

                        <Group>
                            <Text fw={700}>Konum:</Text>
                            <Text>{tourData.highschool.location}</Text>
                        </Group>

                        <Group>
                            <Text fw={700}>Ziyaretçi Sayısı:</Text>
                            <Text>{tourData.visitor_count}</Text>
                        </Group>
                    </Stack>
                </Stack>
            </Paper>
        </Container>
    );
};

export default ApplicantRespond;