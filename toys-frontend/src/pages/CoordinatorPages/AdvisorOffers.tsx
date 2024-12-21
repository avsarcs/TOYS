import { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { IconSearch, IconFilter, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { TextInput, Button, Group, Center, Box, Collapse, Modal, Text } from '@mantine/core';
import { DatePickerInput } from "@mantine/dates";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import 'dayjs/locale/tr';

const ADVISOR_OFFERS_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/user/advisor-offer");

interface AdvisorOfferRecipient {
  id: string;
  name: string;
}

interface AdvisorOffer {
  recipient: AdvisorOfferRecipient;
  status: "ACCEPTED" | "REJECTED" | "PENDING";
  offer_date: string;
  response_date: string;
  rejection_reason?: string;
}

const AdvisorOffers = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  
  const [offers, setOffers] = useState<AdvisorOffer[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<AdvisorOffer | null>(null);
  const [dateError, setDateError] = useState<string>("");

  const statusOptions = ["ACCEPTED", "REJECTED", "PENDING"];

  const fetchOffers = async () => {
    try {
      const url = new URL(ADVISOR_OFFERS_URL);
      url.searchParams.append('auth', userContext.authToken);
      
      // Always send name parameter, empty string if not used
      url.searchParams.append('name', searchTerm || '');
      
      // Always send type parameters as array
      if (selectedStatuses.length > 0) {
        selectedStatuses.forEach(status => {
          url.searchParams.append('type[]', status);
        });
      } else {
        url.searchParams.append('type[]', ''); // This will result in type[]=
      }
      
      // Always send date parameters, empty strings if not used
      url.searchParams.append('from_date', startDate ? startDate.toISOString() : '');
      url.searchParams.append('to_date', endDate ? endDate.toISOString() : '');
  
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [userContext.authToken, searchTerm, selectedStatuses, startDate, endDate]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setDateError("");
    if (!date && endDate) {
      setEndDate(null);
    }
    else if (date && endDate && date > endDate) {
      setDateError("Başlangıç tarihi bitiş tarihinden sonra olamaz");
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setDateError("");
    if (date && !startDate) {
      setDateError("Lütfen önce başlangıç tarihini seçin");
      setEndDate(null);
      return;
    }
    if (date && startDate && startDate > date) {
      setDateError("Bitiş tarihi başlangıç tarihinden önce olamaz");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const navigateToProfile = (id: string) => {
    navigate(`/profile/${id}`);
  };

  const handleShowRejectionReason = (offer: AdvisorOffer) => {
    setSelectedOffer(offer);
    setRejectionModalOpen(true);
  };

  const clearDateFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setDateError("");
  };

  return (
    <Box className="p-6 max-w-6xl mx-auto">
      <Center mb={32}>
        <h1 className="text-4xl font-bold text-blue-600">Danışmanlık Teklifleri</h1>
      </Center>

      <Box className="bg-gray-200 rounded-lg p-6 mb-8">
        <Group mb="md">
          <TextInput
            placeholder="İsim ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            rightSection={<IconSearch size={16} />}
            className="flex-1"
          />
          <Button
            leftSection={<IconFilter size={16} />}
            variant="filled"
            className="bg-purple-600"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            Filtrele
          </Button>
        </Group>

        <Collapse in={isFilterOpen}>
          <Box className="space-y-4">
            <Group>
              <Box className="font-semibold min-w-[80px]">Durum:</Box>
              <Group>
                {statusOptions.map((statusOption) => (
                  <Button
                    key={statusOption}
                    variant={selectedStatuses.includes(statusOption) ? "filled" : "subtle"}
                    onClick={() => handleStatusToggle(statusOption)}
                    className={`
                      ${selectedStatuses.includes(statusOption)
                        ? "bg-blue-600 text-white"
                        : "hover:bg-blue-100"}
                      transition-colors
                    `}
                  >
                    {statusOption === "ACCEPTED" ? "KABUL EDİLENLER" :
                     statusOption === "REJECTED" ? "REDDEDİLENLER" : "BEKLEYENLER"}
                  </Button>
                ))}
                {selectedStatuses.length > 0 && (
                  <Button
                    variant="subtle"
                    onClick={() => setSelectedStatuses([])}
                    className="text-gray-600"
                  >
                    Temizle
                  </Button>
                )}
              </Group>
            </Group>

            <Box className="space-y-2">
              <Group>
                <Box className="font-semibold">Teklif Tarihi:</Box>
                {(startDate || endDate) && (
                  <Button
                    variant="subtle"
                    onClick={clearDateFilters}
                    className="text-gray-600"
                  >
                    Temizle
                  </Button>
                )}
              </Group>
              <Group>
                <DatePickerInput
                  value={startDate}
                  onChange={handleStartDateChange}
                  locale="tr"
                  placeholder="Başlangıç Tarihi"
                  label="Başlangıç"
                />
                <DatePickerInput
                  value={endDate}
                  onChange={handleEndDateChange}
                  locale="tr"
                  placeholder="Bitiş Tarihi"
                  label="Bitiş"
                  minDate={startDate || undefined}
                />
              </Group>
              {dateError && (
                <Text className="text-red-500 text-sm">{dateError}</Text>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>

      <Box className="space-y-4">
        {offers.map((offer) => (
          <Box key={offer.recipient.id} className="bg-blue-100 rounded-lg p-4 flex justify-between items-center">
            <Box className="space-y-1">
              <Box className="font-bold text-lg">{offer.recipient.name}</Box>
              <Box>Teklif Tarihi: {formatDate(offer.offer_date)}</Box>
              <Box>Cevap Tarihi: {offer.response_date ? formatDate(offer.response_date) : 'Bekliyor'}</Box>
              <Group>
                <span>Durum:</span>
                <span className={`font-bold ${
                  offer.status === 'ACCEPTED' ? 'text-green-600' :
                  offer.status === 'REJECTED' ? 'text-red-600' :
                  'text-orange-600'
                }`}>
                  {offer.status === "ACCEPTED" ? "KABUL EDİLDİ" :
                   offer.status === "REJECTED" ? "REDDEDİLDİ" : "BEKLİYOR"}
                </span>
                {offer.status === 'REJECTED' && offer.rejection_reason && (
                  <Button
                    variant="subtle"
                    size="compact-md"
                    className="text-blue-600 underline"
                    onClick={() => handleShowRejectionReason(offer)}
                  >
                    Reddetme Sebebini Gör
                  </Button>
                )}
              </Group>
            </Box>
            <Button
              variant="filled"
              className="bg-blue-600"
              onClick={() => navigateToProfile(offer.recipient.id)}
            >
              Profil Sayfası
            </Button>
          </Box>
        ))}
      </Box>

      <Modal
        opened={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        title="Reddetme Sebebi"
        centered
      >
        {selectedOffer && (
          <Box className="space-y-4">
            <Box className="space-y-2">
              <Text>Rehber: {selectedOffer.recipient.name}</Text>
              <Text>Teklif Tarihi: {formatDate(selectedOffer.offer_date)}</Text>
              <Text>Cevap Tarihi: {formatDate(selectedOffer.response_date)}</Text>
            </Box>
            <Box className="space-y-2">
              <Text className="font-bold">Reddetme Sebebi:</Text>
              <Text>{selectedOffer.rejection_reason}</Text>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
};

export default AdvisorOffers;