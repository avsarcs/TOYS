import { Center, Stack, Text, Title, Image, Space, Button, Card } from "@mantine/core";
import { DashboardNotificationInfoProps } from "../../types/designed.ts";
import React from "react";

const NotificationInfoBox: React.FC<DashboardNotificationInfoProps> = (props: DashboardNotificationInfoProps) => {
  if(props.notification === null) {
    return null;
  }

  return (
    <Stack justify="flex-start" align="center" className={""}>
      <Title order={2} fw={700} className="text-blue-700 font-main">
        Detailed Information
      </Title>
      <Card p="xl" ta="center" withBorder className="w-full bg-blue-200 rounded-3xl">
        <Center>
          <Image
            w="auto"
            h="10rem"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          />
        </Center>
        <Space h="sm"/>
        <Title order={3} fw={700} className="font-main">{ props.notification.eventType }</Title>
        <Space h="sm"/>
        <Card.Section inheritPadding ta="start">
          {
            props.notification.details.map((value, index) => {
              return (
                <Text size="lg" className="text-gray-600" key={index}>
                  <Text span fw={700}>{value.title}:</Text> {value.detail}
                </Text>
              );
            })
          }
        </Card.Section>
        <Space h="sm"/>
        <Card.Section>
          <Button size="lg" radius="md" fullWidth
                  className="text-center border-white bg-blue-600
                border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800
                focus:outline-blue-800 hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300">
            Tur Sayfasına Git
          </Button>
        </Card.Section>
      </Card>
    </Stack>
  );
}

export default NotificationInfoBox;