import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Stack} from '@mantine/core';
import DaysGraph from "../../components/TourStatistics/DaysGraph.tsx";
import StatusGraph from "../../components/TourStatistics/StatusGraph.tsx";
import CitiesGraph from "../../components/TourStatistics/CitiesGraph.tsx";
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
const defaultDays = {"Pazartesi": 1, "Salı": 1, "Çarşamba": 1, "Perşembe": 1, "Cuma": 1, "Cumartesi": 1, "Pazar":1};
const defaultStatuses = {"Tamamlandı": 1, "Beklemede": 1, "İptal Edildi": 1};
const defaultCities = {"Ankara": 1, "İstanbul": 1, "İzmir": 1};

const BilkentStudentDetails: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [days, setDays] = React.useState(defaultDays);
    const [statuses, setStatuses] = React.useState(defaultStatuses);
    const [cities, setCities] = React.useState(defaultCities);

    const getDaysAndStatusesAndCities = useCallback(async () => {
        const url = new URL(TOUR_URL + "/internal/analytics/tours");
        url.searchParams.append("auth", userContext.authToken);

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No university found.");
        }

        const response = JSON.parse(resText);
        setDays(response["days"]);
        setStatuses(response["statuses"])
        setCities(response["cities"]);
    }, [userContext.authToken]);

    React.useEffect(() => {
        getDaysAndStatusesAndCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Tur İstatistikleri
        </Text>
    </Container>

    const GraphsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Stack>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Turların Düzenlendiği Günler
                </Text>
                <Space h="xs"/>
                <DaysGraph data={days} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Space h="xl"/>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Turların Durumları
                </Text>
                <Space h="xs"/>
                <StatusGraph data={statuses} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Space h="xl"/>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Tur Gruplarının Geldiği Şehirler
                </Text>
                <Space h="xs"/>
                <CitiesGraph data={cities} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
        </Stack>
        <Space h="xs" />
    </Container>

    return <div style={{width: "100%", minHeight: '100vh'}} className={"w-full h-full"}>
        <Space h="xl"/>
        {HeaderTextContainer}
        <hr style={{border: '1px solid black'}}/>
        <Space h="xl"/>
        {GraphsContainer}
        <Space h="xl"/>
        <Space h="xl"/>
    </div>

}

export default BilkentStudentDetails;