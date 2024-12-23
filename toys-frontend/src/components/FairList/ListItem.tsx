import {Box, Center, Flex, Paper, Text} from "@mantine/core";
import {FairListItemProps} from "../../types/designed.ts";
import {Link} from "react-router-dom";
import React from "react";
import {EventType, FairStatusText} from "../../types/enum.ts";
import {FairStatus} from "../../types/enum.ts";
import {SimpleEventData} from "../../types/data.ts";
import { IconCalendarWeek } from "@tabler/icons-react";

// Map status to appropriate semantic colors
const statusColorMap = {
  RECEIVED: "blue",
  CONFIRMED: "green",
  REJECTED: "red",
  CANCELLED: "gray",
  ONGOING: "indigo",
  FINISHED: "teal"
} as const;

const ListItem: React.FC<FairListItemProps> = (props: FairListItemProps) => {
  const fair = props.fair as SimpleEventData & { event_type: EventType.FAIR };

  // Get color for current status, defaulting to black if status not found
  const statusColor = statusColorMap[fair.event_status as keyof typeof statusColorMap] || "black";
  const formatISODate = (isoDate: string | number | Date) => {
    const date = new Date(isoDate);

    // Convert to time zone-adjusted string
    return date.toLocaleString("en-GB", {
        timeZone: "UTC", // Adjust time to your desired time zone (e.g., "Europe/London", "America/New_York")
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23", // Use 24-hour time format
    });
  };
  return (
    <Paper withBorder shadow="xs" radius="0" className="bg-gray-100" component={Link} to={`/fair/${fair.event_id}`}>
      <Box p="0" className="transition-transform hover:translate-x-1.5 hover:cursor-pointer">
        <Flex direction="row">
          <Box className="flex-grow flex-shrink basis-1/2 bg-gray-100" p="lg">
            <b>{fair.highschool.name}</b>
            {fair.event_type === EventType.FAIR && fair.accepted_time && (
            <Box mt="sm">
              <Flex align="center">
              <IconCalendarWeek size={16} />
              <Text ml="xs">{formatISODate(fair.accepted_time)}</Text>
              </Flex>
            </Box>
            )}
          </Box>
            
          <Center className="flex-grow flex-shrink basis-1/4 bg-gray-100" p="lg">
            <Text fw={900} c={statusColor}>
              {FairStatusText[fair.event_status as FairStatus]}
            </Text>
          </Center>
        </Flex>
      </Box>
    </Paper>
  );
};

export default ListItem;