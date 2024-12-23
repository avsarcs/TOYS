import React, {useMemo} from "react";
import {Group, Stack, Text} from "@mantine/core";
import {FairSectionProps} from "../../types/designed.ts";

// Define the new tour status text mapping
const FairStatusText = {
  RECEIVED: "Onay Bekliyor",
  CONFIRMED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
  ONGOING: "Devam Ediyor",
  FINISHED: "Bitti"
} as const;

const StatusInformation: React.FC<FairSectionProps> = (props: FairSectionProps) => {
  const statusColorClass = useMemo(() => {
    switch (props.fair.status) {
      case "CONFIRMED":
      case "FINISHED":
        return "text-green-500";
      case "REJECTED":
      case "CANCELLED":
        return "text-red-500";
      case "ONGOING":
        return "text-blue-500";
      case "RECEIVED":
        return "text-yellow-600";
      default: 
        return "text-black";
    }
  }, [props.fair.status]);

  return (
    <Group p="lg" bg="white" justify="space-between">
      <Stack gap="0">
        <Text size="xl" fw={900}>
          Fuar Durumu: <Text fw={900} className={statusColorClass} span>{FairStatusText[props.fair.status]}</Text>
        </Text>
      </Stack>
    </Group>
  );
}

export default StatusInformation;