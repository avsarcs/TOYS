import { Box, Divider, Flex, Space, Title } from "@mantine/core";
import ItemList from "../../components/Dashboard/ItemList.tsx";
import InfoBox from "../../components/Dashboard/InfoBox.tsx";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../context/UserContext.tsx";
import { DashboardCategory, DashboardCategoryText, UserRole } from "../../types/enum.ts";
import { SimpleEventData } from "../../types/data.ts";

const Dashboard: React.FC = () => {
  const userContext = useContext(UserContext);

  const [item, setItem] = useState<SimpleEventData | null>(null);

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
          {value: DashboardCategory.AWAITING_MODIFICATION, label: DashboardCategoryText.AWAITING_MODIFICATION}
        ]
      case UserRole.COORDINATOR:
      case UserRole.DIRECTOR:
        return ([
          {value: DashboardCategory.EVENT_APPLICATIONS, label: DashboardCategoryText.EVENT_APPLICATIONS},
          {value: DashboardCategory.GUIDE_APPLICATIONS, label: DashboardCategoryText.GUIDE_APPLICATIONS},
        ]);
      default:
        return []
    }
  }, [userContext?.user.role]);
  const [category, setCategory] = useState<DashboardCategory>(categories.length > 0 ? categories[0].value : DashboardCategory.NONE);

  useEffect(() => {
    setItem(null);
  }, [category]);

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
        <Box className="basis-1 flex-grow flex-shrink"><ItemList category={category} setCategory={setCategory} categories={categories} setItem={setItem}/></Box>
        <Box className="min-w-96 flex-shrink-0 flex-grow-0">
          {
            item !== null ?
              <InfoBox category={category} item={item}/>
            : null
          }
        </Box>
      </Flex>
    </Flex>
  );
}

export default Dashboard;