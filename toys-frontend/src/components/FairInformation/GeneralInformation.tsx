import React from "react";
import { FairSectionProps } from "../../types/designed.ts";
import { Box, Text } from "@mantine/core";
import dayjs from "dayjs";

const GeneralInformation: React.FC<FairSectionProps> = (props: FairSectionProps) => {
  const date = dayjs(props.fair.start_time);
  const dateEnd = dayjs(props.fair.end_time);
  return (
    <Box p="lg" className="bg-gray-100">
      <Text size="md" fw={700}>Lise: <Text span>{props.fair.applicant ? props.fair.applicant.highschool.name : "N/A"}</Text></Text>
      <Text size="md" fw={700}>Tarih ve Saat: <Text span>{date.format("DD MMMM YYYY")} {date.format("HH:mm")}-{dateEnd.format("HH:mm")}</Text></Text>
    </Box>
  );
};

export default GeneralInformation;