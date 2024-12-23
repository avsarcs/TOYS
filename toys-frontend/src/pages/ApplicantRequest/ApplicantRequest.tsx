import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {DatePicker} from '@mantine/dates';
import {IconAlertCircle, IconCheck} from '@tabler/icons-react';
import 'dayjs/locale/tr';
import {SimpleEventData} from '../../types/data';
import {Department, TourType} from '../../types/enum';

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

const departmentOptions = Object.values(Department).map(dept => ({
  value: dept,
  label: dept
}));

const ApplicantRequest: React.FC = () => {
  const { passkey } = useParams();
  const [tourData, setTourData] = useState<SimpleEventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState<number | string>(0);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);

  // // Test data setup
  // useEffect(() => {
  //   setTourData({
  //     event_type: "TOUR",
  //     event_subtype: "individual",
  //     event_id: "123",
  //     event_status: "CONFIRMED",
  //     highschool: {
  //       id: "1",
  //       name: "Ankara Fen Lisesi",
  //       location: "Çankaya, Ankara",
  //       priority: 1,
  //       ranking: 1
  //     },
  //     visitor_count: 25,
  //     accepted_time: "2024-12-19T14:00:00+03:00",
  //     requested_times: ["2024-12-19T14:00:00+03:00"]
  //   });
  // }, []);

  useEffect(() => {
    console.log("passkey useeffect triggered")
    console.log("passkey: " + passkey)
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
        
        if (data.event_subtype === TourType.INDIVIDUAL && data.requested_majors) {
          setSelectedMajors(data.requested_majors.slice(0, 3));
        }
      } catch (err) {
        setError('Tur bilgileri yüklenirken bir hata oluştu');
      }
    };

    if (passkey) {
      console.log("passkey var babba")
      fetchTourData();
    } else {
      console.log("passkey yok babba")
    }
  }, [passkey]);

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

  const handleMajorChange = (value: string[]) => {
    if (value.length <= 3) {
      setSelectedMajors(value);
    }
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

    if (tourData.event_subtype === TourType.INDIVIDUAL && selectedMajors.length !== 3) {
      setError('Lütfen tam olarak 3 bölüm seçiniz');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const baseApplication = {
        highschool: tourData.highschool,
        requested_times: selectedTimes,
        visitor_count: visitorCount
      };
      
      const applicationModel = tourData.event_subtype === TourType.INDIVIDUAL
        ? {
            ...baseApplication,
            requested_majors: selectedMajors
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
      <Container size="lg" py="xl" className="px-4 sm:px-6 lg:px-8">
        <Alert color="blue">Tur bilgileri yükleniyor...</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl" className="px-4 sm:px-6 lg:px-8">
      <Paper shadow="sm" p="md" withBorder className="sm:p-xl">
        <Stack gap="xl">
          <Title order={2} className="text-blue-700 text-xl sm:text-2xl">
            Tur Başvurunuz Başarıyla Kabul Edildi!
          </Title>

          <Alert color="blue" variant="light">
            <Stack gap="xs">
              <Text size="sm" className="sm:text-base">• Tur başvurunuz Tanıtım Ofisi tarafından değerlendirilmiş ve onaylanmıştır.</Text>
              <Text size="sm" className="sm:text-base">• Kabul edilen tur detaylarını aşağıda görebilirsiniz.</Text>
            </Stack>
          </Alert>

          <Stack gap="md">
            <Group wrap="wrap" gap="xs">
              <Text fw={700} className="w-full sm:w-auto">Okul:</Text>
              <Text>{tourData.highschool.name}</Text>
            </Group>

            <Group wrap="wrap" gap="xs">
              <Text fw={700} className="w-full sm:w-auto">Ziyaretçi Sayısı:</Text>
              <Text>{tourData.visitor_count} kişi</Text>
            </Group>

            <Group wrap="wrap" gap="xs">
              <Text fw={700} className="w-full sm:w-auto">Kabul Edilen Zaman:</Text>
              <Text>{formatTimeDisplay(tourData.accepted_time)}</Text>
            </Group>
          </Stack>

          <Alert color="yellow" variant="light">
            <Text size="sm">
              - Eğer turunuzda değişiklik isterseniz turunuz baştan değerlendirilecektir ve reddedilebilir.
            </Text>
          </Alert>

          <Button 
            variant="light" 
            color="blue" 
            onClick={() => setShowModificationModal(true)}
            className="w-full sm:w-fit"
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
        size="lg"
        fullScreen={window.innerWidth < 640}
        padding="md"
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

          {tourData.event_subtype === TourType.INDIVIDUAL && (
            <Box>
              <MultiSelect
                label="Rehber Bölüm Tercihleri (Tercih sırasıyla 3 bölüm seçiniz)"
                data={departmentOptions}
                value={selectedMajors}
                onChange={handleMajorChange}
                searchable
                maxValues={3}
                required
                error={selectedMajors.length !== 3 ? "Lütfen tam olarak 3 bölüm seçiniz" : null}
              />
            </Box>
          )}

          <Group align="flex-start" className="flex-col sm:flex-row">
            <Box className="w-full sm:w-auto">
              <Text c="blue" fw={500} mb="xs">Önce Tarih Seçin</Text>
              <DatePicker
                locale="tr"
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
                className="w-full sm:w-auto"
              />
            </Box>

            <Box className="w-full sm:w-auto">
              <Text c="blue" fw={500}>Sonra Zaman Aralığı Seçin</Text>
              <Text mb={"xs"} fw={300}>(Zaman Aralıklarını Farklı Tarihlerden Seçebilirsiniz)</Text>
              <Stack gap="sm">
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={`${slot.start}-${slot.end}`}
                    variant={isTimeSlotSelected(slot) ? "filled" : "light"}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={!selectedDate}
                    className="w-full sm:w-48"
                  >
                    {slot.start} - {slot.end}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Group>

          {selectedTimes.length > 0 && (
            <Box>
              <Text fw={500} mb="xs">Seçili Zaman Aralıkları:</Text>
              <Stack gap="xs">
                {selectedTimes.map((time, index) => (
                  <Group key={index} wrap="wrap" className="w-full">
                    <Text className="flex-grow">{formatTimeDisplay(time)}</Text>
                    <Button 
                      size="compact-sm" 
                      color="red" 
                      onClick={() => setSelectedTimes(prev => prev.filter(t => t !== time))}
                    >
                      İptal
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Box>
          )}

          <Group justify="flex-end" mt="xl" className="flex-col-reverse sm:flex-row gap-2">
            <Button 
              variant="light" 
              onClick={() => setShowModificationModal(false)}
              fullWidth
              className="sm:w-auto"
            >
              İptal
            </Button>
            <Button
              color="blue"
              onClick={handleRequestChanges}
              loading={loading}
              disabled={
                selectedTimes.length === 0 || 
                !visitorCount || 
                (tourData.event_subtype === TourType.INDIVIDUAL && selectedMajors.length !== 3)
              }
              fullWidth
              className="sm:w-auto"
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