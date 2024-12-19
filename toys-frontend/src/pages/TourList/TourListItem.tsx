import React from 'react';
import { Paper, Group, Stack, Text, Button } from '@mantine/core';
import { TourModel, EventStatus } from '../../types/designed';

interface ListItemProps {
  tour: TourModel;
}

const getStatusColor = (status: EventStatus): string => {
  switch (status) {
    case 'APPROVED':
      return 'text-green-500';
    case 'REJECTED':
      return 'text-red-500';
    case 'AWAITING_CONFIRMATION':
      return 'text-orange-500';
    case 'APPLICANT_WANTS_CHANGE':
      return 'text-blue-500';
    case 'TOYS_WANTS_CHANGE':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusText = (status: EventStatus): string => {
  switch (status) {
    case 'AWAITING_CONFIRMATION':
      return 'Onay Bekliyor';
    case 'APPLICANT_WANTS_CHANGE':
      return 'Başvuran Değişiklik İstiyor';
    case 'TOYS_WANTS_CHANGE':
      return 'TOYS Değişiklik İstiyor';
    case 'APPROVED':
      return 'Onaylandı';
    case 'REJECTED':
      return 'Reddedildi';
    default:
      return status;
  }
};

const getActionButton = (status: EventStatus) => {
  switch (status) {
    case 'REJECTED':
      return (
        <Button
          variant="filled"
          size="sm"
          className="bg-gray-800 hover:bg-gray-700"
        >
          Reddi Geri Al
        </Button>
      );
    default:
      return (
        <Button
          variant="filled"
          size="sm"
          className="bg-gray-800 hover:bg-gray-700"
        >
          Rehber Ata
        </Button>
      );
  }
};

const getEarliestDate = (dates: string[]): string => {
  if (!dates || dates.length === 0) return '';
  return new Date(Math.min(...dates.map(date => new Date(date).getTime())))
    .toLocaleDateString('tr-TR');
};

const ListItem: React.FC<ListItemProps> = ({ tour }) => {
  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      className="hover:bg-gray-50 transition-colors duration-200"
    >
      <Group justify="space-between" align="center">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="lg" fw={500}>{tour.highschool.name}</Text>
          <Text size="sm" c="dimmed">
            En Yakın İstenilen Zaman: {getEarliestDate(tour.requested_times)}
          </Text>
        </Stack>
        
        <Group gap="xl" align="center">
          <Text fw={500}>{tour.visitor_count} Öğrenci</Text>
          
          <Text className={`${getStatusColor(tour.event_status)} font-medium`}>
            {getStatusText(tour.event_status)}
          </Text>
          
          {getActionButton(tour.event_status)}
        </Group>
      </Group>
    </Paper>
  );
};

export default ListItem;