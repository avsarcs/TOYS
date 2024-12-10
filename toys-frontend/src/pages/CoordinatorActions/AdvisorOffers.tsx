import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AdvisorOffer } from "../../types/data";
import { IconSearch, IconFilter, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { TextInput, Button, Group, Center, Box, Collapse, Modal, Text } from '@mantine/core';
import { DatePickerInput } from "@mantine/dates";
import 'dayjs/locale/tr';
import mockAdvisorOffers from "../../mock_data/mock_advisor_offers.json";

const AdvisorOffers = () => {
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

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
        setDateError("");

        // If end date is set but start date is being cleared, clear end date too
        if (!date && endDate) {
            setEndDate(null);
        }
        // If end date exists, validate the range
        else if (date && endDate && date > endDate) {
            setDateError("Başlangıç tarihi bitiş tarihinden sonra olamaz");
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
        setDateError("");

        // If start date is not set, show error
        if (date && !startDate) {
            setDateError("Lütfen önce başlangıç tarihini seçin");
            setEndDate(null);
            return;
        }
        // Validate the range if start date exists
        if (date && startDate && startDate > date) {
            setDateError("Bitiş tarihi başlangıç tarihinden önce olamaz");
        }
    };

    const fetchOffers = async () => {
        try {
            const params = {
                page: currentPage,
                name: searchTerm || "",
                type: selectedStatuses,
                from_date: startDate ? startDate.toISOString() : "",
                to_date: endDate ? endDate.toISOString() : ""
            };

            // For now, using mock data - replace with actual API call
            // const response = await axios.get('/api/advisor-offers', { params });
            // setOffers(response.data);

            // @ts-expect-error using mock data temporarily
            setOffers(mockAdvisorOffers);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    useEffect(() => {
        fetchOffers();
    }, [currentPage, searchTerm, selectedStatuses, startDate, endDate]);

    const handleStatusToggle = (status: string) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                return prev.filter(s => s !== status);
            } else {
                return [...prev, status];
            }
        });
    };

    const handlePageChange = (direction: "next" | "prev") => {
        const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
        setCurrentPage(newPage);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
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

            {/* Search and Filter Section */}
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
                                        {statusOption}
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
                                <Box className="space-y-1">
                                    <Text size="sm">Başlangıç</Text>
                                    <DatePickerInput
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        locale="tr"
                                        placeholder="gg/aa/yyyy"
                                        valueFormat="DD/MM/YYYY"
                                        classNames={{
                                            input: 'p-2 rounded-lg border border-gray-300'
                                        }}
                                    />
                                </Box>
                                <Box className="space-y-1">
                                    <Text size="sm">Bitiş</Text>
                                    <DatePickerInput
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        locale="tr"
                                        placeholder="gg/aa/yyyy"
                                        valueFormat="DD/MM/YYYY"
                                        minDate={startDate || undefined}
                                        classNames={{
                                            input: 'p-2 rounded-lg border border-gray-300'
                                        }}
                                    />
                                </Box>
                            </Group>
                            {dateError && (
                                <Text className="text-red-500 text-sm">{dateError}</Text>
                            )}
                        </Box>
                    </Box>
                </Collapse>
            </Box>

            {/* Offers List */}
            <Box className="space-y-4">
                {offers.map((offer) => (
                    <Box key={offer.recipient.id} className="bg-blue-100 rounded-lg p-4 flex justify-between items-center">
                        <Box className="space-y-1">
                            <Box className="font-bold text-lg">{offer.recipient.name}</Box>
                            <Box>Teklif Tarihi: {formatDate(offer.offer_date)}</Box>
                            <Box>Cevap Tarihi: {offer.response_date ? formatDate(offer.response_date) : 'Bekliyor'}</Box>
                            <Group>
                                <span>Durum:</span>
                                <span className={`font-bold ${offer.status === 'ACCEPTED' ? 'text-green-600' :
                                    offer.status === 'REJECTED' ? 'text-red-600' :
                                        'text-orange-600'
                                    }`}>
                                    {offer.status === "ACCEPTED" ? "KABUL EDİLDİ" :
                                        offer.status === "REJECTED" ? "REDDEDİLDİ" : "BEKLİYOR"}
                                </span>
                                {offer.status === 'REJECTED' && (
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
                            size="lg"
                            radius="xl"
                        >
                            Profil Sayfası
                        </Button>
                    </Box>
                ))}
            </Box>

            {/* Pagination */}
            <Center mt={32}>
                <Group>
                    <Button
                        variant="subtle"
                        onClick={() => handlePageChange("prev")}
                        disabled={currentPage === 1}
                        leftSection={<IconChevronLeft size={16} />}
                    >
                        Önceki
                    </Button>
                    <Box>Sayfa {currentPage}</Box>
                    <Button
                        variant="subtle"
                        onClick={() => handlePageChange("next")}
                        rightSection={<IconChevronRight size={16} />}
                    >
                        Sonraki
                    </Button>
                </Group>
            </Center>

            {/* Rejection Modal */}
            <Modal
                opened={rejectionModalOpen}
                onClose={() => setRejectionModalOpen(false)}
                centered
                size="md"
                transitionProps={{ duration: 0 }}
            >
                <Box className="space-y-4">
                    <Text className="text-xl font-bold">Reddetme Sebebi</Text>

                    {selectedOffer && (
                        <>
                            <Box className="space-y-2 bg-gray-100 p-4 rounded-lg">
                                <Text className="font-semibold">Rehber Bilgileri:</Text>
                                <Text>İsim: {selectedOffer.recipient.name}</Text>
                                <Text>Teklif Tarihi: {formatDate(selectedOffer.offer_date)}</Text>
                                <Text>Cevap Tarihi: {selectedOffer.response_date ? formatDate(selectedOffer.response_date) : 'Bekliyor'}</Text>
                                <Text className="text-red-600 font-semibold">Durum: REDDEDİLDİ</Text>
                            </Box>

                            <Box className="space-y-2">
                                <Text className="font-semibold">Reddetme Açıklaması:</Text>
                                <Text className="bg-red-50 p-4 rounded-lg">
                                    {selectedOffer.rejection_reason}
                                </Text>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default AdvisorOffers;