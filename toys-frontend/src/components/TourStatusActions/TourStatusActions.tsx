import { useContext, useState } from 'react';
import { Group, Button, Alert, Modal, Radio, Stack, Text, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import {
  IconInfoCircle,
  IconCheck,
  IconX,
  IconCalendarTime,
  IconBan,
  IconClockEdit
} from '@tabler/icons-react';
import { UserContext } from '../../context/UserContext';
import { UserRole } from '../../types/enum';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

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

// @ts-expect-error no they are not of any type
const TourStatusActions = ({ tour, onRefresh }) => {
  const { user, authToken } = useContext(UserContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [viewTimesOpened, { open: openViewTimes, close: closeViewTimes }] = useDisclosure(false);
  const [modificationOpened, { open: openModification, close: closeModification }] = useDisclosure(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedModificationTimes, setSelectedModificationTimes] = useState<string[]>([]);
 
  const canManageTour = user.role === UserRole.ADVISOR ||
                        user.role === UserRole.COORDINATOR ||
                        user.role === UserRole.DIRECTOR;

  if (!canManageTour) {
    return null;
  }

  const handleConfirm = async () => {
    open();
  };

  const handleConfirmWithTime = async () => {
    const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
    respondUrl.searchParams.append("auth", authToken);
    respondUrl.searchParams.append("application_id", tour.tour_id);
    respondUrl.searchParams.append("timeslot", selectedTime);

    const res = await fetch(respondUrl, {
      method: "POST",
    });

    if (res.ok) {
      close();
      closeViewTimes(); // Close the view times modal if open
      onRefresh();
    }
  };

  const handleReject = async () => {
    const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
    respondUrl.searchParams.append("auth", authToken);
    respondUrl.searchParams.append("application_id", tour.tour_id);
    respondUrl.searchParams.append("timeslot", "");
   
    const res = await fetch(respondUrl, {
      method: "POST",
    });
   
    if (res.ok) {
      closeViewTimes(); // Close the view times modal if open
      onRefresh();
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

  const isTimeSlotSelected = (timeSlot: TimeSlot): boolean => {
    if (!selectedDate) return false;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const timeString = `${year}-${month}-${day}T${timeSlot.start}:00+03:00`;
    return selectedModificationTimes.includes(timeString);
  };

  const handleRequestChange = async () => {
    openModification();
  };

  const handleSubmitModification = async () => {
    const modUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/apply/tour/request-modification");
    modUrl.searchParams.append("auth", authToken);
    modUrl.searchParams.append("tour_id", tour.tour_id);
    modUrl.searchParams.append("requested_times", JSON.stringify(selectedModificationTimes));

    const res = await fetch(modUrl, {
      method: "POST",
    });

    if (res.ok) {
      closeModification();
      setSelectedModificationTimes([]);
      setSelectedDate(null);
      onRefresh();
    }
  };

  const handleCancel = async () => {
    const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
    respondUrl.searchParams.append("auth", authToken);
    respondUrl.searchParams.append("application_id", tour.tour_id);
    respondUrl.searchParams.append("timeslot", "");
   
    const res = await fetch(respondUrl, {
      method: "POST",
    });
   
    if (res.ok) {
      onRefresh();
    }
  };

  const formatTimeDisplay = (timeString: string): string => {
    const date = dayjs(timeString);
    const startTime = date.format('HH:mm');
    const endTime = date.add(2, 'hour').format('HH:mm');
    
    return `${date.format('D MMMM YYYY')}, ${startTime} - ${endTime}`;
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
            {[
            "2024-12-19T14:00:00+03:00",
            "2024-12-20T09:00:00+03:00",
            "2024-12-21T13:00:00+03:00"
          ].map((time: string) => (
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
            {[
            "2024-12-19T14:00:00+03:00",
            "2024-12-20T09:00:00+03:00",
            "2024-12-21T13:00:00+03:00"
          ].map((time: string) => (
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
      title="Zaman Değişikliği İsteği"
      size="lg"
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Lütfen alternatif zaman aralıklarını seçiniz (en az 1, en fazla 3):
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

  // requested_times is requested_time in the backend until its fixed so this has the possibility to explode.
  // notified the backend about this.
  switch (tour.status) {
    case "RECEIVED":
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
            <Button color="blue" onClick={handleRequestChange} leftSection={<IconClockEdit size={16} />}>
              Zamanlarda Değişiklik İste
            </Button>
          </Group>
        </>
      );
   
    case "APPLICANT_WANTS_CHANGE":
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
   
    case "CONFIRMED":
      return (
        <Group p="md">
          <Button color="red" onClick={handleCancel} leftSection={<IconBan size={16} />}>
            Turu İptal Et
          </Button>
        </Group>
      );
   
    case "REJECTED":
    case "CANCELLED":
      return reapplyMessage;
   
    case "TOYS_WANTS_CHANGE":
    default:
      return null;
  }
};

export default TourStatusActions;