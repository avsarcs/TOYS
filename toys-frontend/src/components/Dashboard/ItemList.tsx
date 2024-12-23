import {Box, Grid, Group, LoadingOverlay, ScrollArea, useMatches} from "@mantine/core";
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
    lg: 6,
    xl: 4
  });

  const gridElements = props.items.map((value, i) => {
    return (
      <>
        <Grid.Col span={col} key={i}>
          <ItemList.Item item={value} setItem={props.setItem}/>
        </Grid.Col>
      </>
    );
  });

  return (
    <Group pos="relative" gap="xl" align="flex-start" justify="stretch" wrap="nowrap" className="h-full w-full" grow preventGrowOverflow={false}>
      <CategoryControl categories={props.categories} setCategory={props.setCategory}/>
      {
        props.loading
          ?
          <Box pos="relative">
            <LoadingOverlay className="rounded-md" h="50vh"
                            visible zIndex={10}
                            overlayProps={{ blur: 1, color: "#444", opacity: 0.4 }}/>
          </Box>
          :
          <Box className="flex-grow flex-shrink basis-2/3">
            <ScrollArea.Autosize scrollbars="y" mah="70vh">
              <Grid>
                {
                  gridElements
                }
              </Grid>
            </ScrollArea.Autosize>
          </Box>
      }
    </Group>
  );
}

ItemList.Item = Item;

export default ItemList;