import {Box, Center, Flex, Paper, Text} from "@mantine/core";
import {FairListItemProps} from "../../types/designed.ts";
import {Link} from "react-router-dom";
import React from "react";
import {FairStatusText} from "../../types/enum.ts";
import {FairStatus} from "../../types/enum.ts";

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
  // Get color for current status, defaulting to black if status not found
  const statusColor = statusColorMap[props.fair.event_status as keyof typeof statusColorMap] || "black";
  
  return (
    <Paper withBorder shadow="xs" radius="0" className="bg-gray-100" component={Link} to={`/fair/${props.fair.event_id}`}>
      <Box p="0" className="transition-transform hover:translate-x-1.5 hover:cursor-pointer">
        <Flex direction="row">
          <Box className="flex-grow flex-shrink basis-1/2 bg-gray-100" p="lg">
            {props.fair.highschool.name}
          </Box>
          <Center className="flex-grow flex-shrink basis-1/4 bg-gray-50" p="lg">
            {props.fair.visitor_count} Kişi
          </Center>
          <Center className="flex-grow flex-shrink basis-1/4 bg-gray-100" p="lg">
            <Text fw={900} c={statusColor}>
              {FairStatusText[props.fair.event_status as FairStatus]}
            </Text>
          </Center>
        </Flex>
      </Box>
    </Paper>
  );
};

export default ListItem;