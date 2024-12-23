import {Box, Divider, Flex, Space, StyleProp, Title, useMatches} from "@mantine/core";
import ItemList from "../../components/Dashboard/ItemList.tsx";
import InfoBox from "../../components/Dashboard/InfoBox.tsx";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {UserContext} from "../../context/UserContext.tsx";
import {DashboardCategory, DashboardCategoryText, UserRole} from "../../types/enum.ts";
import {SimpleEventData} from "../../types/data.ts";
import {notifications} from "@mantine/notifications";
import SoonBar from "../../components/Dashboard/SoonBar.tsx";

const DASHBOARD_URL = import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/dashboard";
const Dashboard: React.FC = () => {
  const userContext = useContext(UserContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<SimpleEventData[]>([]);
  const [item, setItem] = useState<SimpleEventData | null>(null);
  const [currentAbortController, setCurrentAbortController] = useState(new AbortController());
  const wrap = useMatches({
    xs: "wrap",
    md: "nowrap",
  }) as StyleProp<React.CSSProperties['flexWrap']>;;

  const categories = useMemo(() => {
    switch(userContext.user.role) {
      case UserRole.TRAINEE:
      case UserRole.GUIDE:
        return [
          {value: DashboardCategory.OWN_EVENT, label: DashboardCategoryText.OWN_EVENT},
          {value: DashboardCategory.EVENT_INVITATION, label: DashboardCategoryText.EVENT_INVITATION}
        ];
      case UserRole.ADVISOR:
        return [
          {value: DashboardCategory.OWN_EVENT, label: DashboardCategoryText.OWN_EVENT},
          {value: DashboardCategory.PENDING_APPLICATION, label: DashboardCategoryText.PENDING_APPLICATION},
          {value: DashboardCategory.EVENT_INVITATION, label: DashboardCategoryText.EVENT_INVITATION},
          {value: DashboardCategory.GUIDELESS, label: DashboardCategoryText.GUIDELESS},
          {value: DashboardCategory.PENDING_MODIFICATION, label: DashboardCategoryText.PENDING_MODIFICATION}
        ];
      default:
        return [];
    }
  }, [userContext.user.role]);
  const [category, setCategory] = useState<DashboardCategory>(DashboardCategory.NONE);

  const fetchDashboardItems = async (abortController: AbortController) => {
    if(category === DashboardCategory.NONE) {
      return;
    }

    setLoading(true);
    const dashboardUrl = new URL(DASHBOARD_URL);
    dashboardUrl.searchParams.append("auth", await userContext.getAuthToken());
    dashboardUrl.searchParams.append("dashboard_category", category);

    const dashboardRes = await fetch(dashboardUrl, {
      method: "GET",
      signal: abortController.signal,
    });

    if(!dashboardRes.ok) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Kategoriyi değiştirip tekrar deneyin, sayfayı yenileyin veya site yöneticisine haber verin."
      });
    }
    else {
      setItems(await dashboardRes.json());
    }
    setLoading(false);
  }

  const updateDashboard =  () => {
    currentAbortController.abort("Your time is up old man.");
    const abortController = new AbortController();
    setCurrentAbortController(abortController);
    fetchDashboardItems(abortController).catch(console.error);
    setItem(null);
  }

  useEffect(() => {
    setItem(null);
    updateDashboard();
  }, [category]);

  useEffect(() => {
    setCategory(categories.length > 0 ? categories[0].value : DashboardCategory.NONE);
  }, [categories]);
  return (
    <Flex direction="column" mih="100vh" className="overflow-y-hidden">
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
      <Flex direction="row" gap="xl" p="md" justify="center" wrap={wrap} className="flex-grow flex-shrink">
        <Box className="flex-grow flex-shrink">
          <SoonBar setItem={setItem} setCategory={setCategory} />
          <Space h="md"/>
          <ItemList loading={loading} categories={categories} category={category} setCategory={setCategory} items={items} setItem={setItem}/>
        </Box>
        <Box className="max-w-96 min-w-96 flex-shrink-0 flex-grow-0">
          {
            item !== null ?
              <InfoBox category={category} item={item} updateDashboard={updateDashboard}/>
            : null
          }
        </Box>
      </Flex>
    </Flex>
  );
}

export default Dashboard;