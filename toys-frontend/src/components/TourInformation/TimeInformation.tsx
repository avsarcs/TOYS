import React, { useContext, useState } from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Space, Text, Modal, TextInput } from "@mantine/core";
import { UserContext } from "../../context/UserContext.tsx";
import { UserRole } from "../../types/enum.ts";
import { IconClock } from "@tabler/icons-react";

const TOUR_START_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/start-tour");
const TOUR_END_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/end-tour");

const TimeInformation: React.FC<TourSectionProps> = (props: TourSectionProps) => {
  const userContext = useContext(UserContext);
  const tourDate = props.tour.accepted_time ? new Date(props.tour.accepted_time) : new Date();
  
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [updateResult, setUpdateResult] = useState({ start: false, end: false });
  const [timeError, setTimeError] = useState<string | null>(null);
  
  if (userContext.user.role === UserRole.GUIDE) {
    return null;
  }

  const isAdvisorOrAbove = [UserRole.ADVISOR, UserRole.COORDINATOR, UserRole.DIRECTOR].includes(userContext.user.role);
  const started = props.tour.actual_start_time.length !== 0;
  const ended = props.tour.actual_end_time.length !== 0;

  const parseTimeString = (timeStr: string): string | null => {
    if (!timeStr.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return null;
    }

    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(tourDate);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    // Format as YYYY-MM-DDTHH:mm:ss+03:00
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(hours).padStart(2, '0');
    const minute = String(minutes).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hour}:${minute}:00+03:00`;
  };

  const validateTimes = () => {
    const startDate = parseTimeString(startTime);
    const endDate = parseTimeString(endTime);

    if ((startTime && !startDate) || (endTime && !endDate)) {
      setTimeError("Lütfen geçerli bir saat girin (HH:MM)");
      return false;
    }

    if (startDate && endDate && startDate >= endDate) {
      setTimeError("Bitiş saati başlangıç saatinden sonra olmalıdır!");
      return false;
    }

    setTimeError(null);
    return true;
  };

  const handleTimeChange = (value: string, isStart: boolean) => {
    // Allow empty input or partial input while typing
    if (value === "" || value.length <= 5) {
      if (isStart) {
        setStartTime(value);
      } else {
        setEndTime(value);
      }
      setTimeError(null);
    }
  };

  const handleTimeBlur = (value: string) => {
    // Auto-format on blur if it's a partial valid time
    if (value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      const [hours, minutes] = value.split(':');
      const formattedTime = `${hours.padStart(2, '0')}:${minutes}`;
      return formattedTime;
    }
    return value;
  };

  const handleTimeUpdate = async () => {
    if (!validateTimes()) return;
    
    let startSuccess = true;
    let endSuccess = true;

    const finalStartTime = parseTimeString(startTime);
    const finalEndTime = parseTimeString(endTime);

    if (finalStartTime) {
      const startUrl = new URL(TOUR_START_URL);
      startUrl.searchParams.append("auth", await userContext.getAuthToken());
      startUrl.searchParams.append("tour_id", props.tour.tour_id);
      startUrl.searchParams.append("start_time", finalStartTime);

      const startRes = await fetch(startUrl, {
        method: "POST",
      });
      startSuccess = startRes.ok;
    }

    if (finalEndTime) {
      const endUrl = new URL(TOUR_END_URL);
      endUrl.searchParams.append("auth", await userContext.getAuthToken());
      endUrl.searchParams.append("tour_id", props.tour.tour_id);
      endUrl.searchParams.append("end_time", finalEndTime);

      const endRes = await fetch(endUrl, {
        method: "POST",
      });
      endSuccess = endRes.ok;
    }

    setUpdateResult({ start: startSuccess, end: endSuccess });
    setShowResult(true);
    if (startSuccess || endSuccess) {
      props.refreshTour();
    }
  };

  const getResultMessage = () => {
    if (updateResult.start && updateResult.end) {
      return "Başlangıç ve bitiş saatleri başarıyla güncellendi.";
    } else if (updateResult.start) {
      return "Başlangıç saati güncellendi fakat bitiş saati güncellenemedi.";
    } else if (updateResult.end) {
      return "Bitiş saati güncellendi fakat başlangıç saati güncellenemedi.";
    } else {
      return "Saatler güncellenirken bir hata oluştu.";
    }
  };

  return (
    <Box p="lg">
      <Group>
        <Text size="md" span fw={700}>Başladığı saat:</Text>
        <Text>
          {started ? new Date(props.tour.actual_start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
        </Text>
        {!started && <Text size="md" c="red" span fw={500}>Tur henüz başlamadı.</Text>}
      </Group>
      <Space h="md"/>
      <Group>
        <Text size="md" span fw={700}>Bittiği saat:</Text>
        <Text>
          {ended ? new Date(props.tour.actual_end_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : "--:--"}
        </Text>
        {!ended && <Text size="md" c="red" span fw={500}>Tur henüz bitmedi.</Text>}
      </Group>
      <Space h="md"/>
      
      {isAdvisorOrAbove && (
        <>
          <Group>
            <TextInput
              label="Başlangıç Saati"
              placeholder="HH:MM"
              value={startTime}
              onChange={(e) => handleTimeChange(e.currentTarget.value, true)}
              onBlur={(e) => setStartTime(handleTimeBlur(e.currentTarget.value))}
              error={timeError}
              leftSection={<IconClock size={16} />}
              w={150}
            />
            <TextInput
              label="Bitiş Saati"
              placeholder="HH:MM"
              value={endTime}
              onChange={(e) => handleTimeChange(e.currentTarget.value, false)}
              onBlur={(e) => setEndTime(handleTimeBlur(e.currentTarget.value))}
              error={timeError}
              leftSection={<IconClock size={16} />}
              w={150}
            />
          </Group>
          <Space h="md" />
          <Button
            size="md"
            onClick={handleTimeUpdate}
            disabled={!startTime || !endTime || !!timeError}
          >
            Tur Başlangıç ve Bitiş Saatlerini Güncelle
          </Button>
        </>
      )}

      <Modal
        opened={showResult}
        onClose={() => setShowResult(false)}
        title="Güncelleme Sonucu"
        centered
      >
        <Text>{getResultMessage()}</Text>
      </Modal>
    </Box>
  );
}

export default TimeInformation;