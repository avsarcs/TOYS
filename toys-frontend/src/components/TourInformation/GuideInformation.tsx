import React, { useContext } from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Space, Text } from "@mantine/core";
import { IconUserPlus, IconUsers } from "@tabler/icons-react";
import { UserContext } from "../../context/UserContext.tsx";

const VISITOR_PER_GUIDE = 60;

const GuideInformation: React.FC<TourSectionProps> = (props: TourSectionProps) =>{
  const userContext = useContext(UserContext);

  const totalGuidesNeeded = Math.ceil(props.tour.visitor_count / VISITOR_PER_GUIDE);
  const missingGuides = totalGuidesNeeded - props.tour.guides.length;
  const userAssignedToTour = props.tour.guides.some(value => value.id === userContext?.user.id);

  const guideListText = props.tour.guides.length > 0 ?
    props.tour.guides.map(value => value.full_name).join(", ") : "Kimse";

  const guideListColor = props.tour.guides.length > 0 ? "dark" : "red";

  return (
    <Group p="lg" className="bg-gray-100" justify="space-between" align="flex-start">
      <Box>
        <Text size="md" fw={700}>Rehberler: <Text c={guideListColor} span>{guideListText}</Text></Text>
        <Text size="md" fw={700}>
          {
            missingGuides > 0 ? `Bu turda ${missingGuides} rehbere ihtiyaç var.` :
              "Bu turda daha fazla rehbere ihtiyaç yok."
          }
        </Text>
        <Text size="md" fw={700}>
          {
            userAssignedToTour ? "Bu turda bir rehbersiniz." :
              (missingGuides > 0 ? `Bu tura rehber olabilirsiniz.` :
                "Bu turda rehber olmanız için yer yok.")
          }
        </Text>
        <Space h="sm"/>
        <Button size="md" leftSection={<IconUserPlus/>}>Rehber Ol</Button>
      </Box>
      {

        <Button size="md" leftSection={<IconUsers/>}>Rehberleri Yönet</Button>
      }
    </Group>
  )
}

export default GuideInformation;