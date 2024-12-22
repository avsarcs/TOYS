import React, { useContext, useEffect, useMemo, useState } from "react";
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
  Autocomplete,
  Overlay,
  Loader
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UserContext } from "../../context/UserContext.tsx";
import { IconSearch } from "@tabler/icons-react";
import ListItem from "../../components/FairList/ListItem.tsx";
import { SimpleEventData } from "../../types/data";

const FAIRS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/fairs");

const FairsList: React.FC = () => {
  const userContext = useContext(UserContext);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [fairs, setFairs] = useState<SimpleEventData[]>([]);
  const [searchSchoolName, setSearchSchoolName] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [guideMissing, setGuideMissing] = useState(true);
  const [traineeMissing, setTraineeMissing] = useState(true);
  const [loading, setLoading] = useState(true);

  const getFairs = async () => {
    setLoading(true);
    const fairsUrl = new URL(FAIRS_URL);
    
    // Always append required auth token
    fairsUrl.searchParams.append("auth", userContext.authToken);
    
    // Always append optional parameters, even if empty
    fairsUrl.searchParams.append("status[]", statusFilter.length > 0 ? statusFilter.join(',') : '');
    fairsUrl.searchParams.append("school_name", searchSchoolName || '');
    fairsUrl.searchParams.append("guide_not_assigned", guideMissing.toString());
    
    // Handle dates
    fairsUrl.searchParams.append("from_date", fromDate ? fromDate.toISOString() : '');
    fairsUrl.searchParams.append("to_date", toDate ? toDate.toISOString() : '');
    
    // Handle filter flags
    fairsUrl.searchParams.append("filter_guide_missing", guideMissing.toString());
    fairsUrl.searchParams.append("filter_trainee_missing", traineeMissing.toString());
    fairsUrl.searchParams.append("enrolled_in_fair", "");

    const res = await fetch(fairsUrl, {
      method: "GET"
    });

    if(res.ok) {
        setFairs(await res.json());
        setLoading(false);
    }
  };

  useEffect(() => {
    getFairs().catch(console.error);
    return () => { setFairs([]); }
  }, []); // Empty dependency array as we only want this to run once on mount

  const listHeight = useMatches({
    base: "",
    sm: "",
    md: "50vh",
  });

  const listItems = useMemo(() =>
    fairs ? fairs.map((fair, index) => <ListItem key={index} fair={fair}/>) : null,
  [fairs]);

  const handleSearch = async () => {
    await getFairs().catch(console.error);
  };

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date);
    // If new fromDate makes current toDate invalid, clear toDate
    if (date && toDate && toDate < date) {
      setToDate(null);
    }
  };

  const handleToDateChange = (date: Date | null) => {
    if (date && fromDate && date < fromDate) {
      return; // Don't allow to_date to be earlier than from_date
    }
    setToDate(date);
  };

  return (
    <>
    {loading && (
      <Overlay center blur={2}>
        <Loader size="xl" variant="dots" />
      </Overlay>
    )}
  
    <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
      Fuarlar
    </Title>
    <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
      Okullardan Gelen Fuar Davetleri
    </Title>
    <Space h="xl" />
    <Divider className="border-gray-400" />
    <Stack gap="0" bg="white">
      <Box p="lg">
        <Title order={2}>Filtre</Title>
      </Box>
      <Group grow ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-100">
        <Text size="md" fw={700} className="flex-grow-0">
          Okul:
        </Text>
        <Autocomplete
          leftSection={<IconSearch />}
          placeholder="Okul ismi..."
          limit={7}
          value={searchSchoolName}
          data={[""]}
          onChange={setSearchSchoolName}
        />
        <Button className="flex-grow-0" onClick={handleSearch}>
          Ara
        </Button>
      </Group>
      <Group ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-200">
        <Text size="md" fw={700}>
          Durum:
        </Text>
        <Chip.Group multiple value={statusFilter} onChange={setStatusFilter}>
          <Group>
            <Chip size="lg" color="blue" variant="outline" value="RECEIVED">
              Onay Bekliyor
            </Chip>
            <Chip size="lg" color="blue" variant="outline" value="CONFIRMED">
              Onaylandı
            </Chip>
            <Chip size="lg" color="blue" variant="outline" value="REJECTED">
              Reddedildi
            </Chip>
            <Chip size="lg" color="blue" variant="outline" value="CANCELLED">
              İptal Edildi
            </Chip>
            <Chip size="lg" color="blue" variant="outline" value="ONGOING">
              Devam Ediyor
            </Chip>
            <Chip size="lg" color="blue" variant="outline" value="FINISHED">
              Bitti
            </Chip>
          </Group>
        </Chip.Group>
        <Button onClick={() => setStatusFilter([])}>Temizle</Button>
      </Group>
      <Group ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-100" grow preventGrowOverflow={false} wrap="wrap">
        <Group>
          <Text size="md" fw={700}>
            Başvuru Tarihi:
          </Text>
          <Group wrap="nowrap">
            <DateInput clearable value={fromDate} onChange={handleFromDateChange} />
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
          <Divider orientation="vertical" className="border-gray-400" />
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
      <Space h="md" />
    </Stack>
    <Divider size="sm" className="border-gray-300" />
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

export default FairsList;