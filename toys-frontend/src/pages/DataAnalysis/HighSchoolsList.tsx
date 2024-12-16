import React, {useCallback, useContext} from "react";
import {Space, Container, Text} from '@mantine/core';
import HighSchoolsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolsTable.tsx";
import TableFilter from "../../components/DataAnalysis/HighSchoolsList/TableFilter.tsx";
import HighSchoolDetails from "./HighSchoolDetails.tsx";
import HighSchoolAdd from "./HighSchoolAdd.tsx";
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

//test data
const defaultCities: string[] = ["Yükleniyor..."];
const defaultHighSchools = [
    {
        highSchool: "Yükleniyor...",
        city: "Yükleniyor...",
        ranking: "1",
        priority: "1",
        id: "1"
    }
];

const HighSchoolsList: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [selectedHighSchoolName, setSelectedHighSchoolName] = React.useState<any>("");
    const [selectedHighSchoolID, setSelectedHighSchoolID] = React.useState<any>("");
    const [detailsModalOpened, setDetailsModalOpened] = React.useState(false);
    const [addModalOpened, setAddModalOpened] = React.useState(false);
    const [cities, setCities] = React.useState(defaultCities);
    const [highSchools, setHighSchools] = React.useState(defaultHighSchools);

    const getCities = useCallback(async () => {
        const url = new URL(TOUR_URL + "/internal/analytics/cities");
        url.searchParams.append("auth", userContext.authToken);

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No city found.");
        }

        setCities(JSON.parse(resText));
    }, [userContext.authToken]);

    const getHighSchools = useCallback(async () => {
        const url = new URL(TOUR_URL + "/internal/analytics/high_schools/all");
        url.searchParams.append("auth", userContext.authToken);

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No high school found.");
        }

        setHighSchools((JSON.parse(resText))["high_schools"]);
    }, [userContext.authToken]);

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

    const HeaderTextContainer = <Container style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Text style={{fontSize: 'xx-large'}}>
            Liseler Listesi
        </Text>
    </Container>

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
        <Space h="xl"/>
        {HeaderTextContainer}
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
    </div>
}

export default HighSchoolsList;