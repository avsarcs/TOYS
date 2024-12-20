import React, { useEffect, useState } from 'react';
import { Box, Title, Stack, Text, Group } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { FairApplicationModel } from '../../types/designed';

// Add plugins to dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeSelectionStageProps {
  applicationInfo: FairApplicationModel;
  setApplicationInfo: React.Dispatch<React.SetStateAction<FairApplicationModel>>;
  onValidationSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeSelectionStage: React.FC<TimeSelectionStageProps> = ({
  applicationInfo,
  setApplicationInfo,
  onValidationSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  useEffect(() => {
    if (applicationInfo.start_time) {
      const startDateTime = dayjs(applicationInfo.start_time).tz('Europe/Istanbul');
      setStartTime(startDateTime.format('HH:mm'));
      setSelectedDate(startDateTime.toDate());
    }
    if (applicationInfo.end_time) {
      const endDateTime = dayjs(applicationInfo.end_time).tz('Europe/Istanbul');
      setEndTime(endDateTime.format('HH:mm'));
    }
  }, [applicationInfo]);

  const formatISO = (date: Date | null, time: string) => {
    if (!date || !time || !time.includes(':')) return ''; // Validate input
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return ''; // Ensure time values are numeric
  
    // Combine date and time, then set Turkish timezone
    const dateWithTime = dayjs(date)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .tz('Europe/Istanbul', true); // Set explicitly to Turkish timezone
  
    return dateWithTime.format('YYYY-MM-DDTHH:mm:ssZ'); // Return ISO 8601 with +03:00
  };
  

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const startISO = formatISO(date, startTime);
    const endISO = formatISO(date, endTime);
    setApplicationInfo((prev) => ({
      ...prev,
      start_time: startISO,
      end_time: endISO,
    }));
    validateInputs(startISO, endISO);
  };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    setStartTime(time);
    const startISO = formatISO(selectedDate, time);
    setApplicationInfo((prev) => ({
      ...prev,
      start_time: startISO,
    }));
    validateInputs(startISO, applicationInfo.end_time);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;
    setEndTime(time);
    const endISO = formatISO(selectedDate, time);
    setApplicationInfo((prev) => ({
      ...prev,
      end_time: endISO,
    }));
    validateInputs(applicationInfo.start_time, endISO);
  };

  const validateInputs = (startISO: string, endISO: string) => {
    if (!startISO || !endISO || new Date(startISO) >= new Date(endISO)) {
      onValidationSuccess(false);
    } else {
      onValidationSuccess(true);
    }
  };

  return (
    <Box p="md" className="flex justify-center">
      <Stack gap="xl">
        <Title order={2} c="blue">
          Tarih ve Saat Seçimi
        </Title>
        <Text size="sm">Gelmemizi istediğiniz tarih ve saat aralığını belirtin.</Text>

        <Group align="flex-start" gap="xl">
          <Box>
            <Text c="blue" fw={500} mb="xs">
              Tarih Seçin
            </Text>
            <DatePicker
              locale="tr"
              value={selectedDate}
              onChange={handleDateChange}
              minDate={new Date()}
            />
          </Box>

          <Box>
            <Text c="blue" fw={500} mb="xs">
              Sonra Zaman Aralığı Seçin
            </Text>
            <Stack gap="sm">
            <TimeInput
            label="Start Time"
            value={startTime}
            onChange={handleStartTimeChange}
            withSeconds={false}
            styles={(theme) => ({
              input: {
                borderColor: theme.colors.blue[6],
                '&:focus': {
                  borderColor: theme.colors.blue[7],
                },
              },
              label: {
                color: theme.colors.blue[6],
              },
            })}
          />

<TimeInput
            label="End Time"
            value={endTime}
            onChange={handleEndTimeChange}
            withSeconds={false}
            styles={(theme) => ({
              input: {
                borderColor: theme.colors.blue[6],
                '&:focus': {
                  borderColor: theme.colors.blue[7],
                },
              },
              label: {
                color: theme.colors.blue[6],
              },
            })}
          />   
           </Stack>
          </Box>
        </Group>
      </Stack>
    </Box>
  );
};

export default TimeSelectionStage;
