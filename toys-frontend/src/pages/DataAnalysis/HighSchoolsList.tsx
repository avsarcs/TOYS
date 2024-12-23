import React, {useContext, useCallback} from "react";
import {Space, Container, LoadingOverlay, Box, Title, Divider} from '@mantine/core';
import HighSchoolsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolsTable.tsx";
import TableFilter from "../../components/DataAnalysis/HighSchoolsList/TableFilter.tsx";
import HighSchoolDetails from "./HighSchoolDetails.tsx";
import HighSchoolAdd from "./HighSchoolAdd.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {City} from "../../types/enum.ts";

// Container styling
const defaultContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)',
    width: '100%', // Ensure the container takes the full width of its parent
    minWidth: '500px', // Set a minimum width to keep it consistent
    maxWidth: '1200px', // Set a maximum width to keep it consistent
    padding: '10px',
};

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

    const [fetchedHighschools, setFetchedHighschools] = React.useState(false);
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
        setFetchedHighschools(true);
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

    const TableFilterContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </Container>

    const HighSchoolsTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <HighSchoolsTable data={highSchools} search={selectedSearch} cities={selectedCities} openDetails={openDetails} addHighSchool={addHighSchool}/>
        <Space h="xs" />
    </Container>

    return <div style={{width: "100%", minHeight: '100vh' }} className={"w-full h-full"}>
        {
            fetchedHighschools && highSchools.length > 0
              ?
              <>
          <Box className="flex-grow-0 flex-shrink-0">
              <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                  Liseler
              </Title>
              <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                  Göç kaynağı.
              </Title>
              <Space h="xl"/>
              <Divider className="border-gray-400"/>
          </Box>
            <hr style={{border: '1px solid black'}}/>
            <Space h="xl"/>
            {TableFilterContainer}
            <Space h="xl"/>
            <Space h="xl"/>
            {HighSchoolsTableContainer}
            <Space h="xl"/>
            <Space h="xl" />
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
                visible={!fetchedHighschools} zIndex={10}
                overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
        }
    </div>
}

export default HighSchoolsList;