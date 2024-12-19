import { useContext, useState } from 'react';
import { Group, Button, Alert, Modal, Radio, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

// @ts-expect-error no they are not of any type
const TourStatusActions = ({ tour, onRefresh }) => {
  const { user, authToken } = useContext(UserContext);
  const [opened, { open, close }] = useDisclosure(false);
  const [viewTimesOpened, { open: openViewTimes, close: closeViewTimes }] = useDisclosure(false);
  const [selectedTime, setSelectedTime] = useState<string>('');

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

  const handleRequestChange = async () => {
    const statusUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/tours/status_update");
    statusUrl.searchParams.append("tid", tour.tour_id);
    statusUrl.searchParams.append("status", "TOYS_WANTS_CHANGE");
    statusUrl.searchParams.append("auth", authToken);

    const res = await fetch(statusUrl, {
      method: "POST",
    });

    if (res.ok) {
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

  // switch (tour.status) {
  const zattiriZortTestingVar : string = "APPLICANT_WANTS_CHANGE"
  switch (zattiriZortTestingVar) {
    case "RECEIVED":
      return (
        <>
          {timeSelectionModal}
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