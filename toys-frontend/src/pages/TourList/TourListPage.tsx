import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {
  Box,
  Text,
  Divider,
  Group,
  Space,
  Stack,
  Title,
  Checkbox,
  Chip,
  Button, Container, Pagination, useMatches, ScrollArea, Autocomplete
} from "@mantine/core";
import {DateInput} from "@mantine/dates";
import {UserContext} from "../../context/UserContext.tsx";
import {IconSearch} from "@tabler/icons-react";
import ListItem from "../../components/TourList/ListItem.tsx";

const TOURS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/tours");

const TourListPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const [tours, setTours] = useState([]);
  const [schoolName, setSchoolName] = useState("");

  const getTours = useCallback(async () => {
    const toursUrl = new URL(TOURS_URL);
    toursUrl.searchParams.append("auth", userContext.authToken);

    const res = await fetch(toursUrl,
      {
        method: "GET"
      });

    if(res.ok) {
      setTours(await res.json());
    }
  }, [userContext.authToken]);

  useEffect(() => {
    getTours().catch(console.error);

    return () => { setTours([]); }
  }, [getTours]);

  const listHeight = useMatches({
    base: "",
    sm: "",
    md: "50vh",
  });

  const listItems = useMemo(() =>
      tours ? tours.map((tour, index) => <ListItem key={index} tour={tour}/>) : null,
    [tours]);

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
        <Group grow  ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-100">
          <Text size="md" fw={700} className="flex-grow-0">
            Okul:
          </Text>
          <Autocomplete
            leftSection={<IconSearch />}
            placeholder="Okul ismi..."
            limit={7}
            value={schoolName}
            data={[""]}
            onChange={setSchoolName}/>
          <Button className="flex-grow-0" onClick={() => { setStatusFilter([]); }}>Ara</Button>
        </Group>
        <Group ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-200">
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
          <Button onClick={() => { setStatusFilter([]); }}>Temizle</Button>
        </Group>
        <Group ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-100" grow preventGrowOverflow={false} wrap="wrap">
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
            {listItems}
            <Space h="xs" />
          </Stack>
        </ScrollArea.Autosize>
        <Divider />
        <Pagination p="md" size="md" total={31}></Pagination>
      </Container>
    </>
  )
}

export default TourListPage;