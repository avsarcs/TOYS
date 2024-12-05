import { Button, Card, Center, Image, Space, Stack, Text, Title } from "@mantine/core";
import { DashboardInfoBoxProps } from "../../types/designed.ts";
import React, { useMemo } from "react";
import { DashboardCategory, EventTypeText } from "../../types/enum.ts";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { IconCircleCheck, IconCircleX, IconUsers } from "@tabler/icons-react";

const InfoBox: React.FC<DashboardInfoBoxProps> = (props: DashboardInfoBoxProps) => {
  const buttons = useMemo(() => {
    switch (props.category) {
      case DashboardCategory.EVENT_INVITATIONS:
        return (
          <>
            <Button size="lg" radius="md" fullWidth leftSection={<IconCircleCheck/>}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              Kabul Et
            </Button>
            <Button size="lg" radius="md" fullWidth leftSection={<IconCircleX/>}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              Reddet
            </Button>
          </>
        );
      case DashboardCategory.EVENT_APPLICATIONS:
        return (
          <>
            <Button size="lg" radius="md" fullWidth leftSection={<IconCircleCheck/>}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              Kabul Et
            </Button>
            <Button size="lg" radius="md" fullWidth leftSection={<IconCircleX/>}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              Reddet
            </Button>
          </>
        );
      case DashboardCategory.NO_GUIDE_ASSIGNED:
        return (
          <>
            <Button size="lg" radius="md" fullWidth leftSection={<IconUsers />}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              Rehberleri Yönet
            </Button>
          </>
        );
      default: return <></>
    }
  }, [props.item]);

  return (
    <Stack justify="flex-start" align="center">
      <Title order={2} fw={700} className="text-blue-700 font-main">
        Detailed Information
      </Title>
      <Card ta="center" p="xl" withBorder className="w-full bg-blue-200 rounded-xl">
        <Center>
          <Image
            w="auto"
            h="10rem"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          />
        </Center>
        <Space h="sm"/>
        <Title order={3} fw={700} className="font-main">{ EventTypeText[props.item.event_type] }</Title>
        <Space h="sm"/>
        <Card.Section inheritPadding ta="start">
          <Text size="lg" className="text-gray-600">
            <Text span fw={700}>Lise:</Text> {props.item.highschool.name}
          </Text>
          <Text size="lg" className="text-gray-600">
            <Text span fw={700}>Katılımcı Sayısı:</Text> {props.item.visitor_count}
          </Text>
          <Text size="lg" className="text-gray-600">
            <Text span fw={700}>Rehberler:</Text>
          </Text>
          {
            props.item.accepted_time.length === 0
              ?
              <>
                <Text span size="lg" className="text-gray-600" fw={700}>Zamanlar:</Text>
                {
                  props.item.requested_times.map((value) => {
                    const date = dayjs(value);
                    const dateEnd = date.add(1, "h");
                    return (
                      <Text size="md" fw={500} className="text-gray-600">
                        &nbsp;{date.format("DD MMMM YYYY")} {date.format("HH:mm")}-{dateEnd.format("HH:mm")}
                      </Text>
                    );
                  })
                }
              </>
              :
              <>
              <Text size="lg" className="text-gray-600">
                <Text span fw={700}>Tarih:</Text> {dayjs(props.item.accepted_time).format('DD MMMM YYYY')}
              </Text>
              <Text size="lg" className="text-gray-600">
                <Text span fw={700}>Saat:</Text> &nbsp;{dayjs(props.item.accepted_time).format("HH.mm")}
              </Text>
              </>
          }
        </Card.Section>
        <Space h="sm"/>
        <Card.Section>
          <Stack gap="xs">
            {buttons}
            <Button size="lg" radius="md" fullWidth component={Link}
                    to={`/${props.item.event_type.toLowerCase()}/${props.item.event_id}`}
                    className="text-center border-white bg-blue-600 border-2 outline outline-0
            hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800focus:outline-blue-800 hover:outline-blue-800
            focus:outline-2 hover:outline-2 transition-colors duration-300">
              {EventTypeText[props.item.event_type]} Sayfasına Git
            </Button>
          </Stack>
        </Card.Section>
      </Card>
    </Stack>
  );
}

export default InfoBox;