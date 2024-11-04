import React from "react";
import {Space, Container, Text} from '@mantine/core';
import Navbar from "../../components/DataAnalysis/Navbar.tsx";
import SearchBar from "../../components/DataAnalysis/UniversitiesList/SearchBar.tsx";
import UniversitiesTable from "../../components/DataAnalysis/UniversitiesList/UniversitiesTable.tsx";

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
        isRival: "false",
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
    const [search, setSearch] = React.useState<string>('');

    const HeaderTextContainer = <Container style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <Text style={{fontSize: 'xx-large'}}>
            Üniversiteler Listesi
        </Text>
    </Container>

    const SearchBarContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <SearchBar onSearchChange={setSearch}/>
        <Space h="xs" />
    </Container>

    const UniversitiesTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <UniversitiesTable data={data} search={search}/>
        <Space h="xs" />
    </Container>


    return <div style={{width: "100%", minHeight: '100vh' }} className={"w-full h-full bg-blue-600 lg:bg-gradient-to-bl lg:from-50% lg:from-blue-600 lg:via-blue-500 lg:to-red-300"}>
        <Navbar activeIndex={0}/>
        <Space h="xl"/>
        {HeaderTextContainer}
        <hr style={{border: '1px solid black'}}/>
        <Space h="xl"/>
        {SearchBarContainer}
        <Space h="xl"/>
        <Space h="xl"/>
        {UniversitiesTableContainer}
        <Space h="xl"/>
    </div>
}

export default UniversitiesList;