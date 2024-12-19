import React, {useContext, useMemo} from "react";
import {Button, Group, Stack, Text} from "@mantine/core";
import {IconCircleCheck, IconCircleX, IconPencil} from "@tabler/icons-react";
import {TourSectionProps} from "../../types/designed.ts";
import {UserRole} from "../../types/enum.ts";
import {UserContext} from "../../context/UserContext.tsx";
import TourCancelButton from "./TourCancelButton.tsx";
import TourRejectButton from "./TourRejectButton.tsx";
import { TourTypeText } from "../../types/enum.ts";

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

  const buttons = useMemo(() => {
    switch(userContext.user.role) {
      case UserRole.GUIDE:
      case UserRole.ADVISOR:
        switch(props.tour.status) {
          case "RECEIVED":
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <TourRejectButton {...props} />
                <Button size="md" leftSection={<IconPencil />}>Değişiklik İste</Button>
              </>
            );
          case "TOYS_WANTS_CHANGE":
          case "APPLICANT_WANTS_CHANGE":
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>Reddet</Button>
              </>
            );
          case "CONFIRMED":
            return (
              <TourCancelButton {...props} />
            );
          default: return null;
        }
      case UserRole.NONE:
        switch (props.tour.status) {
          case "TOYS_WANTS_CHANGE":
          case "APPLICANT_WANTS_CHANGE":
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>Reddet</Button>
              </>
            );
          default: return null;
        }
      default: return null;
    }
  }, [props, userContext.user.role]);

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
          ? <Group>{ buttons }</Group>
          : null
      }
    </Group>
  );
}

export default StatusInformation;