import React from "react";
import {Space, Container, Text, Stack} from '@mantine/core';
import DaysGraph from "../../components/TourStatistics/DaysGraph.tsx";
import StatusGraph from "../../components/TourStatistics/StatusGraph.tsx";
import CitiesGraph from "../../components/TourStatistics/CitiesGraph.tsx";

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
const daysData = {"Pazartesi": 1000, "Salı": 800, "Çarşamba": 600, "Perşembe": 400, "Cuma": 200, "Cumartesi": 100, "Pazar": 50};
const statusData = {"Tamamlandı": 1000, "Beklemede": 600, "İptal Edildi": 400};
const citiesData = {"Ankara": 1000, "İstanbul": 800, "İzmir": 600, "Eskişehir": 400, "Adana": 200, "Antalya": 100, "Erzurum": 50, "Konya": 25};

const BilkentStudentDetails: React.FC = () => {
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
                <DaysGraph data={daysData} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Space h="xl"/>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Turların Durumları
                </Text>
                <Space h="xs"/>
                <StatusGraph data={statusData} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Space h="xl"/>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    Tur Gruplarının Geldiği Şehirler
                </Text>
                <Space h="xs"/>
                <CitiesGraph data={citiesData} style={{margin: '20px', maxHeight: '400px'}}/>
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