import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  NumberInput,
  Alert,
  Modal,
  Box,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import 'dayjs/locale/tr';
import { SimpleEventData } from '../../types/data';

const SIMPLE_TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/simple-tour");
const REQUEST_CHANGES_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/tour/request_changes");

interface TimeSlot {
  start: string;
  end: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { start: '09:00', end: '11:00' },
  { start: '10:00', end: '12:00' },
  { start: '13:00', end: '15:00' },
  { start: '14:00', end: '16:00' },
  { start: '15:00', end: '19:00' },
];

const ApplicantRequest: React.FC = () => {
  const { passkey } = useParams();
  const [tourData, setTourData] = useState<SimpleEventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);

  // Time selection state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState<number | ''>(0);

  // Mock data for testing
  const mockTourData: SimpleEventData = {
    event_type: "TOUR",
    event_subtype: "group",
    event_id: "123",
    event_status: "CONFIRMED",
    highschool: {
      id: "1",
      name: "Ankara Fen Lisesi",
      location: "Çankaya, Ankara",
      priority: 1,
      ranking: 1
    },
    visitor_count: 25,
    accepted_time: new Date(2024, 11, 19, 14, 0).toISOString(),
    requested_times: ["2024-12-19T14:00:00+03:00"]
  };

  useEffect(() => {
    // Simulate API call with mock data
    setTourData(mockTourData);
    setVisitorCount(mockTourData.visitor_count);

    // Real API integration (commented out for now)
    /*
    const fetchTourData = async () => {
      try {
        const url = new URL(SIMPLE_TOUR_URL);
        url.searchParams.append('auth', passkey || '');
        url.searchParams.append('tid', '');

        const response = await fetch(url);
        if (!response.ok) throw new Error('Tur bilgileri alınamadı');

        const data = await response.json();
        setTourData(data);
        setVisitorCount(data.visitor_count);
      } catch (err) {
        setError('Tur bilgileri yüklenirken bir hata oluştu');
      }
    };

    if (passkey) {
      fetchTourData();
    }
    */
  }, []);

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const newTime = `${year}-${month}-${day}T${timeSlot.start}+03:00`;

    setSelectedTimes(prev => {
      const exists = prev.includes(newTime);
      if (exists) {
        return prev.filter(time => time !== newTime);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, newTime].sort();
    });
  };

  const formatTimeDisplay = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTimeSlotSelected = (timeSlot: TimeSlot): boolean => {
    if (!selectedDate) return false;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const timeString = `${year}-${month}-${day}T${timeSlot.start}+03:00`;
    return selectedTimes.includes(timeString);
  };

  const handleRequestChanges = async () => {
    if (!tourData || selectedTimes.length === 0 || !visitorCount) {
      setError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock success for testing
      // Comment out this block when implementing real API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

      /*
      const baseApplication = {
        highschool: tourData.highschool,
        requested_times: selectedTimes,
        visitor_count: visitorCount
      };

      const applicationModel = tourData.event_subtype === "individual"
        ? {
            ...baseApplication,
            requested_majors: [] // You might need to handle this differently
          }
        : baseApplication;

      const url = new URL(REQUEST_CHANGES_URL);
      url.searchParams.append('auth', passkey || '');
      url.searchParams.append('tour_id', tourData.event_id);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationModel)
      });

      if (!response.ok) throw new Error('Değişiklik talebi gönderilemedi');
      */

      setSuccess('Değişiklik talebiniz başarıyla iletildi');
      setShowModificationModal(false);
      setSelectedTimes([]);
      setSelectedDate(null);
    } catch (err) {
      setError('Değişiklik talebi gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!tourData) {
    return (
      <Container size="lg" py="xl">
        <Alert color="blue">Tur bilgileri yükleniyor...</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="xl" withBorder>
        <Stack gap="xl">
          <Title order={2} className="text-blue-700">
            Tur Başvurunuz Başarıyla Kabul Edildi!
          </Title>

          <Alert color="blue" variant="light">
            <Stack gap="xs">
              <Text>• Tur başvurunuz Tanıtım Ofisi tarafından değerlendirilmiş ve onaylanmıştır.</Text>
              <Text>• Kabul edilen tur detaylarını aşağıda görebilirsiniz.</Text>
            </Stack>
          </Alert>

          <Stack gap="md">
            <Group>
              <Text fw={700}>Okul:</Text>
              <Text>{tourData.highschool.name}</Text>
            </Group>

            <Group>
              <Text fw={700}>Ziyaretçi Sayısı:</Text>
              <Text>{tourData.visitor_count} kişi</Text>
            </Group>

            <Group>
              <Text fw={700}>Kabul Edilen Zaman:</Text>
              <Text>{formatTimeDisplay(tourData.accepted_time)}</Text>
            </Group>
          </Stack>

          <Alert color="yellow" variant="light" className="mt-4">
            <Text size="sm">
              - Eğer turunuzda değişiklik isterseniz turunuz baştan değerlendirilecektir ve reddedilebilir.
            </Text>
          </Alert>

          <Button 
            variant="light" 
            color="blue" 
            onClick={() => setShowModificationModal(true)}
            className="w-fit"
          >
            Tur Zamanı veya Ziyaretçi Sayısında Değişiklik İste
          </Button>

          {error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="green" variant="light" icon={<IconCheck size={16} />}>
              {success}
            </Alert>
          )}
        </Stack>
      </Paper>

      <Modal
        opened={showModificationModal}
        onClose={() => setShowModificationModal(false)}
        title="Tur Değişiklik Talebi"
        size="xl"
      >
        <Stack>
          <NumberInput
            label="Ziyaretçi Sayısı"
            value={visitorCount}
            onChange={setVisitorCount}
            min={1}
            max={100}
            required
          />

          <Box>
            <Text c="blue" fw={500} mb="xs">Tarih Seçin</Text>
            <DatePicker
              locale="tr"
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
            />
          </Box>

          {selectedDate && (
            <Box>
              <Text c="blue" fw={500} mb="xs">Zaman Aralığı Seçin (En az 1, en fazla 3)</Text>
              <Stack gap="sm">
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={`${slot.start}-${slot.end}`}
                    variant={isTimeSlotSelected(slot) ? "filled" : "light"}
                    onClick={() => handleTimeSlotClick(slot)}
                    style={{ width: 200 }}
                  >
                    {slot.start} - {slot.end}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {selectedTimes.length > 0 && (
            <Box>
              <Text fw={500} mb="xs">Seçili Zaman Aralıkları:</Text>
              {selectedTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Text>{formatTimeDisplay(time)}</Text>
                  <Button 
                    size="compact-sm" 
                    color="red" 
                    onClick={() => setSelectedTimes(prev => prev.filter(t => t !== time))}
                  >
                    İptal
                  </Button>
                </div>
              ))}
            </Box>
          )}

          <Group justify="flex-end" mt="xl">
            <Button 
              variant="light" 
              onClick={() => setShowModificationModal(false)}
            >
              İptal
            </Button>
            <Button
              color="blue"
              onClick={handleRequestChanges}
              loading={loading}
              disabled={selectedTimes.length === 0 || !visitorCount}
            >
              Değişiklik Talep Et
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default ApplicantRequest;