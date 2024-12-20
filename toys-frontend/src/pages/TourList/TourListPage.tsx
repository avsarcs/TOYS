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
  Button, 
  Container, 
  useMatches, 
  ScrollArea, 
  Autocomplete
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
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [guideMissing, setGuideMissing] = useState(false);
  const [traineeMissing, setTraineeMissing] = useState(false);

  const getTours = useCallback(async () => {
    const toursUrl = new URL(TOURS_URL);
    
    // Always append required auth token
    toursUrl.searchParams.append("auth", userContext.authToken);
    
    // Always append optional parameters, even if empty
    toursUrl.searchParams.append("status[]", statusFilter.length > 0 ? statusFilter.join(',') : '');
    toursUrl.searchParams.append("school_name", schoolName || '');
    
    // Handle dates
    toursUrl.searchParams.append("from_date", fromDate ? fromDate.toISOString() : '');
    toursUrl.searchParams.append("to_date", toDate ? toDate.toISOString() : '');
    
    // Handle filter flags
    toursUrl.searchParams.append("filter_guide_missing", guideMissing.toString());
    toursUrl.searchParams.append("filter_trainee_missing", traineeMissing.toString());

    const res = await fetch(toursUrl, {
      method: "GET"
    });

    if(res.ok) {
      setTours(await res.json());
    }
  }, [userContext.authToken, statusFilter, schoolName, fromDate, toDate, guideMissing, traineeMissing]);

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

  const handleSearch = () => {
    getTours().catch(console.error);
  };

  const handleToDateChange = (date: Date | null) => {
    if (date && fromDate && date < fromDate) {
      return; // Don't allow to_date to be earlier than from_date
    }
    setToDate(date);
  };

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
        <Group grow ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-100">
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
          <Button className="flex-grow-0" onClick={handleSearch}>Ara</Button>
        </Group>
        <Group ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-200">
          <Text size="md" fw={700}>
            Durum:
          </Text>
          <Chip.Group multiple value={statusFilter} onChange={setStatusFilter}>
            <Group>
              <Chip size="lg" color="blue" variant="outline" value="RECEIVED">Onay Bekliyor</Chip>
              <Chip size="lg" color="blue" variant="outline" value="TOYS_WANTS_CHANGE">TOYS Değişim İstiyor</Chip>
              <Chip size="lg" color="blue" variant="outline" value="APPLICANT_WANTS_CHANGE">Başvuran Değişim İstiyor</Chip>
              <Chip size="lg" color="blue" variant="outline" value="CONFIRMED">Onaylandı</Chip>
              <Chip size="lg" color="blue" variant="outline" value="REJECTED">Reddedildi</Chip>
              <Chip size="lg" color="blue" variant="outline" value="CANCELLED">İptal Edildi</Chip>
              <Chip size="lg" color="blue" variant="outline" value="ONGOING">Devam Ediyor</Chip>
              <Chip size="lg" color="blue" variant="outline" value="FINISHED">Bitti</Chip>
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
              <DateInput 
                clearable
                value={fromDate}
                onChange={setFromDate}
              />
              <Text>-</Text>
              <DateInput 
                clearable
                value={toDate}
                onChange={handleToDateChange}
                minDate={fromDate || undefined}
              />
            </Group>
          </Group>
          <Group>
            <Divider orientation="vertical" className="border-gray-400"/>
            <Text size="md" fw={700}>
              Diğer:
            </Text>
            <Checkbox 
              label="Rehber atanmamış." 
              size="md"
              checked={guideMissing}
              onChange={(event) => setGuideMissing(event.currentTarget.checked)}
            />
            <Checkbox 
              label="Acemi rehber atanmamış." 
              size="md"
              checked={traineeMissing}
              onChange={(event) => setTraineeMissing(event.currentTarget.checked)}
            />
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
      </Container>
    </>
  )
}

export default TourListPage;