import React from "react";
import {Space, Container, Text} from '@mantine/core';
import HighSchoolsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolsTable.tsx";
import TableFilter from "../../components/DataAnalysis/HighSchoolsList/TableFilter.tsx";
import HighSchoolDetails from "./HighSchoolDetails.tsx";
import HighSchoolAdd from "./HighSchoolAdd.tsx";

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
const cities = ["Ankara", "İstanbul", "İzmir", "Eskişehir", "Adana", "Antalya", "Erzurum", "Konya", "Bursa", "Denizli", "Kayseri", "Kütahya", "Malatya", "Muğla", "Nevşehir", "Niğde", "Samsun", "Ordu", "Osmaniye", "Isparta", "Edirne", "Uşak"];
const data = [
    {
        highSchool: "İzmir Fen Lisesi",
        city: "İzmir",
        ranking: "1",
        priority: "1"
    },
    {
        highSchool: "Ankara Fen Lisesi",
        city: "Ankara",
        ranking: "2",
        priority: "1"
    },
    {
        highSchool: "İstanbul Erkek Lisesi",
        city: "İstanbul",
        ranking: "3",
        priority: "1"
    },
    {
        highSchool: "Kabataş Erkek Lisesi",
        city: "İstanbul",
        ranking: "4",
        priority: "1"
    },
    {
        highSchool: "Galatasaray Lisesi",
        city: "İstanbul",
        ranking: "5",
        priority: "1"
    },
    {
        highSchool: "Bornova Anadolu Lisesi",
        city: "İzmir",
        ranking: "6",
        priority: "1"
    },
    {
        highSchool: "Kadıköy Anadolu Lisesi",
        city: "İstanbul",
        ranking: "7",
        priority: "1"
    },
    {
        highSchool: "Atatürk Anadolu Lisesi",
        city: "Ankara",
        ranking: "8",
        priority: "1"
    },
    {
        highSchool: "Çapa Fen Lisesi",
        city: "İstanbul",
        ranking: "9",
        priority: "1"
    },
    {
        highSchool: "İzmir Atatürk Lisesi",
        city: "İzmir",
        ranking: "10",
        priority: "1"
    },
    {
        highSchool: "Bursa Fen Lisesi",
        city: "Bursa",
        ranking: "11",
        priority: "1"
    },
    {
        highSchool: "Eskişehir Anadolu Lisesi",
        city: "Eskişehir",
        ranking: "12",
        priority: "1"
    },
    {
        highSchool: "Adana Fen Lisesi",
        city: "Adana",
        ranking: "13",
        priority: "1"
    },
    {
        highSchool: "Antalya Anadolu Lisesi",
        city: "Antalya",
        ranking: "14",
        priority: "1"
    },
    {
        highSchool: "Erzurum Fen Lisesi",
        city: "Erzurum",
        ranking: "15",
        priority: "1"
    },
    {
        highSchool: "Konya Anadolu Lisesi",
        city: "Konya",
        ranking: "16",
        priority: "1"
    },
    {
        highSchool: "Denizli Fen Lisesi",
        city: "Denizli",
        ranking: "17",
        priority: "1"
    },
    {
        highSchool: "Kayseri Fen Lisesi",
        city: "Kayseri",
        ranking: "18",
        priority: "1"
    },
    {
        highSchool: "Kütahya Anadolu Lisesi",
        city: "Kütahya",
        ranking: "19",
        priority: "1"
    },
    {
        highSchool: "Malatya Fen Lisesi",
        city: "Malatya",
        ranking: "20",
        priority: "1"
    }

];

const HighSchoolsList: React.FC = () => {
    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [selectedHighSchool, setSelectedHighSchool] = React.useState<any>(null);
    const [detailsModalOpened, setDetailsModalOpened] = React.useState(false);
    const [addModalOpened, setAddModalOpened] = React.useState(false);

    function openDetails(highSchool: any): void {
        setSelectedHighSchool(highSchool);
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
        <HighSchoolsTable data={data} search={selectedSearch} cities={selectedCities} openDetails={openDetails} addHighSchool={addHighSchool}/>
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
    </div>
}

export default HighSchoolsList;