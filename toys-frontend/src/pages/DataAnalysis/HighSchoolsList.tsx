import React, {useContext, useEffect, useState} from "react";
import {Space, Container, Text, LoadingOverlay, Box, Title, Divider} from '@mantine/core';
import HighSchoolsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolsTable.tsx";
import TableFilter from "../../components/DataAnalysis/HighSchoolsList/TableFilter.tsx";
import HighSchoolDetails from "./HighSchoolDetails.tsx";
import HighSchoolAdd from "./HighSchoolAdd.tsx";
import {City} from "../../types/enum.ts";
import {HighschoolData} from "../../types/data.ts";
import {notifications} from "@mantine/notifications";
import {UserContext} from "../../context/UserContext.tsx";

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

const HIGHSCHOOL_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/analytics/high-schools/all");
const HighSchoolsList: React.FC = () => {
    const userContext = useContext(UserContext);
    const [fetchedHighschools, setFetchedHighschools] = useState(false);
    const [highSchools, setHighSchools] = useState<HighschoolData[]>([]);
    const [selectedSearch, setSearch] = useState<string>('');
    const [selectedCities, setSelectedCities] = useState<City[]>([]);
    const [selectedHighSchool, setSelectedHighSchool] = useState<HighschoolData | null>(null);
    const [detailsModalOpened, setDetailsModalOpened] = useState(false);
    const [addModalOpened, setAddModalOpened] = useState(false);

    const fetchHighschools = async () => {
        const highSchoolURL = new URL(HIGHSCHOOL_URL);
        highSchoolURL.searchParams.append("auth", await userContext.getAuthToken());

        const highSchoolRes = await fetch(highSchoolURL, {
            method: "GET",
        });

        if(!highSchoolRes.ok) {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Sayfayı yenileyin veya site yöneticisine haber verin."
            });
            return;
        }

        const fetchedHighSchools = await highSchoolRes.json();
        setHighSchools(fetchedHighSchools);
        setFetchedHighschools(true);
    }

    useEffect(() => {
        fetchHighschools().catch(console.error);
    }, []);

    function openDetails(highSchool: HighschoolData): void {
        setSelectedHighSchool(highSchool);
        setDetailsModalOpened(true);
    }

    function addHighSchool() {
        setAddModalOpened(true);
    }

    const TableFilterContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TableFilter setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </Container>

    const HighSchoolsTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <HighSchoolsTable data={highSchools} search={selectedSearch} cities={selectedCities} openDetails={openDetails} addHighSchool={addHighSchool}/>
        <Space h="xs" />
    </Container>


    return <div style={{width: "100%", minHeight: '100vh' }} className={"w-full h-full relative"}>
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
            {selectedHighSchool && (
                <HighSchoolDetails
                    opened={detailsModalOpened}
                    onClose={() => setDetailsModalOpened(false)}
                    highSchool={selectedHighSchool}
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