import {Box, Center, Flex, Paper, Text} from "@mantine/core";
import {TourListItemProps} from "../../types/designed.ts";
import {Link} from "react-router-dom";
import React from "react";

const ListItem: React.FC<TourListItemProps> = (props: TourListItemProps) => {
  return (
    <Paper withBorder shadow="xs" radius="0" className="bg-gray-100" component={Link} to={`/tour/${props.tour.event_id}`}>
      <Box p="0" className="transition-transform hover:translate-x-1.5 hover:cursor-pointer">
        <Flex direction="row">
          <Box className="flex-grow flex-shrink basis-1/2 bg-gray-100" p="lg">{props.tour.highschool.name}</Box>
          <Center className="flex-grow flex-shrink basis-1/4 bg-gray-50" p="lg">{props.tour.visitor_count} Kişi</Center>
          <Center className="flex-grow flex-shrink basis-1/4 bg-gray-100" p="lg">
            <Text fw={900} c="green">{}</Text>
          </Center>
        </Flex>
      </Box>
    </Paper>
  );
};

export default ListItem;