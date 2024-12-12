import React from "react";
import {Space, Container, Text} from '@mantine/core';
import TableFilter from "../../components/DataAnalysis/RivalsList/TableFilter.tsx";
import RivalsTable from "../../components/DataAnalysis/RivalsList/RivalsTable.tsx";

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
    },
    {
        university: "Koç",
        city: "İstanbul",
    },
    {
        university: "İYTE",
        city: "İzmir",
    },
    {
        university: "Boğaziçi",
        city: "İstanbul",
    },
    {
        university: "Hacettepe",
        city: "Ankara",
    },
    {
        university: "Sabancı",
        city: "İstanbul",
    },
    {
        university: "Ege",
        city: "İzmir",
    },
    {
        university: "Anadolu",
        city: "Eskişehir",
    },
    {
        university: "İstanbul",
        city: "İstanbul",
    },
    {
        university: "Marmara",
        city: "İstanbul",
    },
    {
        university: "Çukurova",
        city: "Adana",
    },
    {
        university: "Akdeniz",
        city: "Antalya",
    },
    {
        university: "Atatürk",
        city: "Erzurum",
    },
    {
        university: "Dokuz Eylül",
        city: "İzmir",
    },
    {
        university: "Gazi",
        city: "Ankara",
    },
    {
        university: "Selçuk",
        city: "Konya",
    },
    {
        university: "Uludağ",
        city: "Bursa",
    },
    {
        university: "Pamukkale",
        city: "Denizli",
    },
    {
        university: "Kadir Has",
        city: "İstanbul",
    },
    {
        university: "Yeditepe",
        city: "İstanbul",
    },
    {
        university: "Başkent",
        city: "Ankara",
    },
    {
        university: "Çanakkale Onsekiz Mart",
        city: "Çanakkale",
    },
    {
        university: "Kocaeli",
        city: "Kocaeli",
    },
    {
        university: "Sakarya",
        city: "Sakarya",
    },
    {
        university: "Gaziantep",
        city: "Gaziantep",
    },
    {
        university: "Mersin",
        city: "Mersin",
    },
    {
        university: "Fırat",
        city: "Elazığ",
    },
    {
        university: "Karadeniz Teknik",
        city: "Trabzon",
    },
    {
        university: "Erciyes",
        city: "Kayseri",
    },
    {
        university: "Dumlupınar",
        city: "Kütahya",
    },
    {
        university: "İnönü",
        city: "Malatya",
    },
    {
        university: "Muğla Sıtkı Koçman",
        city: "Muğla",
    },
    {
        university: "Nevşehir Hacı Bektaş Veli",
        city: "Nevşehir",
    },
    {
        university: "Niğde Ömer Halisdemir",
        city: "Niğde",
    },
    {
        university: "Ondokuz Mayıs",
        city: "Samsun",
    },
    {
        university: "Ordu",
        city: "Ordu",
    },
    {
        university: "Osmaniye Korkut Ata",
        city: "Osmaniye",
    },
    {
        university: "Süleyman Demirel",
        city: "Isparta",
    },
    {
        university: "Trakya",
        city: "Edirne",
    },
    {
        university: "Uşak",
        city: "Uşak",
    }
];

const RivalsList: React.FC = () => {
    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);

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
        <RivalsTable data={data} search={selectedSearch} cities={selectedCities}/>
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