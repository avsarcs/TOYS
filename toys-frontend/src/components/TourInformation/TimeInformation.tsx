import React, { useContext } from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Paper, Space, Text } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import { UserContext } from "../../context/UserContext.tsx";
import { UserRole } from "../../types/enum.ts";

const TimeInformation: React.FC<TourSectionProps> = (props: TourSectionProps) =>{
  const userContext = useContext(UserContext);

  const started = props.tour.actual_start_time.length !== 0;
  const ended = props.tour.actual_end_time.length !== 0;
  const startParsed = dayjs(props.tour.actual_start_time);
  const endParsed = dayjs(props.tour.actual_end_time);

  return (
    <Box p="lg">
      <Group>
        <Text size="md" span fw={700}>Başladığı saat:</Text>
        <Paper p="0.3125rem" pl="0.35rem" withBorder>
          <Group gap="0.35rem">
            <IconClock />
            <Text pr="lg" span>
              {
                started ? startParsed.format("HH:mm") : "--:--"
              }
            </Text>
          </Group>
        </Paper>
        {
          started ? null : <Text size="md" c="red" span fw={500}>Tur henüz başlamadı.</Text>
        }
      </Group>
      <Space h="md"/>
      <Group>
        <Text size="md" span fw={700}>Bittiği saat:</Text>
        <Paper p="0.3125rem" pl="0.35rem" withBorder>
          <Group gap="0.35rem">
            <IconClock />
            <Text pr="lg" span>
              {
                ended ? endParsed.format("HH:mm") : "--:--"
              }
            </Text>
          </Group>
        </Paper>
        {
          ended ? null : <Text size="md" c="red" span fw={500}>Tur henüz bitmedi.</Text>
        }
      </Group>
      <Space h="md"/>
      {
        (userContext.user.role === UserRole.GUIDE || userContext.user.role === UserRole.ADVISOR)
          ?
        <Group>
          <Button size="md" disabled={started}>Turu Başlat</Button>
          <Button size="md" disabled={!started || ended}>Turu Bitir</Button>
        </Group>
          : null
      }
    </Box>
  )
}

export default TimeInformation;