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
  Pagination,
  Overlay,
  Loader
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UserContext } from "../../context/UserContext.tsx";
import { IconSearch } from "@tabler/icons-react";
import ListItem from "../../components/FairList/ListItem.tsx";
import { SimpleEventData, FairData } from "../../types/data";
import { EventType } from "../../types/enum";

const FAIRS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/fair/search");
const PENDING_FAIRS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/dashboard");
type CombinedFairData = FairData | (SimpleEventData & { event_type: EventType.FAIR });


const FairsList: React.FC = () => {
  const userContext = useContext(UserContext);
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "RECEIVED",
    "CONFIRMED", 
    "REJECTED",
    "CANCELLED",
    "ONGOING",
    "FINISHED"
  ]);
  const [fairs, setFairs] = useState<CombinedFairData[]>([]);
  const [searchSchoolName, setSearchSchoolName] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [guideMissing, setGuideMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const getFairs = async () => {
    setLoading(true);
  
    try {
      // Prepare URL for fetching fairs
      const fairsUrl = new URL(FAIRS_URL);
      fairsUrl.searchParams.append("auth", await userContext.getAuthToken());
      fairsUrl.searchParams.append("status[]", statusFilter.length > 0 ? statusFilter.join(",") : "");
      fairsUrl.searchParams.append("school_name", searchSchoolName || "");
      fairsUrl.searchParams.append("from_date", fromDate ? fromDate.toISOString() : "");
      fairsUrl.searchParams.append("to_date", toDate ? toDate.toISOString() : "");
      fairsUrl.searchParams.append("filter_guide_missing", guideMissing ? "true" : "");
      fairsUrl.searchParams.append("filter_trainee_missing", "");
      fairsUrl.searchParams.append("enrolled_in_fair", "");
      fairsUrl.searchParams.append("guide_not_assigned", guideMissing ? "true" : "");
  
      // Fetch fairs from the main endpoint
      const fairsRes = await fetch(fairsUrl, { method: "GET" });
      if (!fairsRes.ok) throw new Error("Failed to fetch fairs");
      const fairsData: FairData[] = await fairsRes.json();
  
      // Prepare URL for fetching pending applications
      const pendingUrl = new URL(PENDING_FAIRS_URL);
      pendingUrl.searchParams.append("auth", await userContext.getAuthToken());
      pendingUrl.searchParams.append("dashboard_category", "PENDING_APPLICATION"); // Example parameter
  
      // Fetch pending applications
      const pendingRes = await fetch(pendingUrl, { method: "GET" });
      if (!pendingRes.ok) throw new Error("Failed to fetch pending applications");
      const pendingData: SimpleEventData[] = await pendingRes.json();
  
      // Filter pending applications to only include events with event_type: FAIR
      const filteredPendingData = pendingData.filter((fair) => fair.event_type === EventType.FAIR);
  
      const normalizedFairs = [
        ...fairsData,
        ...filteredPendingData.map((fair) => ({
          ...fair,
          event_type: EventType.FAIR, // Ensure event_type is explicitly EventType.FAIR
        } as SimpleEventData & { event_type: EventType.FAIR })),
      ];
  
      // Remove duplicates by event_id
      const uniqueFairs = Array.from(
        new Map(
          normalizedFairs.map((fair) => [
        'event_id' in fair ? fair.event_id : fair.fair_id,
        fair
          ])
        ).values()
      );
  
      setFairs(uniqueFairs);
      setPage(1);
    } catch (error) {
      console.error("Error fetching fairs or pending applications:", error);
    } finally {
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

    const paginatedFairs = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return fairs.slice(startIndex, endIndex);
  }, [fairs, page]);

  const listItems = useMemo(
    () => paginatedFairs.map((fair, index) => <ListItem key={index} fair={fair} />),
    [paginatedFairs]
  );
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
      <Pagination 
                p="md" 
                value={page} 
                onChange={setPage} 
                total={Math.ceil(fairs.length / 10)} 
              />
    </Container>
  </>
  
  )
}

export default FairsList;