import { Box, Divider, Flex, Space, Title } from "@mantine/core";
import NotificationList from "../../components/Dashboard/NotificationList.tsx";
import NotificationInfoBox from "../../components/Dashboard/NotificationInfoBox.tsx";
import React, { useContext, useMemo, useState } from "react";
import { DashboardNotification } from "../../types/designed.ts";
import { UserContext } from "../../context/UserContext.tsx";
import { DashboardCategory, DashboardCategoryText, UserRole } from "../../types/enum.ts";

const Dashboard: React.FC = () => {
  const [element, setElement] = useState<DashboardNotification | null>(null);

  const userContext = useContext(UserContext);

  const categories = useMemo(() => {
    switch(userContext?.user.role) {
      case UserRole.TRAINEE:
      case UserRole.GUIDE:
        return ([
          {value: DashboardCategory.OWN_EVENTS, label: DashboardCategoryText.OWN_EVENTS},
          {value: DashboardCategory.EVENT_INVITATIONS, label: DashboardCategoryText.EVENT_INVITATIONS}
        ]);
      case UserRole.ADVISOR:
        return [
          {value: DashboardCategory.OWN_EVENTS, label: DashboardCategoryText.OWN_EVENTS},
          {value: DashboardCategory.EVENT_APPLICATIONS, label: DashboardCategoryText.EVENT_APPLICATIONS},
          {value: DashboardCategory.EVENT_INVITATIONS, label: DashboardCategoryText.EVENT_INVITATIONS},
          {value: DashboardCategory.NO_GUIDE_ASSIGNED, label: DashboardCategoryText.NO_GUIDE_ASSIGNED},
          {value: DashboardCategory.GUIDE_ASSIGNED, label: DashboardCategoryText.GUIDE_ASSIGNED},
          {value: DashboardCategory.TOUR_AWAITING_MODIFICATION, label: DashboardCategoryText.TOUR_AWAITING_MODIFICATION}
        ]
      case UserRole.COORDINATOR:
      case UserRole.DIRECTOR:
        return ([
          {value: DashboardCategory.GUIDE_APPLICATIONS, label: DashboardCategoryText.GUIDE_APPLICATIONS},
          {value: DashboardCategory.ADVISOR_APPLICATIONS, label: DashboardCategoryText.ADVISOR_APPLICATIONS}
        ]);
      default:
        return []
    }
  }, [userContext?.user.role]);

  return (
    <Flex direction="column" mih="100vh" className="overflow-y-clip">
      <Box className="flex-grow-0 flex-shrink-0">
        <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
          Pano
        </Title>
        <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
          Önemli olan her şey bir yerde.
        </Title>
        <Space h="xl"/>
        <Divider className="border-gray-400"/>
      </Box>
      <Flex p="xl" direction="row" gap="xl" justify="center" wrap="wrap" className="flex-grow flex-shrink">
        <Box className="basis-1 flex-grow flex-shrink"><NotificationList categories={categories} setNotification={setElement}/></Box>
        <Box className="min-w-96 flex-shrink-0 flex-grow-0"><NotificationInfoBox notification={element}/></Box>
      </Flex>
    </Flex>
  );
}

export default Dashboard;