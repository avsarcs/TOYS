import { Card, Divider, Grid, ScrollArea, Stack, Text, useMatches } from "@mantine/core";
import { DashboardNotification, DashboardNotificationListProps } from "../../types/designed.ts";
import { DashboardCategory, EventType } from "../../types/enum.ts";
import React from "react";
import NotificationCategoryControl from "./NotificationCategoryControl.tsx";

const mockdata: {
  OWN_EVENTS: DashboardNotification[],
  EVENT_INVITATIONS: DashboardNotification[],
} =
  {
    OWN_EVENTS: [
      {
        eventType: EventType.TOUR, category: DashboardCategory.OWN_EVENTS,
        details: [
          {title: "Lise", detail: "A Lisesi"},
          {title: "Tarih", detail: "15 Kasım 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.OWN_EVENTS,
        details: [
          {title: "Lise", detail: "B Lisesi"},
          {title: "Tarih", detail: "15 Kasım 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.OWN_EVENTS,
        details: [
          {title: "Lise", detail: "C Lisesi"},
          {title: "Tarih", detail: "15 Kasım 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.OWN_EVENTS,
        details: [
          {title: "Lise", detail: "C Lisesi"},
          {title: "Tarih", detail: "15 Kasım 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
      {
        eventType: EventType.TOUR, category: DashboardCategory.OWN_EVENTS,
        details: [
          {title: "Lise", detail: "C Lisesi"},
          {title: "Tarih", detail: "15 Kasım 2024"},
          {title: "Katılımcı Sayısı", detail: 50},
          {title: "Zaman", detail: "10.00-12.00"}
        ]
      },
    ],
    EVENT_INVITATIONS: []
  }

const NotificationList: React.FC<DashboardNotificationListProps> = (props: DashboardNotificationListProps) => {
  const [category, setCategory] = React.useState<DashboardCategory>(DashboardCategory.OWN_EVENTS);
  const col = useMatches({
    base: 12,
    xs: 6,
    sm: 12,
    md: 6,
    lg: 3
  });

  const gridElements = mockdata[category as keyof {
      OWN_EVENTS: DashboardNotification[],
      EVENT_INVITATIONS: DashboardNotification[],
    }].map((value, i) => {
    return (
      <Grid.Col span={col} key={i}>
        <Card onClick={() => props.setNotification(value)} withBorder shadow="sm" radius="md"
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
      <NotificationCategoryControl categories={props.categories} setCategory={setCategory} />
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

export default NotificationList;