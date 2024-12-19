import React from 'react';
import { Paper, Group, Stack, Text, Button } from '@mantine/core';
import { TourData } from '../../types/data';

interface ListItemProps {
  tour: TourData;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'CONFIRMED':
      return 'text-green-500';
    case 'REJECTED':
      return 'text-red-500';
    case 'RECEIVED':
      return 'text-orange-500';
    case 'PENDING_MODIFICATION':
      return 'text-blue-500';
    case 'ONGOING':
      return 'text-purple-500';
    case 'FINISHED':
      return 'text-gray-500';
    case 'CANCELLED':
      return 'text-red-400';
    default:
      return 'text-gray-500';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'RECEIVED':
      return 'Onay Bekliyor';
    case 'PENDING_MODIFICATION':
      return 'Değişiklik Bekliyor';
    case 'CONFIRMED':
      return 'Onaylandı';
    case 'REJECTED':
      return 'Reddedildi';
    case 'CANCELLED':
      return 'İptal Edildi';
    case 'ONGOING':
      return 'Devam Ediyor';
    case 'FINISHED':
      return 'Tamamlandı';
    default:
      return status;
  }
};

const getActionButton = (status: string) => {
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
    case 'FINISHED':
    case 'CANCELLED':
      return null;
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
         
          <Text className={`${getStatusColor(tour.status)} font-medium`}>
            {getStatusText(tour.status)}
          </Text>
         
          {getActionButton(tour.status)}
        </Group>
      </Group>
    </Paper>
  );
};

export default ListItem;