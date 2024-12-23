import { notifications } from '@mantine/notifications';
import { useContext, useState } from 'react';
import { Group, Button, Alert, Modal, Radio, Stack, Text, Box, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import {
  IconInfoCircle,
  IconCheck,
  IconX,
  IconCalendarTime,
  IconBan,
  IconClockEdit,
  IconUsers
} from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { UserRole, TourStatus } from '../../types/enum';
import { TourData } from '../../types/data';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import { Textarea } from '@mantine/core';

dayjs.locale('tr');

interface TimeSlot {
  start: string;
  end: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { start: '09:00', end: '11:00' },
  { start: '10:00', end: '12:00' },
  { start: '13:00', end: '15:00' },
  { start: '14:00', end: '16:00' },
  { start: '15:00', end: '17:00' },
];

interface TourStatusActionsProps {
  tour: TourData;
  onRefresh: () => void;
}

const TourStatusActions: React.FC<TourStatusActionsProps> = ({ tour, onRefresh }) => {
  const { user, getAuthToken } = useContext(UserContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [viewTimesOpened, { open: openViewTimes, close: closeViewTimes }] = useDisclosure(false);
  const [modificationOpened, { open: openModification, close: closeModification }] = useDisclosure(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedModificationTimes, setSelectedModificationTimes] = useState<string[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(tour.visitor_count);
  const [cancelOpened, { open: openCancel, close: closeCancel }] = useDisclosure(false);
  const [cancelReason, setCancelReason] = useState('');

  const canManageTour = user.role === UserRole.ADVISOR ||
    user.role === UserRole.COORDINATOR ||
    user.role === UserRole.DIRECTOR;

  if (!canManageTour) {
    return null;
  }

  const formatTimeDisplay = (timeString: string): string => {
    const date = dayjs(timeString);
    const startTime = date.format('HH:mm');
    const endTime = date.add(2, 'hour').format('HH:mm');
    return `${date.format('D MMMM YYYY')}, ${startTime} - ${endTime}`;
  };

  const handleConfirm = () => {
    open();
  };
  const handleConfirmWithTime = async () => {
    try {
      const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
      respondUrl.searchParams.append("auth", await getAuthToken());
      respondUrl.searchParams.append("application_id", tour.tour_id);
      respondUrl.searchParams.append("timeslot", selectedTime);

      const res = await fetch(respondUrl, {
        method: "POST",
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı!',
          message: 'Tur başarıyla onaylandı.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        close();
        closeViewTimes();
        onRefresh();
      } else {
        throw new Error('Tur onaylanırken bir hata oluştu.');
      }
    } catch (error) {
      notifications.show({
        title: 'Hata!',
        message: 'Tur onaylanırken bir hata oluştu. Lütfen tekrar deneyin.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleReject = async () => {
    try {
      const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
      respondUrl.searchParams.append("auth", await getAuthToken());
      respondUrl.searchParams.append("application_id", tour.tour_id);
      respondUrl.searchParams.append("timeslot", "");

      const res = await fetch(respondUrl, {
        method: "POST",
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı!',
          message: 'Tur başarıyla reddedildi.',
          color: 'red',
          icon: <IconX size={16} />,
        });
        closeViewTimes();
        onRefresh();
      } else {
        throw new Error('Tur reddedilirken bir hata oluştu.');
      }
    } catch (error) {
      notifications.show({
        title: 'Hata!',
        message: 'Tur reddedilirken bir hata oluştu. Lütfen tekrar deneyin.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };


  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (!selectedDate) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const newTime = `${year}-${month}-${day}T${timeSlot.start}:00+03:00`;

    setSelectedModificationTimes(prev => {
      const exists = prev.includes(newTime);
      if (exists) {
        return prev.filter(time => time !== newTime);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, newTime];
    });
  };

  const handleRequestChange = () => {
    openModification();
  };

  const handleSubmitModification = async () => {
    try {
      const baseApplication = {
        highschool: tour.highschool,
        requested_times: selectedModificationTimes,
        visitor_count: visitorCount,
        applicant: tour.applicant
      };

      const applicationModel = tour.type === "INDIVIDUAL"
        ? {
          ...baseApplication,
          requested_majors: tour.requested_majors
        }
        : baseApplication;

      const modUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/tour/request_changes");
      modUrl.searchParams.append("auth", await getAuthToken());
      modUrl.searchParams.append("tour_id", tour.tour_id);

      const res = await fetch(modUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationModel)
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı!',
          message: 'Değişiklik isteği başarıyla gönderildi.',
          color: 'blue',
          icon: <IconClockEdit size={16} />,
        });
        closeModification();
        setSelectedModificationTimes([]);
        setSelectedDate(null);
        setVisitorCount(tour.visitor_count);
        onRefresh();
      } else {
        throw new Error('Değişiklik isteği gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      notifications.show({
        title: 'Hata!',
        message: 'Değişiklik isteği gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleCancel = async () => {
    try {
      const cancelUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/cancel");
      cancelUrl.searchParams.append("auth", await getAuthToken());
      cancelUrl.searchParams.append("event_id", tour.tour_id);

      const res = await fetch(cancelUrl, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: cancelReason
        })
      });

      if (res.ok) {
        notifications.show({
          title: 'Başarılı!',
          message: 'Tur başarıyla iptal edildi.',
          color: 'orange',
          icon: <IconBan size={16} />,
        });
        closeCancel();
        setCancelReason('');
        onRefresh();
      } else {
        throw new Error('Tur iptal edilirken bir hata oluştu.');
      }
    } catch (error) {
      notifications.show({
        title: 'Hata!',
        message: 'Tur iptal edilirken bir hata oluştu. Lütfen tekrar deneyin.',
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const cancelModal = (
    <Modal
      opened={cancelOpened}
      onClose={closeCancel}
      title="Turu İptal Et"
      size="md"
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Lütfen turun iptal edilme sebebini belirtiniz:
        </Text>
        <Textarea
          value={cancelReason}
          onChange={(event) => setCancelReason(event.currentTarget.value)}
          placeholder="İptal sebebi..."
          minRows={3}
          required
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={closeCancel}>Vazgeç</Button>
          <Button
            color="red"
            onClick={handleCancel}
            disabled={!cancelReason.trim()}
            leftSection={<IconBan size={16} />}
          >
            İptal Et
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const isTimeSlotSelected = (timeSlot: TimeSlot): boolean => {
    if (!selectedDate) return false;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const timeString = `${year}-${month}-${day}T${timeSlot.start}:00+03:00`;
    return selectedModificationTimes.includes(timeString);
  };

  const reapplyMessage = (
    <Alert
      icon={<IconInfoCircle size={16} />}
      title="Yeni Başvuru Gerekli"
      color="blue"
      variant="light"
      className="mx-4"
    >
      Okul, yeniden değerlendirmeye alınmak için yeni bir tur başvurusunda bulunabilir.
    </Alert>
  );

  const timeSelectionModal = (
    <Modal
      opened={opened}
      onClose={close}
      title="Tur Zamanı Seçimi"
      size="md"
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Lütfen tur için uygun olan zamanı seçiniz:
        </Text>
        <Radio.Group
          value={selectedTime}
          onChange={setSelectedTime}
          name="timeSelection"
          className="mb-4"
        >
          <Stack gap="md">
            {tour.requested_times.map((time: string) => (
              <Radio
                key={time}
                value={time}
                label={formatTimeDisplay(time)}
                className="p-2 border rounded hover:bg-gray-50"
              />
            ))}
          </Stack>
        </Radio.Group>
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={close}>Vazgeç</Button>
          <Button
            color="green"
            onClick={handleConfirmWithTime}
            disabled={!selectedTime}
            leftSection={<IconCheck size={16} />}
          >
            Onayla
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const viewProposedTimesModal = (
    <Modal
      opened={viewTimesOpened}
      onClose={closeViewTimes}
      title="Teklif Edilen Zamanlar"
      size="md"
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Okul tarafından önerilen zamanlar:
        </Text>
        <Radio.Group
          value={selectedTime}
          onChange={setSelectedTime}
          name="timeSelection"
          className="mb-4"
        >
          <Stack gap="md">
            {tour.requested_times.map((time: string) => (
              <Radio
                key={time}
                value={time}
                label={formatTimeDisplay(time)}
                className="p-2 border rounded hover:bg-gray-50"
              />
            ))}
          </Stack>
        </Radio.Group>
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={closeViewTimes}>Vazgeç</Button>
          <Button
            color="red"
            onClick={handleReject}
            leftSection={<IconX size={16} />}
          >
            Turu Reddet
          </Button>
          <Button
            color="green"
            onClick={handleConfirmWithTime}
            disabled={!selectedTime}
            leftSection={<IconCheck size={16} />}
          >
            Onayla
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  const modificationModal = (
    <Modal
      opened={modificationOpened}
      onClose={closeModification}
      title="Tur Değişikliği İsteği"
      size="lg"
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Tanıtım Ofisine uygun vakitleri giriniz.
        </Text>

        <Group align="flex-start" gap="xl">
          <Box>
            <Text c="blue" fw={500} mb="xs">Önce Tarih Seçin</Text>
            <DatePicker
              locale="tr"
              value={selectedDate}
              onChange={setSelectedDate}
              minDate={new Date()}
            />
          </Box>

          <Box>
            <Text c="blue" fw={500} mb="xs">Sonra Zaman Aralığı Seçin</Text>
            <Stack gap="sm">
              {TIME_SLOTS.map((slot) => (
                <Button
                  key={`${slot.start}-${slot.end}`}
                  variant={isTimeSlotSelected(slot) ? "filled" : "light"}
                  onClick={() => handleTimeSlotClick(slot)}
                  disabled={!selectedDate}
                  style={{ width: 200 }}
                >
                  {slot.start} - {slot.end}
                </Button>
              ))}
            </Stack>
          </Box>
        </Group>

        {selectedModificationTimes.length > 0 && (
          <Box>
            <Text fw={500} mb="xs">Seçili Zaman Aralıkları:</Text>
            {selectedModificationTimes.map((time, index) => (
              <div key={index} className='flex mb-2'>
                <Text className='mr-2'>{formatTimeDisplay(time)}</Text>
                <Button
                  size='compact-sm'
                  color='red'
                  onClick={() => setSelectedModificationTimes(prev => prev.filter(t => t !== time))}
                >
                  İptal
                </Button>
              </div>
            ))}
          </Box>
        )}

        <Box mt="md">
          <Text c="blue" fw={500} mb="xs">Ziyaretçi Sayısı</Text>
          <NumberInput
            value={visitorCount}
            onChange={(val) => setVisitorCount(Number(val))}
            min={1}
            max={100}
            leftSection={<IconUsers size={16} />}
            label="Ziyaretçi sayısında değişiklik istiyorsanız buradan belirtiniz."
            placeholder="Örn: 25"
            className="max-w-xs"
          />
        </Box>

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={closeModification}>Vazgeç</Button>
          <Button
            color="blue"
            onClick={handleSubmitModification}
            disabled={selectedModificationTimes.length === 0}
            leftSection={<IconClockEdit size={16} />}
          >
            Zamanlarda Değişiklik İste
          </Button>
        </Group>
      </Stack>
    </Modal>
  );

  switch (tour.status) {
    case TourStatus.RECEIVED:
      return (
        <>
          {timeSelectionModal}
          {modificationModal}
          <Group gap="sm" p="md">
            <Button color="green" onClick={handleConfirm} leftSection={<IconCheck size={16} />}>
              Turu Onayla
            </Button>
            <Button color="red" onClick={handleReject} leftSection={<IconX size={16} />}>
              Turu Reddet
            </Button>
            {/* <Button color="blue" onClick={handleRequestChange} leftSection={<IconClockEdit size={16} />}>
              Başvuruda Değişiklik İste
            </Button> */}
          </Group>
        </>
      );

    case TourStatus.APPLICANT_WANTS_CHANGE:
      return (
        <>
          {viewProposedTimesModal}
          <Group p="md">
            <Button
              color="blue"
              onClick={openViewTimes}
              leftSection={<IconCalendarTime size={16} />}
            >
              Teklif Edilen Zamanları Gör
            </Button>
          </Group>
        </>
      );

    case TourStatus.CONFIRMED:
      return (
        <>
          {modificationModal}
          {cancelModal}
          <Group p="md">
            <Button color="red" onClick={openCancel} leftSection={<IconBan size={16} />}>
              Turu İptal Et
            </Button>
            <Button color="blue" onClick={handleRequestChange} leftSection={<IconClockEdit size={16} />}>
              Başvuruda Değişiklik İste
            </Button>
          </Group>
        </>
      );

    case TourStatus.REJECTED:
    case TourStatus.CANCELLED:
      return reapplyMessage;

    case TourStatus.TOYS_WANTS_CHANGE:
    default:
      return null;
  }
};

export default TourStatusActions;