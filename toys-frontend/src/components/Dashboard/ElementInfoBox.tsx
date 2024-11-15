import { Center, Container, Stack, Text, Title, Image, Space, Button } from "@mantine/core";
import { DashboardElementInfoProps } from "../../types/designed.ts";
import React from "react";

const ElementInfoBox: React.FC<DashboardElementInfoProps> = (props: DashboardElementInfoProps) => {
  if(props.element === null) {
    return (<></>);
  }

  return (
    <Stack justify="flex-start" align="center">
      <Title order={2} fw={700} className="text-blue-700 font-main">
        { props.element.eventType }
      </Title>
      <Container p="xl" ta="center" className="w-full bg-blue-200 rounded-3xl">
        <Center>
          <Image
            w="auto"
            h="10rem"
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
          />
        </Center>
        <Space h="sm"/>
        <Title order={3} fw={700} className="font-main">Tour</Title>
        <Space h="sm"/>
        <Container ta="start">
          <Text size="lg" className="text-gray-600">
            {
              props.element.details.map((value, index) => {
                return (
                  <Text key={index}>
                    <Text span fw={700}>{value.title}:</Text> {value.detail}
                  </Text>
                );
              })
            }
          </Text>
        </Container>
        <Space h="sm"/>
        <Button size="lg" radius="md"
                className="text-center border-white bg-blue-600
              border-2 outline outline-0 hover:bg-blue-500 hover:border-blue-800 focus:border-blue-800 
              focus:outline-blue-800 hover:outline-blue-800 focus:outline-2 hover:outline-2 transition-colors duration-300">
          Go to Tour Page
        </Button>
      </Container>
    </Stack>
  );
}

export default ElementInfoBox;