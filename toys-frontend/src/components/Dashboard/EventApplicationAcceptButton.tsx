import {DashboardInfoBoxButtonProps} from "../../types/designed.ts";
import React, {useContext, useState} from "react";
import {Button, Group, Modal, Radio, Stack, Text} from "@mantine/core";
import {IconCheck, IconCircleCheck, IconLoader2} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import dayjs from "dayjs";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {EventType} from "../../types/enum.ts";

const EventApplicationAcceptButton: React.FC<DashboardInfoBoxButtonProps> = (props: DashboardInfoBoxButtonProps) => {
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTourModalOpen, { open: openTourModal, close: closeModal }] = useDisclosure(false);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const formatTimeDisplay = (timeString: string): string => {
    const date = dayjs(timeString);
    const startTime = date.format('HH:mm');
    const endTime = date.add(2, 'hour').format('HH:mm');
    return `${date.format('D MMMM YYYY')}, ${startTime} - ${endTime}`;
  };

  const handleConfirmWithTime = async () => {
    const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/tour");
    respondUrl.searchParams.append("auth", await userContext.getAuthToken());
    respondUrl.searchParams.append("application_id", props.item.event_id);
    respondUrl.searchParams.append("timeslot", selectedTime);

    try {
      const res = await fetch(respondUrl, {
        method: "POST",
      });

      if (res.ok) {
        closeModal();
        props.updateDashboard();
        notifications.show({
          color: "green",
          title: "İşlem başarılı.",
          message: "Tur kabul edildi."
        })
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
        });
      }
    } catch (e) {
      console.error(e);
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
      });
    }
  };

  const acceptFairInvitation = async () => {
    setLoading(true);
    const respondUrl = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/respond/application/fair");
    respondUrl.searchParams.append("auth", await userContext.getAuthToken());
    respondUrl.searchParams.append("application_id", props.item.event_id);
    respondUrl.searchParams.append("response", "true");

    try {
      const res = await fetch(respondUrl, {
        method: "POST",
      });

      if (res.ok) {
        closeModal();
        props.updateDashboard();
        notifications.show({
          color: "green",
          title: "İşlem başarılı.",
          message: "Fuar kabul edildi."
        })
      }
      else {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
        });
      }
    } catch (e) {
        console.error(e);
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Button size="lg"
              radius="md"
              fullWidth
              leftSection={loading ? <IconLoader2 className="animate-spin" /> : <IconCircleCheck />}
              disabled={loading}
              onClick={props.item.event_type === EventType.TOUR ? openTourModal : acceptFairInvitation}
              className={`${loading ? "brightness-75" : ""} text-center border-white bg-blue-600 border-2 outline outline-0
              hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 focus:outline-blue-800 hover:outline-blue-800
              focus:outline-2 hover:outline-2 transition-colors duration-300`}>
        {props.children}
      </Button>
      {
        isTourModalOpen && props.item.event_type === EventType.TOUR &&
        <Modal
          opened={isTourModalOpen}
          onClose={closeModal}
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
                {props.item.requested_times.map((time: string) => (
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
              <Button variant="light" onClick={closeModal}>Vazgeç</Button>
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
      }
    </>
  )
}

export default EventApplicationAcceptButton;