import { Card, Divider, Grid, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { DashboardElement, DashboardElementListProps } from "../../types/designed.ts";
import { DashboardCategory, EventType } from "../../types/enum.ts";
import React from "react";

const mockdata: {
  ASSIGNED_EVENTS: DashboardElement[],
  EVENT_INVITATIONS: DashboardElement[],
} =
  {
    ASSIGNED_EVENTS: [
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "High School", detail: "A Lisesi"},
          {title: "Date", detail: "15th of November 2024"},
          {title: "Number of Attendees", detail: 50},
          {title: "Time Slot", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "High School", detail: "B Lisesi"},
          {title: "Date", detail: "15th of November 2024"},
          {title: "Number of Attendees", detail: 50},
          {title: "Time Slot", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "High School", detail: "C Lisesi"},
          {title: "Date", detail: "15th of November 2024"},
          {title: "Number of Attendees", detail: 50},
          {title: "Time Slot", detail: "10.00-12.00"}
        ]
      },

    ],
    EVENT_INVITATIONS: []
  }

const ElementList: React.FC<DashboardElementListProps> = (props: DashboardElementListProps) => {
  const [category, setCategory] = React.useState<string>("ASSIGNED_EVENTS");

  const gridElements = mockdata[category as keyof {
      ASSIGNED_EVENTS: DashboardElement[],
      EVENT_INVITATIONS: DashboardElement[],
    }].map((value, i) => {
    return (
      <Grid.Col span={3} key={i}>
        <Card onClick={() => props.setElement(value)} withBorder shadow="sm" radius="md" className="hover:cursor-pointer">
          <Text>
            {
              value.details.map((value, j) => {
                return (
                  <Text key={j}>
                    <Text span fw={700}>{value.title}:</Text> {value.detail}
                  </Text>
                );
              })
            }
          </Text>
        </Card>
      </Grid.Col>
    );
  });

  return (
    <Stack className="h-full">
      <SegmentedControl
        color="blue" size="lg"
        value={category}
        onChange={(value: string) => { console.log(value); setCategory(value as DashboardCategory); }}
        data={
         [
           {value: "ASSIGNED_EVENTS", label: "Assigned Events"},
           {value: "EVENT_INVITATIONS", label: "Event Invitations"}
         ]
        }
      />
      <Divider />
      <ScrollArea scrollbars="y" mah="50%">
        <Grid p="sm">
          {
            gridElements
          }
        </Grid>
      </ScrollArea>
    </Stack>
  );
}

export default ElementList;