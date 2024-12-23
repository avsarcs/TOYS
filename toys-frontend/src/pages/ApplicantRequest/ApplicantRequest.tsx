import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert, Box, Button, Container, Group, Modal, MultiSelect,
  NumberInput, Paper, Stack, Text, TextInput, Title
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import 'dayjs/locale/tr';
import { SimpleEventData } from '../../types/data';
import { Department, TourType } from '../../types/enum';
import isEmpty from 'validator/lib/isEmpty';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

const SIMPLE_TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/simple");
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

// Create options array with value as enum key and label as Turkish display value
const departmentOptions = Object.entries(Department).map(([key, value]) => ({
  value: key,
  label: value
}));



const ApplicantRequest: React.FC = () => {
  const { passkey, tour_id } = useParams();
  const [tourData, setTourData] = useState<SimpleEventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [formErrors, setFormErrors] = useState({
    fullname: false,
    email: false,
    phone: false
  });

  // Application form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState<number | string>(0);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [applicantInfo, setApplicantInfo] = useState({
    fullname: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const url = new URL(SIMPLE_TOUR_URL);
        url.searchParams.append('auth', passkey || '');
        url.searchParams.append('tour_id', tour_id || '');

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
      fetchTourData();
    }
  }, [passkey, tour_id]);

  const validateForm = () => {
    const errors = {
      fullname: isEmpty(applicantInfo.fullname),
      email: !isEmail(applicantInfo.email),
      phone: !isMobilePhone(applicantInfo.phone, 'tr-TR')
    };
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

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

  const handleRequestChanges = async () => {
    if (!tourData || selectedTimes.length === 0 || !visitorCount) {
      setError('Lütfen tüm gerekli alanları doldurun');
      return;
    }

    if (!validateForm()) {
      setError('Lütfen tüm alanları doğru şekilde doldurun');
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
        visitor_count: Number(visitorCount),
        applicant: {
          fullname: applicantInfo.fullname,
          email: applicantInfo.email,
          phone: applicantInfo.phone,
          role: tourData.event_subtype === TourType.INDIVIDUAL ? "STUDENT" : "TEACHER",
          notes: ""
        }
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
      <Container size="lg" py="xl">
        <Alert color="blue">Tur bilgileri yükleniyor...</Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Paper shadow="sm" p="md" withBorder>
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
            <Group wrap="wrap" gap="xs">
              <Text fw={700}>Okul:</Text>
              <Text>{tourData.highschool.name}</Text>
            </Group>

            <Group wrap="wrap" gap="xs">
              <Text fw={700}>Ziyaretçi Sayısı:</Text>
              <Text>{tourData.visitor_count} kişi</Text>
            </Group>

            <Group wrap="wrap" gap="xs">
              <Text fw={700}>Kabul Edilen Zaman:</Text>
              <Text>{new Date(tourData.accepted_time).toLocaleString('tr-TR')}</Text>
            </Group>
          </Stack>

          <Button
            variant="light"
            color="blue"
            onClick={() => setShowModificationModal(true)}
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
      >
        <Stack>
          <TextInput
            label="İsim Soyisim"
            placeholder="Adınız ve Soyadınız"
            value={applicantInfo.fullname}
            onChange={(e) => setApplicantInfo(prev => ({ ...prev, fullname: e.target.value }))}
            error={formErrors.fullname && "İsim Soyisim gereklidir"}
            required
          />

          <TextInput
            label="E-posta"
            placeholder="E-posta adresiniz"
            value={applicantInfo.email}
            onChange={(e) => setApplicantInfo(prev => ({ ...prev, email: e.target.value }))}
            error={formErrors.email && "Geçerli bir e-posta adresi giriniz"}
            required
          />

          <TextInput
            label="Telefon"
            placeholder="Telefon numaranız"
            value={applicantInfo.phone}
            onChange={(e) => setApplicantInfo(prev => ({ ...prev, phone: e.target.value }))}
            error={formErrors.phone && "Geçerli bir telefon numarası giriniz"}
            required
          />

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
                onChange={(value) => value.length <= 3 && setSelectedMajors(value)}
                searchable
                maxValues={3}
                required
                error={selectedMajors.length !== 3 ? "Lütfen tam olarak 3 bölüm seçiniz" : null}
              />
            </Box>
          )}

          <Group align="flex-start">
            <Stack>
              <Text c="blue" fw={500}>Tarih Seçin</Text>
              <DatePicker
                locale="tr"
                value={selectedDate}
                onChange={setSelectedDate}
                minDate={new Date()}
              />
            </Stack>

            <Stack>
              <Text c="blue" fw={500}>Zaman Aralığı Seçin</Text>
              <Stack>
                {TIME_SLOTS.map((slot) => (
                  <Button
                    key={`${slot.start}-${slot.end}`}
                    variant={selectedTimes.includes(`${selectedDate?.toISOString().split('T')[0]}T${slot.start}+03:00`) ? "filled" : "light"}
                    onClick={() => handleTimeSlotClick(slot)}
                    disabled={!selectedDate}
                  >
                    {slot.start} - {slot.end}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Group>

          {selectedTimes.length > 0 && (
            <Box>
              <Text fw={500} mb="xs">Seçili Zaman Aralıkları:</Text>
              <Stack>
                {selectedTimes.map((time, index) => (
                  <Group key={index} gap="apart">
                    <Text>{new Date(time).toLocaleString('tr-TR')}</Text>
                    <Button
                      size="sm"
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

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={() => setShowModificationModal(false)}>
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