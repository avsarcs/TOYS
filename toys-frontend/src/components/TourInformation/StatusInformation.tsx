import React, {useContext, useMemo} from "react";
import {Button, Group, Stack, Text} from "@mantine/core";
import {IconCircleCheck, IconCircleX, IconPencil} from "@tabler/icons-react";
import {TourSectionProps} from "../../types/designed.ts";
import {TourStatus, TourStatusText, TourTypeText, UserRole} from "../../types/enum.ts";
import {UserContext} from "../../context/UserContext.tsx";
import TourCancelButton from "./TourCancelButton.tsx";
import TourRejectButton from "./TourRejectButton.tsx";

const StatusInformation: React.FC<TourSectionProps> = (props: TourSectionProps) =>{
  const userContext = useContext(UserContext);

  const buttons = useMemo(() => {
    switch(userContext.user.role) {
      case UserRole.GUIDE:
      case UserRole.ADVISOR:
        switch(props.tour.status) {
          case TourStatus.RECEIVED:
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <TourRejectButton {...props} />
                <Button size="md" leftSection={<IconPencil />}>Değişiklik İste</Button>
              </>
            );
          case TourStatus.PENDING_MODIFICATION:
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>İptal Et</Button>
              </>
            );
          case TourStatus.CONFIRMED:
            return (
              <TourCancelButton {...props} />
            );
          default: return null;
        }
      case UserRole.NONE:
        switch (props.tour.status) {
          case TourStatus.PENDING_MODIFICATION:
            return (
              <>
                <Button size="md" leftSection={<IconCircleCheck/>}>Kabul Et</Button>
                <Button size="md" leftSection={<IconCircleX/>}>İptal Et</Button>
              </>
            );
        }
    }
  }, [props, userContext.user.role])

  const statusColorClass = useMemo(() => {
    switch (props.tour.status) {
      case TourStatus.CONFIRMED:
        return "text-green-500";
      case TourStatus.REJECTED:
        return "text-red-500";
      case TourStatus.PENDING_MODIFICATION:
      case TourStatus.RECEIVED:
        return "text-yellow-600";

      default: return "text-black";
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