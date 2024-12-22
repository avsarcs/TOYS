import { Card, Divider, Text } from "@mantine/core";
import { DashboardItemProps } from "../../types/designed.ts";
import {EventTypeText, TourTypeText} from "../../types/enum.ts";
import dayjs from "dayjs";
import React from "react";

const Item: React.FC<DashboardItemProps> = (props: DashboardItemProps) => {
  return (
    <Card onClick={() => props.setItem(props.item)} withBorder shadow="sm" radius="md"
          className="hover:cursor-pointer hover:-translate-y-1 transition-transform duration-200">
      <Text fw={700}>{TourTypeText[props.item.event_subtype] || EventTypeText[props.item.event_type]}</Text>
      <Divider h="md"/>
      <Text>
        <Text span fw={700}>Lise:</Text> &nbsp;{props.item.highschool.name}
      </Text>
      <Text>
        <Text span fw={700}>Katılımcı Sayısı:</Text> &nbsp;{props.item.visitor_count}
      </Text>
      {
        props.item.accepted_time.length === 0
          ?
            <>
              <Text span fw={700}>Zamanlar:</Text>
              {
                props.item.requested_times.map((value) => {
                  const date = dayjs(value);
                  const dateEnd = date.add(1, "h");
                  return (
                    <Text>&nbsp;{date.format("DD MMMM YYYY")} {date.format("HH:mm")}-{dateEnd.format("HH:mm")}</Text>
                  );
                })
              }
            </>
          :
          <>
            <Text>
              <Text span fw={700}>Tarih:</Text> &nbsp;{dayjs(props.item.accepted_time).format("DD MMMM YYYY")}
            </Text>
            <Text>
              <Text span fw={700}>Saat:</Text> &nbsp;{dayjs(props.item.accepted_time).format("HH.mm")}
            </Text>
          </>
      }
    </Card>
  )
}

export default Item;