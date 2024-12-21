import React, {useContext, useMemo} from "react";
import {Group, Stack, Text} from "@mantine/core";
import {TourSectionProps} from "../../types/designed.ts";
import {UserRole} from "../../types/enum.ts";
import {UserContext} from "../../context/UserContext.tsx";
import { TourTypeText } from "../../types/enum.ts";
import TourStatusActions from "../TourStatusActions/TourStatusActions.tsx";

// Define the new tour status text mapping
const TourStatusText = {
  RECEIVED: "Onay Bekliyor",
  TOYS_WANTS_CHANGE: "TOYS Değişiklik İstiyor",
  APPLICANT_WANTS_CHANGE: "Başvuran Değişiklik İstiyor",
  CONFIRMED: "Onaylandı",
  REJECTED: "Reddedildi",
  CANCELLED: "İptal Edildi",
  ONGOING: "Devam Ediyor",
  FINISHED: "Bitti"
} as const;

const StatusInformation: React.FC<TourSectionProps> = (props: TourSectionProps) => {
  const userContext = useContext(UserContext);

  const statusColorClass = useMemo(() => {
    switch (props.tour.status) {
      case "CONFIRMED":
      case "FINISHED":
        return "text-green-500";
      case "REJECTED":
      case "CANCELLED":
        return "text-red-500";
      case "ONGOING":
        return "text-blue-500";
      case "RECEIVED":
      case "TOYS_WANTS_CHANGE":
      case "APPLICANT_WANTS_CHANGE":
        return "text-yellow-600";
      default: 
        return "text-black";
    }
  }, [props.tour.status]);

  return (
    <Group p="lg" bg="white" justify="space-between">
      <Stack gap="0">
        <Text size="xl" fw={900}>
          Tur Durumu: <Text fw={900} className={statusColorClass} span>{TourStatusText[props.tour.status]}</Text>
        </Text>
        <Text pl="sm" mt="-xs" size="lg" fw={700} className="text-gray-600">
          {TourTypeText[props.tour.type.toUpperCase() as keyof typeof TourTypeText]}
        </Text>
      </Stack>
      {
        userContext.user.role === UserRole.ADVISOR
          ? <Group><TourStatusActions tour={props.tour} onRefresh={props.refreshTour} /></Group>
          : null
      }
    </Group>
  );
}

export default StatusInformation;