import React, {useCallback, useContext} from "react";
import {Space, Container, Text} from '@mantine/core';
import TableFilter from "../../components/DataAnalysis/RivalsList/TableFilter.tsx";
import RivalsTable from "../../components/DataAnalysis/RivalsList/RivalsTable.tsx";
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

//test data
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

    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [cities, setCities] = React.useState(defaultCities);
    const [universities, setUniversities] = React.useState(defaultUniversities);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    const getUniversities = useCallback(async () => {
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

        console.log(resText);

        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("No university found.");
        }

        setUniversities(fetched);
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

    const HeaderTextContainer = <Container style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Text style={{fontSize: 'xx-large'}}>
            Rakip Üniversiteler Listesi
        </Text>
    </Container>

    const TableFilterContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </Container>

    const RivalsTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <RivalsTable data={universities} search={selectedSearch} cities={selectedCities}/>
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
        {RivalsTableContainer}
        <Space h="xl"/>
        <Space h="xl"/>
    </div>
}

export default RivalsList;