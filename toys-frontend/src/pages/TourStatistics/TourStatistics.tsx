import React, {useCallback, useContext} from "react";
import {Space, Text, Stack, Box, Title, Divider, LoadingOverlay} from '@mantine/core';
import DaysGraph from "../../components/TourStatistics/DaysGraph.tsx";
import StatusGraph from "../../components/TourStatistics/StatusGraph.tsx";
import CitiesGraph from "../../components/TourStatistics/CitiesGraph.tsx";
import {UserContext} from "../../context/UserContext.tsx";

// Container styling

//test data
const defaultDays: { [key: string]: number } = {"Yükleniyor...": 1};
const defaultStatuses: { [key: string]: number } = {"Yükleniyor...": 1};
const defaultCities: { [key: string]: number } = {"Yükleniyor...": 1};

const BilkentStudentDetails: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(false);
    const [days, setDays] = React.useState(defaultDays);
    const [statuses, setStatuses] = React.useState(defaultStatuses);
    const [cities, setCities] = React.useState(defaultCities);

    const getDaysAndStatusesAndCities = useCallback(async () => {
        setFetchedData(false);

        const url = new URL(TOUR_URL + "internal/analytics/tours");
        url.searchParams.append("auth", await userContext.getAuthToken());

        console.log("Sent request for tour statistics.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for tour statistics.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No university found.");
        }

        const response = JSON.parse(resText);

        const unorderedDaysData = response["days"];
        const orderedDaysData = {
            "Pazartesi": unorderedDaysData["MONDAY"],
            "Salı": unorderedDaysData["TUESDAY"],
            "Çarşamba": unorderedDaysData["WEDNESDAY"],
            "Perşembe": unorderedDaysData["THURSDAY"],
            "Cuma": unorderedDaysData["FRIDAY"],
            "Cumartesi": unorderedDaysData["SATURDAY"],
            "Pazar": unorderedDaysData["SUNDAY"]
        };

        const unorderedStatusData = response["statuses"];
        const orderedStatusData = {
            "Alındı": unorderedStatusData["RECEIVED"],
            "Değişiklik Bekliyor": unorderedStatusData["PENDING_MODIFICATION"],
            "İptal Edildi": unorderedStatusData["CANCELLED"],
            "Reddedildi": unorderedStatusData["REJECTED"],
            "Onaylandı": unorderedStatusData["CONFIRMED"],
            "Devam Ediyor": unorderedStatusData["ONGOING"],
            "Tamamlandı": unorderedStatusData["FINISHED"],
        }

        const unorderedCitiesData = response["cities"];
        const orderedCitiesData: { [key: string]: number } = Object.fromEntries(
            Object.entries(unorderedCitiesData).map(([key, value]) => [key.split(" ")[0], value as number])
        );

        setDays(orderedDaysData);
        setStatuses(orderedStatusData)
        setCities(orderedCitiesData);
        setFetchedData(true);

    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        getDaysAndStatusesAndCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    const GraphsContainer = <div>
        <Space h="xs" />
        <Stack>
            <div style={{ padding: '0 20%' }}>
                <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Turların Düzenlendiği Günler
                </Text>
                <Space h="xs"/>
                <DaysGraph data={days} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Divider size="sm" className="border-gray-300"/>
            <div style={{ padding: '0 20%' }}>
                <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Turların Durumları
                </Text>
                <Space h="xs"/>
                <StatusGraph data={statuses} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Divider size="sm" className="border-gray-300"/>
            <div style={{ padding: '0 20%' }}>
                <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Tur Gruplarının Geldiği Şehirler
                </Text>
                <Space h="xs"/>
                <CitiesGraph data={cities} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
        </Stack>
        <Space h="xs" />
    </div>

    return <div style={{width: "100%", minHeight: '100vh'}} className={"w-full h-full"}>
        {
            fetchedData
                ?
                <>
                    <Box className="flex-grow-0 flex-shrink-0">
                        <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                            Tur İstatistikleri
                        </Title>
                        <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                            Sisteme kayıtlı olan turların istatistikleri.
                        </Title>
                        <Space h="xl"/>
                        <Divider className="border-gray-400"/>
                    </Box>
                    <Stack gap="0" bg="white">
                        {GraphsContainer}
                    </Stack>
                </>
                :
                <LoadingOverlay
                    visible={!fetchedData} zIndex={10}
                    overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
        }
    </div>
}

export default BilkentStudentDetails;