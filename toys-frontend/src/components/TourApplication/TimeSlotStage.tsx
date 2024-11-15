import 'dayjs/locale/tr'
import React, { useEffect, useState } from 'react';
import {
  Box,
  Title,
  Stack,
  Button,
  Text,
  Paper,
  Group,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { GroupApplicationStageProps, IndividualApplicationStageProps } from '../../types/designed';

interface TimeSlot {
  start: string;
  end: string;
}

interface SelectedSlot {
  date: Date;
  timeSlot: TimeSlot;
}

const TIME_SLOTS: TimeSlot[] = [
  { start: '09:00', end: '11:00' },
  { start: '10:00', end: '12:00' },
  { start: '13:00', end: '15:00' },
  { start: '14:00', end: '16:00' },
  { start: '15:00', end: '19:00' },
];

const TimeSlotStage: React.FC<GroupApplicationStageProps | IndividualApplicationStageProps> = ({
  setApplicationInfo
}) => {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  useEffect(() => {
    
    const arrayOfSlots : string[][] = []

    for (const slot of selectedSlots) {
      const date = slot.date

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const startTime = `${year}-${month}-${day}T${slot.timeSlot.start}`
      const endTime = `${year}-${month}-${day}T${slot.timeSlot.end}`

      arrayOfSlots.push([startTime, endTime])
    }

    setApplicationInfo((application) => ({
      ...application,
      "times": arrayOfSlots
    }))

  }, [selectedSlots])

  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (!selectedDate) return;

    setSelectedSlots((prev) => {
      const existingSlotIndex = prev.findIndex(
        (slot) =>
          slot.date.toDateString() === selectedDate.toDateString() &&
          slot.timeSlot.start === timeSlot.start
      );

      if (existingSlotIndex !== -1) {
        return prev.filter((_, index) => index !== existingSlotIndex);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, { date: selectedDate, timeSlot }];
    });
  };

  const deleteTimeSlot = (date: Date, timeSlot: TimeSlot) => {
    if (!date) return;

    setSelectedSlots((prev) => {
      const existingSlotIndex = prev.findIndex(
        (slot) =>
          slot.date.toDateString() === date.toDateString() &&
          slot.timeSlot.start === timeSlot.start
      );

      if (existingSlotIndex !== -1) {
        return prev.filter((_, index) => index !== existingSlotIndex);
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, { date: date, timeSlot }];
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('tr-tr', {
      month: 'long',
      day: 'numeric',
    });
  };

  const isTimeSlotSelected = (timeSlot: TimeSlot): boolean => {
    return selectedSlots.some(
      (slot) =>
        slot.date.toDateString() === selectedDate?.toDateString() &&
        slot.timeSlot.start === timeSlot.start
    );
  };

  return (
    <Box p="md" className='flex justify-center'>
      <Stack gap="xl">
        <Title order={2} c="blue">Size Uygun Zaman Aralıklarını Seçin</Title>
        <Text size="sm">Turunuz için en az bir, en fazla üç zaman aralığı seçin.
          <br/> Seçtiğiniz zaman aralıkları farklı günlerden olabilir. <br/>
          <br/> Turunuzun onaylanması halinde belirttiğiniz tarihlerden<br/>Tanıtım Ofisi'nin programına uyan herhangi birinde karar kılınacaktır.
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

        {selectedSlots.length > 0 && (
          <Paper p="md" withBorder>
            <Text fw={500} mb="xs">Seçili Zaman Aralıkları:</Text>
            {selectedSlots.map((slot, index) => (<div className='flex'>
              <Text key={index} className='mr-2 mb-2'>
                {formatDate(slot.date)}, {slot.timeSlot.start} - {slot.timeSlot.end}
              </Text>
              <Button size='compact-sm' color='red' onClick={() => deleteTimeSlot(slot.date, slot.timeSlot)}>İptal</Button>
              </div>
            ))}
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default TimeSlotStage;
