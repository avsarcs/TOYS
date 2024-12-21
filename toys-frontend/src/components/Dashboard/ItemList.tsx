import {Divider, Grid, LoadingOverlay, ScrollArea, Stack, useMatches} from "@mantine/core";
import {DashboardItemListProps, DashboardItemProps} from "../../types/designed.ts";
import CategoryControl from "./CategoryControl.tsx";
import Item from "./Item.tsx";
import React from "react";

const ItemList: React.FC<DashboardItemListProps> & { Item: React.FC<DashboardItemProps> } = (props: DashboardItemListProps) => {
  const col = useMatches({
    base: 12,
    xs: 6,
    sm: 12,
    md: 6,
    lg: 6
  });

  const gridElements = props.items.map((value, i) => {
    return (
      <Grid.Col span={col} key={i}>
        <ItemList.Item item={value} setItem={props.setItem}/>
      </Grid.Col>
    );
  });

  return (
    <Stack className="h-full" pos="relative">
      <CategoryControl categories={props.categories} setCategory={props.setCategory}/>
      <Divider />
      <ScrollArea scrollbars="y" mah="60%" h={props.loading ? "60%" : ""}>
        <LoadingOverlay className="rounded-md"
                        visible={props.loading} zIndex={10}
                        overlayProps={{ blur: 1, color: "#444", opacity: 0.4 }}/>
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