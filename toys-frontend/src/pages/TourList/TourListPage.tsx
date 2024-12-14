import React, {useContext, useEffect, useState} from "react";
import {
  Box,
  Text,
  Divider,
  Flex,
  Group,
  Space,
  Stack,
  Title,
  Checkbox,
  Chip,
  Button, Container, Paper, Pagination, useMatches, ScrollArea, Center
} from "@mantine/core";
import {DateInput} from "@mantine/dates";
import {UserContext} from "../../context/UserContext.tsx";
import {Link} from "react-router-dom";

const TOURS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/auth/isvalid");

const TourListPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [tours, setTours] = useState([]);

  const getTours = async () => {
    const toursUrl = new URL(TOURS_URL);
    toursUrl.searchParams.append("auth", userContext.authToken);

    const res = await fetch(toursUrl,
      {
        method: "GET"
      });

    setTours(await res.json());
  }

  useEffect(() => {
    getTours().catch(console.error);

    return () => { setTours([]); }
  }, [userContext.authToken]);

  const listHeight = useMatches({
    base: "",
    sm: "",
    md: "50vh",
  });

  return (
    <>
      <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
        Turlar
      </Title>
      <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
        bottom text.
      </Title>
      <Space h="xl"/>
      <Divider className="border-gray-400"/>
      <Stack gap="0" bg="white">
        <Box p="lg">
          <Title order={2}>
            Filtre
          </Title>
        </Box>
        <Group pt="lg" ml="lg" pb="lg" p="xl" className="bg-gray-100">
          <Text size="md" fw={700}>
            Durum:
          </Text>
          <Chip.Group multiple value={statusFilter} onChange={(filter: string[]) => { setStatusFilter(filter)} }>
            <Group>
              <Chip size="lg" color="blue" variant="outline" value="1">Onay Bekliyor</Chip>
              <Chip size="lg" color="blue" variant="outline" value="2">Değişim Bekliyor</Chip>
              <Chip size="lg" color="blue" variant="outline" value="3">Kabul Edildi</Chip>
              <Chip size="lg" color="blue" variant="outline" value="4">Reddedildi</Chip>
              <Chip size="lg" color="blue" variant="outline" value="5">Başladı</Chip>
              <Chip size="lg" color="blue" variant="outline" value="6">Bitti</Chip>
              <Chip size="lg" color="blue" variant="outline" value="7">İptal Edildi</Chip>
            </Group>
          </Chip.Group>
          <Button size="md" onClick={() => { setStatusFilter([]); }}>Temizle</Button>
        </Group>
        <Group pt="lg" ml="lg" pb="lg" p="xl" className="bg-gray-200" grow preventGrowOverflow={false} wrap="wrap">
          <Group>
            <Text size="md" fw={700}>
              Başvuru Tarihi:
            </Text>
            <Group wrap="nowrap">
              <DateInput clearable></DateInput>
              <Text>-</Text>
              <DateInput clearable></DateInput>
            </Group>
          </Group>
          <Group>
            <Divider orientation="vertical" className="border-gray-400"/>
            <Text size="md" fw={700}>
              Diğer:
            </Text>
            <Checkbox label="Rehber atanmamış." size="md"/>
            <Checkbox label="Acemi rehber atanmamış." size="md"/>
          </Group>
        </Group>
        <Space h="md"/>
      </Stack>
      <Divider size="sm" className="border-gray-300"/>
      <Container p="0" fluid bg="white">
        <ScrollArea.Autosize scrollbars="y" mah={listHeight}>
          <Stack gap="xs" className="overflow-x-clip" mah="20%">
            <Paper withBorder shadow="xs" radius="0" className="bg-gray-100" component={Link} to={"/tour/0"}>
              <Box p="0" className="transition-transform hover:translate-x-1.5 hover:cursor-pointer">
                <Flex direction="row">
                  <Box className="flex-grow flex-shrink basis-1/2 bg-gray-100" p="lg">A Lisesi</Box>
                  <Center className="flex-grow flex-shrink basis-1/4 bg-gray-50" p="lg">31 Kişi</Center>
                  <Center className="flex-grow flex-shrink basis-1/4 bg-gray-100" p="lg">
                    <Text fw={900} c="green">Kabul Edildi</Text>
                  </Center>
                </Flex>
              </Box>
            </Paper>
            <Paper withBorder shadow="xs" radius="0" className="bg-gray-100" component={Link} to={"/tour/0"}>
              <Box p="0" className="transition-transform hover:translate-x-1.5 hover:cursor-pointer">
                <Flex direction="row">
                  <Box className="flex-grow flex-shrink basis-1/2 bg-gray-100" p="lg">A Lisesi</Box>
                  <Center className="flex-grow flex-shrink basis-1/4 bg-gray-50" p="lg">31 Kişi</Center>
                  <Center className="flex-grow flex-shrink basis-1/4 bg-gray-100" p="lg">
                    <Text fw={900} c="red">Reddedildi</Text>
                  </Center>
                </Flex>
              </Box>
            </Paper>
            <Space h="xs" />
          </Stack>
        </ScrollArea.Autosize>
        <Divider />
        <Pagination p="md" size="lg" total={31}></Pagination>
      </Container>
    </>
  )
}

export default TourListPage;