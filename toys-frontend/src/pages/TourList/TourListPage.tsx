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
  LoadingOverlay
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { UserContext } from "../../context/UserContext.tsx";
import { IconSearch } from "@tabler/icons-react";
import ListItem from "../../components/TourList/ListItem.tsx";
import { SimpleEventData } from "../../types/data";
import { UserRole } from "../../types/enum";
import { notifications } from "@mantine/notifications";

const TOURS_PER_PAGE = 7;
const TOURS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour/search");

const TourListPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [statusFilter, setStatusFilter] = useState<string[]>([
    "RECEIVED",
    "TOYS_WANTS_CHANGE",
    "APPLICANT_WANTS_CHANGE",
    "CONFIRMED",
    "REJECTED",
    "CANCELLED",
    "ONGOING",
    "FINISHED"
  ]);
  const [tours, setTours] = useState<SimpleEventData[]>([]);
  const [searchSchoolName, setSearchSchoolName] = useState("");
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [guideMissing, setGuideMissing] = useState(false);
  const [traineeMissing, setTraineeMissing] = useState(false);
  const [amEnrolled, setAmEnrolled] = useState(false);
  const [amInvited, setAmInvited] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const isGuide = userContext.user.role === UserRole.GUIDE;

  const getTours = async () => {
    setLoading(true);
    const toursUrl = new URL(TOURS_URL);
    
    // Always append all parameters, using empty strings for unused optional ones
    toursUrl.searchParams.append("auth", await userContext.getAuthToken());
    toursUrl.searchParams.append("school_name", searchSchoolName || '');
    toursUrl.searchParams.append("status[]", statusFilter.length > 0 ? statusFilter.join(',') : '');
    toursUrl.searchParams.append("from_date", fromDate ? fromDate.toISOString() : '');
    toursUrl.searchParams.append("to_date", toDate ? toDate.toISOString() : '');
    toursUrl.searchParams.append("filter_guide_missing", guideMissing.toString());
    toursUrl.searchParams.append("filter_trainee_missing", traineeMissing.toString());
    toursUrl.searchParams.append("am_enrolled", amEnrolled.toString());
    toursUrl.searchParams.append("am_invited", amInvited.toString());

    try {
      const res = await fetch(toursUrl, {
        method: "GET"
      });

      if (res.ok) {
        setTours(await res.json());
        setPage(1);
      } else {
        throw new Error("Failed to fetch tours");
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Sayfayı yenileyin veya site yöneticisine durumu haber edin."
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTours();
  }, []);

  const listHeight = useMatches({
    base: "",
    sm: "",
    md: "45vh",
  });

  const visibleTours = useMemo(() => 
    tours.slice((page - 1) * TOURS_PER_PAGE, page * TOURS_PER_PAGE),
    [page, tours]
  );

  const listItems = useMemo(() =>
    visibleTours.map((tour, index) => <ListItem key={index} tour={tour}/>),
    [visibleTours]
  );

  const handleSearch = () => {
    getTours();
  };

  const handleFromDateChange = (date: Date | null) => {
    setFromDate(date);
    if (date && toDate && toDate < date) {
      setToDate(null);
    }
  };

  const handleToDateChange = (date: Date | null) => {
    if (date && fromDate && date < fromDate) {
      return;
    }
    setToDate(date);
  };

  const handleClearFilters = () => {
    setStatusFilter([]);
    if (isGuide) {
      setAmEnrolled(false);
      setAmInvited(false);
    } else {
      setGuideMissing(false);
      setTraineeMissing(false);
    }
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
          <Title order={3}>
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
            value={searchSchoolName}
            data={[""]}
            onChange={setSearchSchoolName}/>
          <Button className="flex-grow-0" onClick={handleSearch}>Ara</Button>
        </Group>
        <Group ml="lg" p="xl" pt="lg" pb="lg" className="bg-gray-200">
          <Text size="md" fw={700}>
            Durum:
          </Text>
          <Chip.Group multiple value={statusFilter} onChange={setStatusFilter}>
            <Group wrap="wrap">
              <Chip color="blue" variant="outline" value="RECEIVED">Onay Bekliyor</Chip>
              <Chip color="blue" variant="outline" value="TOYS_WANTS_CHANGE">TOYS Değişim İstiyor</Chip>
              <Chip color="blue" variant="outline" value="APPLICANT_WANTS_CHANGE">Başvuran Değişim İstiyor</Chip>
              <Chip color="blue" variant="outline" value="CONFIRMED">Onaylandı</Chip>
              <Chip color="blue" variant="outline" value="REJECTED">Reddedildi</Chip>
              <Chip color="blue" variant="outline" value="CANCELLED">İptal Edildi</Chip>
              <Chip color="blue" variant="outline" value="ONGOING">Devam Ediyor</Chip>
              <Chip color="blue" variant="outline" value="FINISHED">Tamamlandı</Chip>
            </Group>
          </Chip.Group>
          <Button onClick={handleClearFilters}>Temizle</Button>
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
                onChange={handleFromDateChange}
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
            {isGuide ? (
              <>
                <Checkbox 
                  label="Davet Edildiğim Turlar" 
                  size="md"
                  checked={amInvited}
                  onChange={(event) => setAmInvited(event.currentTarget.checked)}
                />
                <Checkbox 
                  label="Rehberlik Edeceğim Turlar" 
                  size="md"
                  checked={amEnrolled}
                  onChange={(event) => setAmEnrolled(event.currentTarget.checked)}
                />
              </>
            ) : (
              <>
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
              </>
            )}
          </Group>
        </Group>
        <Space h="md"/>
      </Stack>
      <Divider size="sm" className="border-gray-300"/>
      <Container p="0" fluid bg="white">
        {loading ? (
          <LoadingOverlay 
            className="rounded-md"
            visible={true} 
            zIndex={10}
            overlayProps={{ blur: 1, color: "#444", opacity: 0.4 }}
          />
        ) : (
          <ScrollArea.Autosize scrollbars="y" mah={listHeight}>
            <Stack gap="xs" className="overflow-x-clip" mah="20%">
              {listItems}
              <Space h="xs"/>
            </Stack>
          </ScrollArea.Autosize>
        )}
        <Pagination 
          p="md" 
          value={page} 
          onChange={setPage} 
          total={Math.ceil(tours.length / TOURS_PER_PAGE)} 
        />
      </Container>
    </>
  );
};

export default TourListPage;