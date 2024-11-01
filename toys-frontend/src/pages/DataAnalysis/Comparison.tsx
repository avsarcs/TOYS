import React from "react";
import {Space, Container, Text} from '@mantine/core';
import Navbar from "../../components/DataAnalysis/Comparison/Navbar.tsx";
import ComparisonSelector from "../../components/DataAnalysis/Comparison/ComparisonSelector.tsx";
import ComparisonTable from "../../components/DataAnalysis/Comparison/ComparisonTable.tsx";
import ComparisonGraph from "../../components/DataAnalysis/Comparison/ComparisonGraph.tsx";

// Container styling
const defaultContainerStyle = {
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)',
    width: '100%', // Ensure the container takes the full width of its parent
    minWidth: '300px', // Set a minimum width to keep it consistent
    maxWidth: '1200px', // Set a maximum width to keep it consistent
    margin: '0 auto' // Center the container
};

//test data
const universities: string[] = ["Koç", "ODTÜ", "İYTE"];
const departments = {"Bilkent": ["CS", "EE", "IE"], "Koç": ["CS", "Psychology", "IE"], "ODTÜ": ["CS", "EE", "IE"], "İYTE": ["CS", "EE", "Architecture"]};
const years: string[] = ["2018", "2019", "2020"];
const data = {
    "2020": [
        { title: "%0 Burs", school1Name: "Bilkent", school1Min: "1600", school1Max: "6000", school2Name: "ODTÜ", school2Min: "-", school2Max: "-" },
        { title: "%50 Burs", school1Name: "Bilkent", school1Min: "400", school1Max: "1600", school2Name: "ODTÜ", school2Min: "-", school2Max: "-" },
        { title: "%100 Burs", school1Name: "Bilkent", school1Min: "1", school1Max: "400", school2Name: "ODTÜ", school2Min: "1", school2Max: "1000" }
    ],
    "2019": [
        { title: "%0 Burs", school1Name: "Bilkent", school1Min: "1600", school1Max: "6000", school2Name: "ODTÜ", school2Min: "-", school2Max: "-" },
        { title: "%50 Burs", school1Name: "Bilkent", school1Min: "400", school1Max: "1600", school2Name: "ODTÜ", school2Min: "-", school2Max: "-" },
        { title: "%100 Burs", school1Name: "Bilkent", school1Min: "1", school1Max: "400", school2Name: "ODTÜ", school2Min: "1", school2Max: "1000" }
    ],
    "2018": [
        { title: "%0 Burs", school1Name: "Bilkent", school1Min: "1600", school1Max: "6000", school2Name: "ODTÜ", school2Min: "-", school2Max: "-" },
        { title: "%50 Burs", school1Name: "Bilkent", school1Min: "40000", school1Max: "1600", school2Name: "ODTÜ", school2Min: "-", school2Max: "-" },
        { title: "%100 Burs", school1Name: "Bilkent", school1Min: "1", school1Max: "400", school2Name: "ODTÜ", school2Min: "1", school2Max: "1000" }
    ]
};

const Comparison: React.FC = () => {
    const [selectedBilkentDepartment, setSelectedBilkentDepartment] = React.useState<string | null>(null);
    const [selectedOtherUniversity, setSelectedOtherUniversity] = React.useState<string | null>(null);
    const [selectedOtherDepartment, setSelectedOtherDepartment] = React.useState<string | null>(null);

    // useEffect hook to watch for changes in the state variables
    React.useEffect(() => {
        requestNewData();
    }, [selectedBilkentDepartment, selectedOtherUniversity, selectedOtherDepartment]);

    // Function to run when any state variable changes
    const requestNewData = () => {
        // Handle data change
    };

    const HeaderTextContainer = <Container style={{display: 'flex', justifyContent: 'center'}}>
        <Text style={{fontSize: 'x-large'}}>
            Üniversite Karşılaştırma Sayfası
        </Text>
    </Container>

    const ComparisonSelectorContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <ComparisonSelector
            universities={universities}
            bilkentDepartments={departments["Bilkent"]}
            otherDepartments={departments}
            setSelectedBilkentDepartment={setSelectedBilkentDepartment}
            setSelectedOtherUniversity={setSelectedOtherUniversity}
            setSelectedOtherDepartment={setSelectedOtherDepartment}
            selectedOtherUniversity={selectedOtherUniversity}
        />
        <Space h="xs" />
    </Container>

    const ComparisonTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <ComparisonTable years={years} data={data}/>
        <Space h="xs" />
    </Container>

    const ComparisonGraphContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <ComparisonGraph data={data}/>
        <Space h="xs" />
    </Container>

    let ShownDataContainer: JSX.Element;

    if(selectedBilkentDepartment && selectedOtherUniversity && selectedOtherDepartment) {
        ShownDataContainer = <Container>
            {ComparisonTableContainer}
            <Space h="md"/>
            {ComparisonGraphContainer}
        </Container>
    }
    else {
        ShownDataContainer = <Container>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>Lütfen tüm alanları seçin.</Text>
        </Container>
    }

    return <div>
        <Navbar activeIndex={2}/>
        <Space h="md"/>
        {HeaderTextContainer}
        <Space h="md"/>
        {ComparisonSelectorContainer}
        <Space h="md"/>
        {ShownDataContainer}
    </div>
}

export default Comparison;