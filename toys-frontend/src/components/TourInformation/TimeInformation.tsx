import React, { useContext, useState } from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { 
  Box, 
  Button, 
  Group, 
  Space, 
  Text, 
  Modal,
  TextInput,
  Paper,
  Divider,
  Alert,
  Badge
} from "@mantine/core";
import { UserContext } from "../../context/UserContext.tsx";
import { UserRole } from "../../types/enum.ts";
import { 
  IconClock, 
  IconClockPlay, 
  IconClockStop,
  IconAlertCircle 
} from "@tabler/icons-react";

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
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Group gap="xl" mb="lg">
        <Group gap="xs">
          <IconClockPlay size={24} className="text-blue-600" />
          <Box>
            <Text size="sm" fw={500} className="text-gray-700" mb={4}>Başlangıç Saati</Text>
            <Group gap="md">
              <Text size="lg" fw={700} className="text-gray-900">
                {started ? 
                  new Date(props.tour.actual_start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) 
                  : "--:--"}
              </Text>
              {!started && (
                <Badge color="red" variant="light" size="lg">
                  Başlamadı
                </Badge>
              )}
            </Group>
          </Box>
        </Group>

        <Divider orientation="vertical" />

        <Group gap="xs">
          <IconClockStop size={24} className="text-blue-600" />
          <Box>
            <Text size="sm" fw={500} className="text-gray-700" mb={4}>Bitiş Saati</Text>
            <Group gap="md">
              <Text size="lg" fw={700} className="text-gray-900">
                {ended ? 
                  new Date(props.tour.actual_end_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) 
                  : "--:--"}
              </Text>
              {!ended && (
                <Badge color="red" variant="light" size="lg">
                  Bitmedi
                </Badge>
              )}
            </Group>
          </Box>
        </Group>
      </Group>

      {isAdvisorOrAbove && (
        <>
          <Divider my="lg" />
          
          {timeError && (
            <Alert 
              icon={<IconAlertCircle size={16} />}
              color="red" 
              variant="light" 
              mb="md"
            >
              {timeError}
            </Alert>
          )}

          <Box className="bg-gray-50 p-4 rounded-md">
            <Text size="sm" fw={600} className="text-gray-800" mb="md">
              Tur Zamanlarını Güncelle
            </Text>
            <Group gap="lg" align="flex-end">
              <TextInput
                label={<Text fw={500} className="text-gray-700">Başlangıç</Text>}
                placeholder="HH:MM"
                value={startTime}
                onChange={(e) => handleTimeChange(e.currentTarget.value, true)}
                onBlur={(e) => setStartTime(handleTimeBlur(e.currentTarget.value))}
                leftSection={<IconClock size={16} className="text-blue-600" />}
                w={150}
                size="md"
              />
              <TextInput
                label={<Text fw={500} className="text-gray-700">Bitiş</Text>}
                placeholder="HH:MM"
                value={endTime}
                onChange={(e) => handleTimeChange(e.currentTarget.value, false)}
                onBlur={(e) => setEndTime(handleTimeBlur(e.currentTarget.value))}
                leftSection={<IconClock size={16} className="text-blue-600" />}
                w={150}
                size="md"
              />
              <Button
                variant="light"
                size="md"
                onClick={handleTimeUpdate}
                disabled={!startTime || !endTime || !!timeError}
                leftSection={<IconClock size={16} />}
                className="bg-blue-50 hover:bg-blue-100"
              >
                Zamanları Güncelle
              </Button>
            </Group>
          </Box>
        </>
      )}

      <Modal
        opened={showResult}
        onClose={() => setShowResult(false)}
        title={<Text fw={700} className="text-gray-900">Güncelleme Sonucu</Text>}
        centered
        size="md"
      >
        <Text fw={500} className="text-gray-800">{getResultMessage()}</Text>
      </Modal>
    </Paper>
  );
}

export default TimeInformation;