import {Divider, Grid, ScrollArea, Stack, useMatches} from "@mantine/core";
import {DashboardItemListProps, DashboardItemProps} from "../../types/designed.ts";
import {DashboardCategory} from "../../types/enum.ts";
import React, {useContext, useEffect, useState} from "react";
import CategoryControl from "./CategoryControl.tsx";
import Item from "./Item.tsx";
import {SimpleEventData} from "../../types/data.ts";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";

const DASHBOARD_URL = import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/dashboard";

const ItemList: React.FC<DashboardItemListProps> & { Item: React.FC<DashboardItemProps> } = (props: DashboardItemListProps) => {
  const col = useMatches({
    base: 12,
    xs: 6,
    sm: 12,
    md: 6,
    lg: 6
  });

  const userContext = useContext(UserContext);
  const [items, setItems] = useState<SimpleEventData[]>([]);

  const fetchDashboardItems = async () => {
    if(props.category === DashboardCategory.NONE) {
      return;
    }

    const dashboardUrl = new URL(DASHBOARD_URL);
    dashboardUrl.searchParams.append("auth", userContext.authToken);
    dashboardUrl.searchParams.append("category", props.category);

    const dashboardRes = await fetch(dashboardUrl, {
      method: "GET"
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
  }

  useEffect(() => {
    fetchDashboardItems().catch(console.error);
  }, [props.category]);

  const gridElements = items.map((value, i) => {
    return (
      <Grid.Col span={col} key={i}>
        <ItemList.Item item={value} setItem={props.setItem}/>
      </Grid.Col>
    );
  });

  return (
    <Stack className="h-full">
      <CategoryControl categories={props.categories} setCategory={props.setCategory}/>
      <Divider />
      <ScrollArea scrollbars="y" mah="60%">
        <Grid p="sm">
          {
            gridElements
          }
        </Grid>
      </ScrollArea>
    </Stack>
  );
}

ItemList.Item = Item;

export default ItemList;