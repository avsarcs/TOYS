import React from "react";
import {Space, Container, Text} from '@mantine/core';
import UniversitiesTable from "../../components/DataAnalysis/UniversitiesList/UniversitiesTable.tsx";
import TableFilter from "../../components/DataAnalysis/UniversitiesList/TableFilter.tsx";

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
        university: "ODTÜ",
        city: "Ankara",
        isRival: "true",
    },
    {
        university: "Koç",
        city: "İstanbul",
        isRival: "true",
    },
    {
        university: "İYTE",
        city: "İzmir",
        isRival: "true",
    },
    {
        university: "Boğaziçi",
        city: "İstanbul",
        isRival: "true",
    },
    {
        university: "Hacettepe",
        city: "Ankara",
        isRival: "true",
    },
    {
        university: "Sabancı",
        city: "İstanbul",
        isRival: "true",
    },
    {
        university: "Ege",
        city: "İzmir",
        isRival: "false",
    },
    {
        university: "Anadolu",
        city: "Eskişehir",
        isRival: "false",
    },
    {
        university: "İstanbul",
        city: "İstanbul",
        isRival: "true",
    },
    {
        university: "Marmara",
        city: "İstanbul",
        isRival: "false",
    },
    {
        university: "Çukurova",
        city: "Adana",
        isRival: "false",
    },
    {
        university: "Akdeniz",
        city: "Antalya",
        isRival: "false",
    },
    {
        university: "Atatürk",
        city: "Erzurum",
        isRival: "false",
    },
    {
        university: "Dokuz Eylül",
        city: "İzmir",
        isRival: "true",
    },
    {
        university: "Gazi",
        city: "Ankara",
        isRival: "true",
    },
    {
        university: "Selçuk",
        city: "Konya",
        isRival: "false",
    },
    {
        university: "Uludağ",
        city: "Bursa",
        isRival: "false",
    },
    {
        university: "Pamukkale",
        city: "Denizli",
        isRival: "false",
    },
    {
        university: "Kadir Has",
        city: "İstanbul",
        isRival: "true",
    },
    {
        university: "Yeditepe",
        city: "İstanbul",
        isRival: "true",
    },
    {
        university: "Başkent",
        city: "Ankara",
        isRival: "true",
    },
    {
        university: "Çanakkale Onsekiz Mart",
        city: "Çanakkale",
        isRival: "false",
    },
    {
        university: "Kocaeli",
        city: "Kocaeli",
        isRival: "false",
    },
    {
        university: "Sakarya",
        city: "Sakarya",
        isRival: "false",
    },
    {
        university: "Gaziantep",
        city: "Gaziantep",
        isRival: "false",
    },
    {
        university: "Mersin",
        city: "Mersin",
        isRival: "false",
    },
    {
        university: "Fırat",
        city: "Elazığ",
        isRival: "false",
    },
    {
        university: "Karadeniz Teknik",
        city: "Trabzon",
        isRival: "false",
    },
    {
        university: "Erciyes",
        city: "Kayseri",
        isRival: "false",
    },
    {
        university: "Dumlupınar",
        city: "Kütahya",
        isRival: "false",
    },
    {
        university: "İnönü",
        city: "Malatya",
        isRival: "false",
    },
    {
        university: "Muğla Sıtkı Koçman",
        city: "Muğla",
        isRival: "false",
    },
    {
        university: "Nevşehir Hacı Bektaş Veli",
        city: "Nevşehir",
        isRival: "false",
    },
    {
        university: "Niğde Ömer Halisdemir",
        city: "Niğde",
        isRival: "false",
    },
    {
        university: "Ondokuz Mayıs",
        city: "Samsun",
        isRival: "false",
    },
    {
        university: "Ordu",
        city: "Ordu",
        isRival: "false",
    },
    {
        university: "Osmaniye Korkut Ata",
        city: "Osmaniye",
        isRival: "false",
    },
    {
        university: "Süleyman Demirel",
        city: "Isparta",
        isRival: "false",
    },
    {
        university: "Trakya",
        city: "Edirne",
        isRival: "false",
    },
    {
        university: "Uşak",
        city: "Uşak",
        isRival: "false",
    }
];

const UniversitiesList: React.FC = () => {
    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);

    const HeaderTextContainer = <Container style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Text style={{fontSize: 'xx-large'}}>
            Üniversiteler Listesi
        </Text>
    </Container>

    const TableFilterContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </Container>

    const UniversitiesTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <UniversitiesTable data={data} search={selectedSearch} cities={selectedCities}/>
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
        {UniversitiesTableContainer}
        <Space h="xl"/>
        <Space h="xl"/>
    </div>
}

export default UniversitiesList;