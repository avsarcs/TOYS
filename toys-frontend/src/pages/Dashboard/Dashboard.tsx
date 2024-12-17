import {Box, Divider, Flex, Space, Title} from "@mantine/core";
import ItemList from "../../components/Dashboard/ItemList.tsx";
import InfoBox from "../../components/Dashboard/InfoBox.tsx";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {UserContext} from "../../context/UserContext.tsx";
import {DashboardCategory, DashboardCategoryText, UserRole} from "../../types/enum.ts";
import {SimpleEventData} from "../../types/data.ts";

const Dashboard: React.FC = () => {
  const userContext = useContext(UserContext);

  const [item, setItem] = useState<SimpleEventData | null>(null);

  const categories = useMemo(() => {
    switch(userContext.user.role) {
      case UserRole.TRAINEE:
      case UserRole.GUIDE:
        return ([
          {value: DashboardCategory.OWN_EVENT, label: DashboardCategoryText.OWN_EVENT},
          {value: DashboardCategory.EVENT_INVITATION, label: DashboardCategoryText.EVENT_INVITATION}
        ]);
      case UserRole.ADVISOR:
        return [
          {value: DashboardCategory.OWN_EVENT, label: DashboardCategoryText.OWN_EVENT},
          {value: DashboardCategory.PENDING_APPLICATION, label: DashboardCategoryText.PENDING_APPLICATION},
          {value: DashboardCategory.EVENT_INVITATION, label: DashboardCategoryText.EVENT_INVITATION},
          {value: DashboardCategory.GUIDELESS, label: DashboardCategoryText.GUIDELESS},
          {value: DashboardCategory.GUIDE_ASSIGNED, label: DashboardCategoryText.GUIDE_ASSIGNED},
          {value: DashboardCategory.PENDING_MODIFICATION, label: DashboardCategoryText.PENDING_MODIFICATION}
        ]
      default:
        return []
    }
  }, [userContext.user.role]);
  const [category, setCategory] = useState<DashboardCategory>(DashboardCategory.NONE);

  useEffect(() => {
    setCategory(categories.length > 0 ? categories[0].value : DashboardCategory.NONE);
  }, [userContext.authToken, categories]);

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