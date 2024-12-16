import React, { useContext, useMemo } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";
import { IconCircleCheck, IconCircleX, IconPencil } from "@tabler/icons-react";
import { TourSectionProps } from "../../types/designed.ts";
import { TourStatus, TourStatusText, TourTypeText, UserRole } from "../../types/enum.ts";
import { UserContext } from "../../context/UserContext.tsx";

const StatusInformation: React.FC<TourSectionProps> = (props: TourSectionProps) =>{
  const userContext = useContext(UserContext);

  const buttons = useMemo(() => {
    switch(userContext?.user.role) {
      case UserRole.GUIDE:
      case UserRole.ADVISOR:
        switch(props.tour.status) {
          case TourStatus.AWAITING_CONFIRMATION:
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>İptal Et</Button>
                <Button size="md" leftSection={<IconPencil />}>Değişiklik İste</Button>
              </>
            );
          case TourStatus.TOYS_WANTS_CHANGE:
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>İptal Et</Button>
              </>
            );
          default: return null;
        }
      case UserRole.NONE:
        switch (props.tour.status) {
          case TourStatus.TOYS_WANTS_CHANGE:
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>İptal Et</Button>
              </>
            );
        }
    }
  }, [props.tour.status, userContext?.user.role])

  let statusColorClass = "text-black";

  switch (props.tour.status) {
    case TourStatus.APPROVED:
      statusColorClass = "text-green-500";
      break;
    case TourStatus.REJECTED:
      statusColorClass = "text-red-500";
      break;
    case TourStatus.APPLICANT_WANTS_CHANGE:
    case TourStatus.TOYS_WANTS_CHANGE:
    case TourStatus.AWAITING_CONFIRMATION:
      statusColorClass = "text-yellow-600";
      break;
    default: break;
  }

  console.log(props.tour);

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
        userContext?.user.role === UserRole.ADVISOR
          ?
        <Group>
          { buttons }
        </Group>
          : null
      }
    </Group>
  )
}

export default StatusInformation;