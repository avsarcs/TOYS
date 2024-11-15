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
          {title: "Lise", detail: "A Lisesi"},
          {title: "Tarih", detail: "15th of November 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "Lise", detail: "B Lisesi"},
          {title: "Tarih", detail: "15th of November 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "Lise", detail: "C Lisesi"},
          {title: "Tarih", detail: "15th of November 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "Lise", detail: "C Lisesi"},
          {title: "Tarih", detail: "15th of November 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.ASSIGNED_EVENTS,
        details: [
          {title: "Lise", detail: "C Lisesi"},
          {title: "Tarih", detail: "15th of November 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
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
        <Card onClick={() => props.setElement(value)} withBorder shadow="sm" radius="md"
              className="hover:cursor-pointer hover:-translate-y-1 transition-transform duration-200">
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
        onChange={(value: string) => { props.setElement(null); setCategory(value as DashboardCategory); }}
        data={
         [
           {value: "ASSIGNED_EVENTS", label: "Atanmış Etkinlikler"},
           {value: "EVENT_INVITATIONS", label: "Etkinlik Davetiyeleri"}
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