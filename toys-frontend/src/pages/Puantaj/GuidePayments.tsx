import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import { notifications } from "@mantine/notifications";
import {
  Container,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Paper,
  Stack,
  Chip,
  Card,
  Badge,
  Loader,
  Pagination,
  Transition,
  Overlay,
  Tooltip,
} from "@mantine/core";
import { IconSearch, IconCreditCard, IconInfoCircle, IconCurrencyLira, IconClock, IconBuildingBank } from "@tabler/icons-react";
import { MoneyForGuide } from "../../types/designed";

const GUIDES_PER_PAGE = 5;

const GuidePayments: React.FC = () => {
  const navigate = useNavigate();
  const [paymentsData, setPaymentsData] = useState<MoneyForGuide[]>([]);
  const [filteredData, setFilteredData] = useState<MoneyForGuide[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const userContext = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const getInfo = useCallback(async () => {
    setLoading(true);
    const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
    const url = new URL(apiURL + "internal/management/timesheet/payment-state/guides");
    try {
      url.searchParams.append("auth", await userContext.getAuthToken());
      url.searchParams.append("name", "");
      const res = await fetch(url, {
        method: "GET",
      });

      if (!res.ok) {
        notifications.show({
          color: "red",
          title: "Hata",
          message: "Rehberler görüntülenemiyor."
        });
      } else {
        const resText = await res.text();
        const resJson = JSON.parse(resText);
        setPaymentsData(resJson);
      }
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
      });
    } finally {
      setLoading(false);
    }
  }, [userContext.getAuthToken]);

  useEffect(() => {
    getInfo().catch(console.error);
  }, [getInfo]);

  const filteredPayments = (filteredData || paymentsData).filter((payment) => {
    if (filter === "all") return true;
    if (filter === "unpaid") return payment.debt > 0;
    if (filter === "paid") return payment.debt === 0;
    return true;
  });

  const totalPages = Math.ceil(filteredPayments.length / GUIDES_PER_PAGE);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * GUIDES_PER_PAGE,
    currentPage * GUIDES_PER_PAGE
  );

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredData(null);
    } else {
      const filtered = paymentsData.filter((payment) =>
        payment.guide.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  };

  const payAllDebts = async () => {
    for (const payment of paymentsData) {
      if (payment.debt > 0) {
        try {
          await handlePayDebt(payment.guide.id); // Wait for each payment to complete
        } catch (error) {
          console.error(`Error paying debt for guide ${payment.guide.id}:`, error);
        }
      }
    }
    console.log("Processed all payments.");
  };
  

  const handlePayDebt = useCallback(async (guideId: number) => {
    const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
    const url = new URL(apiURL + "internal/management/timesheet/pay/guide");
    try {
      url.searchParams.append("guide_id", guideId.toString());
      url.searchParams.append("auth", await userContext.getAuthToken());
      const res = await fetch(url, {
        method: "POST",
      });

      if (res.ok) {
        notifications.show({
          color: "blue",
          title: "Ödeme Başarılı!",
          message: "Ödeme başarıyla tamamlandı."
        });
        window.location.reload();
      } else {
        notifications.show({
          color: "red",
          title: "Ödeme Başarısız!",
          message: "Ödeme yapılamadı."
        });
      }
    } catch (e) {
      notifications.show({
        color: "red",
        title: "Hay aksi!",
        message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
      });
    }
  }, [userContext.getAuthToken]);

  const handleDetails = (guideId: string) => {
    navigate(`/payment-detail/${guideId}`);
  };

  return (
    <Container size="xl" py="xl">
      {loading && <Overlay center blur={2}><Loader size="xl" variant="dots" /></Overlay>}
      
      <Stack gap="lg">
        <div>
          <Title order={1} className="text-blue-700">Rehber Ödemeleri</Title>
          <Text size="lg" c="dimmed">Rehberlerin ödeme durumlarını görüntüleyin ve yönetin</Text>
        </div>

        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group gap="md">
            <TextInput
              placeholder="Rehber ismi ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
            />
            <Button onClick={handleSearch} variant="light">Ara</Button>
          </Group>
        </Paper>

        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Group gap="md">
            <Chip.Group multiple={false} value={filter} onChange={(value) => setFilter(value || "all")}>
              <Group gap="xs">
                <Chip value="all" variant="light" color="blue">Tüm Ödemeler</Chip>
                <Chip value="paid" variant="light" color="green">Yapılmış Ödemeler</Chip>
                <Chip value="unpaid" variant="light" color="red">Yapılmamış Ödemeler</Chip>
              </Group>
            </Chip.Group>
            
            <Group ml="auto" gap="xs">
              <Button 
                variant="light" 
                color="blue"
                leftSection={<IconCurrencyLira size={16} />}
                onClick={() => navigate("/change-hourly-rate")}
              >
                Saatlik Ücret Güncelle
              </Button>
              
              <Button 
                variant="filled"
                color="red"
                leftSection={<IconCreditCard size={16} />}
                onClick={() => payAllDebts()}
              >
                Tüm Borçları Öde
              </Button>
            </Group>
          </Group>
        </Paper>

        <Stack gap="md">
          {paginatedPayments.length === 0 ? (
            <Text ta="center" c="dimmed">Kayıt bulunamadı.</Text>
          ) : (
            paginatedPayments.map((payment) => (
              <Transition key={payment.guide.id} mounted={true} transition="fade" duration={400}>
                {(styles) => (
                  <Card shadow="sm" padding="lg" radius="md" withBorder style={styles}>
                    <Group justify="space-between" align="flex-start">
                      <div>
                        <Group gap="xs" mb="xs">
                          <Title order={3}>{payment.guide.name}</Title>
                          <Badge color={payment.debt > 0 ? "red" : "green"}>
                            {payment.debt > 0 ? "Ödeme Bekliyor" : "Ödemesi Yapıldı"}
                          </Badge>
                        </Group>

                        <Stack gap="xs">
                          <Group gap="xs">
                            <IconClock size={16} />
                            <Text>Ödenmemiş Çalışma: {payment.unpaid_hours} saat</Text>
                          </Group>
                          
                          <Group gap="xs">
                            <IconCurrencyLira size={16} />
                            <Text>Borç: {payment.debt} TL</Text>
                          </Group>

                          <Group gap="xs">
                            <IconBuildingBank size={16} />
                            <Text>{payment.guide.bank} - {payment.guide.iban}</Text>
                          </Group>
                        </Stack>
                      </div>

                      <Group gap="xs">
                        <Tooltip label="Ödeme Detayları">
                          <Button
                            variant="light"
                            color="blue"
                            leftSection={<IconInfoCircle size={16} />}
                            onClick={() => handleDetails(payment.guide.id.toString())}
                          >
                            Detaylar
                          </Button>
                        </Tooltip>

                        {payment.debt > 0 && (
                          <Tooltip label="Borç Öde">
                            <Button
                              variant="filled"
                              color="green"
                              leftSection={<IconCreditCard size={16} />}
                              onClick={() => handlePayDebt(payment.guide.id)}
                            >
                              Öde
                            </Button>
                          </Tooltip>
                        )}
                      </Group>
                    </Group>
                  </Card>
                )}
              </Transition>
            ))
          )}
        </Stack>

        {totalPages > 1 && (
          <Group justify="center" mt="xl">
            <Pagination 
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
              color="blue"
              radius="md"
            />
          </Group>
        )}
      </Stack>
    </Container>
  );
};

export default GuidePayments;