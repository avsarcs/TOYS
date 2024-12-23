import React, {useCallback, useContext} from "react";
import {Space,  Box, Title, Divider, LoadingOverlay, Stack} from '@mantine/core';
import UniversitiesTable from "../../components/DataAnalysis/UniversitiesList/UniversitiesTable.tsx";
import TableFilter from "../../components/DataAnalysis/UniversitiesList/TableFilter.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {City} from "../../types/enum.ts";

// Default data
const defaultCities = ["Yükleniyor..."];
const defaultUniversities = [
    {
        name: "Yükleniyor...",
        city: "Yükleniyor...",
        is_rival: true,
        id: ""
    }
];

const UniversitiesList: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(false);
    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [cities, setCities] = React.useState<string[]>(defaultCities);
    const [universities, setUniversities] = React.useState<{
        name: string;
        city: string;
        is_rival: boolean;
        id: string
    }[]>(defaultUniversities);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    const getUniversities = useCallback(async () => {
        setFetchedData(false);

        const url = new URL(TOUR_URL + "internal/analytics/universities/all");
        url.searchParams.append("auth", await userContext.getAuthToken());

        console.log("Sent request for universities list.");

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for universities list.");

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        if (res.status === 401) {
            notifications.show({
                color: "red",
                title: "Tekrar giriş yapmanız gerekiyor.",
                message: "Oturumun süresi dolmuş."
            });
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if (fetched.length === 0) {
            throw new Error("No university found.");
        }

        setUniversities(fetched);
        setFetchedData(true);
    }, [userContext.getAuthToken]);

    const updateRival = useCallback(async (isRival: boolean, universityID: string) => {
        try {
            const url = new URL(TOUR_URL + "internal/analytics/universities/set-rivalry");
            url.searchParams.append("auth", await userContext.getAuthToken());
            url.searchParams.append("university_id", universityID);
            url.searchParams.append("value_to_set", isRival ? "false" : "true");

            const res = await fetch(url, {
                method: "POST",
            });

            if (res.ok) {
                notifications.show({
                    color: "green",
                    title: "Rakiplik güncellendi!",
                    message: "Üniversite " + (isRival ? "rakip" : "rakip değil") + " olarak işaretlendi."
                });
                window.location.reload();
            } else {
                notifications.show({
                    color: "red",
                    title: "Hay aksi!",
                    message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
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

    React.useEffect(() => {
        getCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    React.useEffect(() => {
        getUniversities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    const TableFilterContainer = <div style={{ padding: '0 20%' }}>
        <Space h="xs"/>
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs"/>
    </div>

    const UniversitiesTableContainer = <div style={{ padding: '0 10%' }}>
        <Space h="xs"/>
        <UniversitiesTable data={universities} search={selectedSearch} cities={selectedCities}
                           changeIsRival={updateRival}/>
        <Space h="xs"/>
    </div>

    return <div style={{width: "100%", minHeight: '100vh'}} className={"w-full h-full"}>
        {
            fetchedData
                ?
                <>
                    <Box className="flex-grow-0 flex-shrink-0">
                        <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                            Üniversiteler
                        </Title>
                        <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                            Sistemde kayıtlı olan üniversitelerin listesi.
                        </Title>
                        <Space h="xl"/>
                        <Divider className="border-gray-400"/>
                    </Box>
                    <Stack gap="0" bg="white">
                        <Space h="md"/>
                        {TableFilterContainer}
                        <Space h="md"/>
                        <Divider size="sm" className="border-gray-300"/>
                        <Space h="md"/>
                        {UniversitiesTableContainer}
                        <Space h="xl"/>
                    </Stack>
                </>
                :
                <LoadingOverlay
                    visible={!fetchedData} zIndex={10}
                    overlayProps={{blur: 1, color: "#444", opacity: 0.8}}/>
        }
    </div>
}

export default UniversitiesList;