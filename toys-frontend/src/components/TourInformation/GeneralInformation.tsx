import React from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Text } from "@mantine/core";
import dayjs from "dayjs";

const GeneralInformation: React.FC<TourSectionProps> = (props: TourSectionProps) =>{
  const date = dayjs(props.tour.accepted_time);
  const dateEnd = date.add(1, "hour");

  return (
    <Box p="lg" className="bg-gray-100">
      <Text size="md" fw={700}>Lise: <Text span>{ props.tour.highschool.name }</Text></Text>
      <Text size="md" fw={700}>Tarih ve Saat: <Text span>{date.format("DD MMMM YYYY")} {date.format("HH:mm")}-{dateEnd.format("HH:mm")}</Text></Text>
      <Text size="md" fw={700}>Soru-Cevap Odası: <Text span>{ props.tour.classroom }</Text></Text>
    </Box>
  )
}

export default GeneralInformation;