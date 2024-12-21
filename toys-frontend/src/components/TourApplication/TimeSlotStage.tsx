import 'dayjs/locale/tr'
import React, { useEffect, useState } from 'react';
import {
  Box,
  Title,
  Stack,
  Button,
  Text,
  Group,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { GroupApplicationStageProps, IndividualApplicationStageProps } from '../../types/designed';

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

const TimeSlotStage: React.FC<GroupApplicationStageProps | IndividualApplicationStageProps> = ({
  applicationInfo,
  setApplicationInfo
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  // Initialize from applicationInfo
  useEffect(() => {
    if (applicationInfo.requested_times?.length > 0) {
      setSelectedTimes(applicationInfo.requested_times);
    }
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
      return [...prev, newTime];
    });
  };

  // Update applicationInfo whenever selectedTimes changes
  useEffect(() => {
    // @ts-expect-error shut up
    setApplicationInfo(prev => ({
      ...prev,
      requested_times: selectedTimes
    }));
  }, [selectedTimes]);

  const isTimeSlotSelected = (timeSlot: TimeSlot): boolean => {
    if (!selectedDate) return false;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const timeString = `${year}-${month}-${day}T${timeSlot.start}+03:00`;
    return selectedTimes.includes(timeString);
  };

  const formatTimeDisplay = (timeString: string): string => {
    const date = new Date(timeString);
    const timeSlot = TIME_SLOTS.find(slot => timeString.endsWith(slot.start));
    
    return `${date.toLocaleDateString('tr-tr', {
      month: 'long',
      day: 'numeric',
    })}, ${timeSlot?.start} - ${timeSlot?.end}`;
  };

  return (
    <Box p="md" className='flex justify-center'>
      <Stack gap="xl">
        <Title order={2} c="blue">Size Uygun Zaman Aralıklarını Seçin</Title>
        <Text size="sm">
          Turunuz için en az bir, en fazla üç zaman aralığı seçin.
          <br/> Seçtiğiniz zaman aralıkları farklı günlerden olabilir.
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

        {selectedTimes.length > 0 && (
          <Box>
            <Text fw={500} mb="xs">Seçili Zaman Aralıkları:</Text>
            {selectedTimes.map((time, index) => (
              <div key={index} className='flex mb-2'>
                <Text className='mr-2'>{formatTimeDisplay(time)}</Text>
                <Button 
                  size='compact-sm' 
                  color='red' 
                  onClick={() => setSelectedTimes(prev => prev.filter(t => t !== time))}
                >
                  İptal
                </Button>
              </div>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default TimeSlotStage;