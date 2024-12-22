import React from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Text, Group, Badge } from "@mantine/core";
import dayjs from "dayjs";

const GeneralInformation: React.FC<TourSectionProps> = (props: TourSectionProps) => {
  const date = dayjs(props.tour.accepted_time);
  const dateEnd = date.add(1, "hour");

  return (
    <Box p="lg" className="bg-gray-100">
      <Text size="md" fw={700}>Lise: <Text span>{props.tour.highschool.name}</Text></Text>
      <Text size="md" fw={700}>Tarih ve Saat: <Text span>{date.format("DD MMMM YYYY")} {date.format("HH:mm")}-{dateEnd.format("HH:mm")}</Text></Text>
      {props.tour.classroom && (
        <Text size="md" fw={700}>Soru-Cevap Odası: <Text span>{props.tour.classroom}</Text></Text>
      )}
      {props.tour.type === "individual" && props.tour.requested_majors && props.tour.requested_majors.length > 0 && (
        <Box mt="md">
          <Text size="md" fw={700} mb="xs">İstenen Bölümler:</Text>
          <Group gap="xs">
            {props.tour.requested_majors.map((major, index) => (
              <Badge key={index} color="blue" variant="light">
                {major}
              </Badge>
            ))}
          </Group>
        </Box>
      )}
    </Box>
  );
};

export default GeneralInformation;