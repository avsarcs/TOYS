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
    Modal,
    Card
} from '@mantine/core';
import { IconAlertCircle, IconUsers } from '@tabler/icons-react';
import { SimpleEventData } from '../../types/data';

const SIMPLE_TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/modifications");
const RESPOND_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour/modification");

const ApplicantRespond: React.FC = () => {
    const { passkey, tour_id } = useParams();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [tourData, setTourData] = useState<SimpleEventData | null>(null);

    // Fetch tour data
    useEffect(() => {
        const fetchTour = async () => {
            try {
                const url = new URL(SIMPLE_TOUR_URL);
                url.searchParams.append('auth', passkey || '');
                url.searchParams.append('tour_id', tour_id || '');

                const response = await fetch(url, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch tour data');
                }

                const data = await response.json();
                setTourData(data);
                
            } catch (err) {
                console.error('Error fetching tour:', err);
                setFetchError('Tur bilgileri yüklenirken bir hata oluştu.');
            }
        };

        if (passkey && tour_id) {
            fetchTour();
        }
    }, [passkey, tour_id]);

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
            url.searchParams.append('auth', passkey || '');
            url.searchParams.append('request_id', tour_id || '');
            url.searchParams.append('response', 'true')
            url.searchParams.append('accepted_time', selectedTime);
    
            const response = await fetch(url, {
                method: 'POST'
            });
    
            if (!response.ok) {
                throw new Error('Failed to accept tour');
            }
    
            setSuccessMessage(`${formatDate(selectedTime)} zamanını başarıyla onayladınız`);
            setShowSuccessModal(true);
            
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
            url.searchParams.append('auth', passkey || '');
            url.searchParams.append('tour_id', tour_id || '');
            url.searchParams.append('accepted_time', ''); // Empty string for rejection
    
            const response = await fetch(url, {
                method: 'POST'
            });
    
            if (!response.ok) {
                throw new Error('Failed to reject tour');
            }
    
            setSuccessMessage('Teklif edilen vakitleri reddettiniz. Yakın bir vakitte yeniden tur başvurusu yapmayı deneyebilirsiniz.');
            setShowSuccessModal(true);
            
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

    if (!tourData) {
        return null;
    }

    return (
        <>
            <Modal
                opened={showSuccessModal}
                onClose={() => {}}
                withCloseButton={false}
                centered
                size="lg"
            >
                <Stack gap="xl" py="md">
                    <Text size="lg" fw={500}>{successMessage}</Text>
                </Stack>
            </Modal>

            <Container size="lg" py="xl">
                <Paper shadow="sm" p="xl" withBorder>
                    <Stack gap="xl">
                        <Title order={2} className="text-slate-600 mb-2">
                            TURUNUZ İÇİN İSTENİLEN DEĞİŞİKLİKLERİ GÖZDEN GEÇİRMENİZ GEREKİYOR
                        </Title>
                        
                        <Alert
                            color="blue"
                            variant="light"
                            className="text-sm leading-relaxed"
                        >
                            <Stack gap="xs">
                                <Text>• Tur başvurunuz Tanıtım Ofisi tarafından değerlendirilmiştir.</Text>
                                <Text>• Tanıtım Ofisi'ne uygun ziyaretçi sayısı ve vakitler aşağıda belirtilmiştir.</Text>
                                <Text>• Belirtilen vakitlerden size uygun olanını seçiniz.</Text>
                                <Text>• Vakit veya ziyaretçi sayısı size uygun değilse reddedip, başka bir zaman yeniden tur başvurusunda bulunabilirsiniz.</Text>
                            </Stack>
                        </Alert>

                        <Card withBorder shadow="sm" radius="md" className="bg-blue-50">
                            <Group gap="md">
                                <IconUsers size={24} className="text-blue-600" />
                                <Title order={3} className="text-blue-600">Tanıtım Ofisine Uygun Ziyaretçi Sayısı</Title>
                            </Group>
                            <Text size="xl" fw={700} mt="md" className="text-blue-600">
                                {tourData.visitor_count} Kişi
                            </Text>
                        </Card>

                        <Stack gap="md">
                            <Title order={3}>Teklif Edilen Zamanlar</Title>
                            <RadioGroup value={selectedTime} onChange={setSelectedTime}>
                                <Stack gap="lg">
                                    {tourData.requested_times.map((time: string) => (
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
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </>
    );
};

export default ApplicantRespond;