import { Divider, Grid, ScrollArea, Stack, useMatches } from "@mantine/core";
import { DashboardItemListProps, DashboardItemProps } from "../../types/designed.ts";
import { EventType } from "../../types/enum.ts";
import React from "react";
import CategoryControl from "./CategoryControl.tsx";
import Item from "./Item.tsx";
import { HighschoolData, SimpleEventData } from "../../types/data.ts";

const mockdata: {
  NONE: SimpleEventData[],
  OWN_EVENT: SimpleEventData[],
  EVENT_INVITATION: SimpleEventData[],
  PENDING_APPLICATION: SimpleEventData[],
  GUIDE_ASSIGNED: SimpleEventData[],
  GUIDELESS: SimpleEventData[],
  PENDING_MODIFICATION: SimpleEventData[],
  GUIDE_APPLICATIONS: SimpleEventData[]
} =
  {
    NONE: [],
    OWN_EVENT: [
      {
        event_type: EventType.TOUR,
        event_id: "tour_-1",
        highschool: {
          name: "A Lisesi"
        } as HighschoolData,
        visitor_count: 31,
        accepted_time: "2024-11-28T02:07:43Z",
        requested_times: ["2024-11-29T02:07:43Z", "2024-11-30T02:07:43Z", "2024-12-01T02:07:43Z"],
      }
    ],
    EVENT_INVITATION: [
      {
        event_type: EventType.TOUR,
        event_id: "tour_-1",
        highschool: {
          name: "A Lisesi"
        } as HighschoolData,
        visitor_count: 31,
        accepted_time: "2024-11-28T02:07:43Z",
        requested_times: ["2024-11-29T02:07:43Z", "2024-11-30T02:07:43Z", "2024-12-01T02:07:43Z"],
      }
    ],
    PENDING_APPLICATION: [
      {
        event_type: EventType.TOUR,
        event_id: "tour_-1",
        highschool: {
          name: "A Lisesi"
        } as HighschoolData,
        visitor_count: 31,
        accepted_time: "",
        requested_times: ["2024-11-29T02:07:43Z", "2024-11-30T02:07:43Z", "2024-12-01T02:07:43Z"],
      }
    ],
    GUIDE_ASSIGNED: [
      {
        event_type: EventType.TOUR,
        event_id: "tour_-1",
        highschool: {
          name: "A Lisesi"
        } as HighschoolData,
        visitor_count: 31,
        accepted_time: "2024-11-28T02:07:43Z",
        requested_times: ["2024-11-29T02:07:43Z", "2024-11-30T02:07:43Z", "2024-12-01T02:07:43Z"],
      }
    ],
    GUIDELESS: [
      {
        event_type: EventType.TOUR,
        event_id: "tour_-1",
        highschool: {
          name: "A Lisesi"
        } as HighschoolData,
        visitor_count: 31,
        accepted_time: "2024-11-28T02:07:43Z",
        requested_times: ["2024-11-29T02:07:43Z", "2024-11-30T02:07:43Z", "2024-12-01T02:07:43Z"],
      }
    ],
    PENDING_MODIFICATION: [
      {
        event_type: EventType.TOUR,
        event_id: "tour_-1",
        highschool: {
          name: "A Lisesi"
        } as HighschoolData,
        visitor_count: 31,
        accepted_time: "2024-11-28T02:07:43Z",
        requested_times: ["2024-11-29T02:07:43Z", "2024-11-30T02:07:43Z", "2024-12-01T02:07:43Z"],
      }
    ],
    GUIDE_APPLICATIONS: []
  }

const ItemList: React.FC<DashboardItemListProps> & { Item: React.FC<DashboardItemProps> } = (props: DashboardItemListProps) => {
  const col = useMatches({
    base: 12,
    xs: 6,
    sm: 12,
    md: 6,
    lg: 3
  });

  const gridElements = mockdata[props.category as keyof typeof mockdata].map((value, i) => {
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