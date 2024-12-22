import React from 'react';
import { Paper, Group, Stack, Text, Button } from '@mantine/core';

interface SimpleEventModel {
  event_type: 'FAIR';
  event_id: string;
  event_status: 'RECEIVED' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'ONGOING' | 'FINISHED';
  highschool: {
    id: string;
    name: string;
    location: string;
    priority: number;
  };
  accepted_time?: string;
  requested_time: string;
  visitor_count?: number;
  guides: Array<{
    id: string;
    full_name: string;
  }>;
}

interface ListItemProps {
  fair: SimpleEventModel;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'RECEIVED':
      return 'text-yellow-500';
    case 'CONFIRMED':
      return 'text-green-500';
    case 'REJECTED':
      return 'text-red-600';
    case 'CANCELLED':
      return 'text-red-400';
    case 'ONGOING':
      return 'text-indigo-500';
    case 'FINISHED':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'RECEIVED':
      return 'Onay Bekliyor';
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

const getActionButton = (status: string, guides: Array<{ id: string; full_name: string }>) => {
    if (guides.length > 0) return null;

    switch (status) {
        case 'REJECTED':
        case 'CANCELLED':
        case 'FINISHED':
            return null;
        case 'RECEIVED':
        case 'CONFIRMED':
            return (
                <Button
                    variant="filled"
                    size="sm"
                    className="bg-gray-800 hover:bg-gray-700"
                >
                    Rehber Ata
                </Button>
            );
        default:
            return null;
    }
};

const getEarliestDate = (dates: string | string[]): string => {
    if (!dates) return '';
  
    if (typeof dates === 'string') {
      return new Date(dates).toLocaleDateString('tr-TR');
    }
  
    if (dates.length === 0) return '';
  
    return new Date(Math.min(...dates.map(date => new Date(date).getTime())))
      .toLocaleDateString('tr-TR');
  };

const ListItem: React.FC<ListItemProps> = ({ fair }) => {
  return (
    <Paper
      shadow="sm"
      p="lg"
      radius="md"
      className="hover:bg-gray-50 transition-colors duration-200"
    >
      <Group justify="space-between" align="center">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="lg" fw={500}>{fair.highschool.name}</Text>
          <Text size="sm" c="dimmed">
            En Yakın İstenilen Zaman: {getEarliestDate(fair.requested_time)}
          </Text>
        </Stack>

        <Group gap="xl" align="center">
          <Text fw={500}>{fair.visitor_count} Öğrenci</Text>

          <span className={`${getStatusColor(fair.event_status)} font-medium`}>
            {getStatusText(fair.event_status)}
          </span>

          {getActionButton(fair.event_status, fair.guides)}
        </Group>
      </Group>
    </Paper>
  );
};

export default ListItem;