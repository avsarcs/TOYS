import React, {useContext, useCallback} from "react";
import {Space, LoadingOverlay, Box, Title, Divider, Stack} from '@mantine/core';
import HighSchoolsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolsTable.tsx";
import TableFilter from "../../components/DataAnalysis/HighSchoolsList/TableFilter.tsx";
import HighSchoolDetails from "./HighSchoolDetails.tsx";
import HighSchoolAdd from "./HighSchoolAdd.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {City} from "../../types/enum.ts";

// Default data
const defaultCities: string[] = ["Yükleniyor..."];
const defaultHighSchools = [
    {
        name: "Yükleniyor...",
        city: "Yükleniyor...",
        ranking: "1",
        priority: "1",
        id: ""
    }
];

const HighSchoolsList: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(false);
    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [selectedHighSchoolName, setSelectedHighSchoolName] = React.useState<any>("");
    const [selectedHighSchoolID, setSelectedHighSchoolID] = React.useState<any>("");
    const [detailsModalOpened, setDetailsModalOpened] = React.useState(false);
    const [addModalOpened, setAddModalOpened] = React.useState(false);
    const [cities, setCities] = React.useState(defaultCities);
    const [highSchools, setHighSchools] = React.useState(defaultHighSchools);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    const getHighSchools = useCallback(async () => {
        setFetchedData(false);

        const url = new URL(TOUR_URL + "internal/analytics/high-schools/all-dto");
        url.searchParams.append("auth", await userContext.getAuthToken());

        console.log("Sent request for high schools list.");

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for high schools list.");

        if (!res.ok) {
            console.log(res);
            throw new Error("Response not OK.");
        }

        const resText = await res.text();

        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("No university found.");
        }

        setHighSchools(fetched);
        setFetchedData(true);
    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        getCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    React.useEffect(() => {
        getHighSchools().catch((reason) => {
            console.error(reason);
        });
    }, []);

    function openDetails(highSchoolName: string, highSchoolID: string): void {
        setSelectedHighSchoolName(highSchoolName);
        setSelectedHighSchoolID(highSchoolID);
        setDetailsModalOpened(true);
    }

    function addHighSchool() {
        setAddModalOpened(true);
    }

    const TableFilterContainer = <div style={{ padding: '0 20%' }}>
        <Space h="xs" />
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </div>

    const HighSchoolsTableContainer = <div style={{ padding: '0 10%' }}>
        <Space h="xs" />
        <HighSchoolsTable data={highSchools} search={selectedSearch} cities={selectedCities} openDetails={openDetails} addHighSchool={addHighSchool}/>
        <Space h="xs" />
    </div>

    return <div style={{width: "100%", minHeight: '100vh' }} className={"w-full h-full"}>
        {
            fetchedData
              ?
              <>
          <Box className="flex-grow-0 flex-shrink-0">
              <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                  Liseler
              </Title>
              <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                  Sistemde kayıtlı olan liselerin listesi.
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
              {HighSchoolsTableContainer}
              <Space h="xl" />
          </Stack>
            {selectedHighSchoolID && (
                <HighSchoolDetails
                    opened={detailsModalOpened}
                    onClose={() => setDetailsModalOpened(false)}
                    highSchoolName={selectedHighSchoolName}
                    highSchoolID={selectedHighSchoolID}
                />
            )}
            {
                <HighSchoolAdd
                    opened={addModalOpened}
                    onClose={() => setAddModalOpened(false)}
                />
            }
              </>
            :
              <LoadingOverlay
                visible={!fetchedData} zIndex={10}
                overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
        }
    </div>
}

export default HighSchoolsList;