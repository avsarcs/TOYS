import React, {useCallback, useContext} from "react";
import {Space, Box, Title, Divider, LoadingOverlay, Stack} from '@mantine/core';
import TableFilter from "../../components/DataAnalysis/RivalsList/TableFilter.tsx";
import RivalsTable from "../../components/DataAnalysis/RivalsList/RivalsTable.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {City} from "../../types/enum.ts";

// Default data
const defaultCities = ["Yükleniyor..."];
const defaultUniversities = [
    {
        name: "Yükleniyor...",
        city: "Yükleniyor...",
        id: "",
    }
];

const RivalsList: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(false);
    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [cities, setCities] = React.useState(defaultCities);
    const [universities, setUniversities] = React.useState(defaultUniversities);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    const getUniversities = useCallback(async () => {
        setFetchedData(false);

        const url = new URL(TOUR_URL + "internal/analytics/universities/rivals");
        url.searchParams.append("auth", await userContext.getAuthToken());

        console.log("Sent request for rivals list.");

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for rivals list.");

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();

        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("No university found.");
        }

        setUniversities(fetched);
        setFetchedData(true);
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
        <Space h="xs" />
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </div>

    const RivalsTableContainer = <div style={{ padding: '0 10%' }}>
        <Space h="xs" />
        <RivalsTable data={universities} search={selectedSearch} cities={selectedCities}/>
        <Space h="xs" />
    </div>

    return <div style={{width: "100%", minHeight: '100vh' }} className={"w-full h-full"}>
        {
            fetchedData
                ?
                <>
                    <Box className="flex-grow-0 flex-shrink-0">
                        <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                            Rakipler
                        </Title>
                        <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                            Sistemde kayıtlı olan rakip üniversitelerin listesi.
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
                        {RivalsTableContainer}
                        <Space h="xl"/>
                    </Stack>
                </>
                :
                <LoadingOverlay
                    visible={!fetchedData} zIndex={10}
                    overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
        }
    </div>
}

export default RivalsList;