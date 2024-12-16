import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolStudentDetails/BackButton.tsx";
import DepartmentGraph from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolStudentDetails/DepartmentGraph.tsx";
import StudentTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolStudentDetails/StudentTable.tsx";
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
const defaultData = {
    "CS": {"total_count": 100, "50% scholarship": 75, "100% scholarship": 25},
    "EE": {"total_count": 150, "50% scholarship": 100, "100% scholarship": 50},
    "ME": {"total_count": 120, "50% scholarship": 80, "100% scholarship": 40},
    "CE": {"total_count": 130, "50% scholarship": 90, "100% scholarship": 40},
    "BIO": {"total_count": 110, "50% scholarship": 70, "100% scholarship": 40},
    "CHE": {"total_count": 140, "50% scholarship": 90, "100% scholarship": 50},
    "PHYS": {"total_count": 90, "50% scholarship": 60, "100% scholarship": 30},
    "MATH": {"total_count": 80, "50% scholarship": 50, "100% scholarship": 30},
    "STAT": {"total_count": 70, "50% scholarship": 40, "100% scholarship": 30},
    "ENG": {"total_count": 60, "50% scholarship": 35, "100% scholarship": 25}
};

interface HighSchoolStudentDetailsProps {
    year: number;
    highSchoolName: string;
    highSchoolID: string;
    opened: boolean;
    onClose: () => void;
}

const HighSchoolStudentDetails: React.FC<HighSchoolStudentDetailsProps> = ({year, highSchoolName, highSchoolID, opened, onClose}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [data, setData] = React.useState(defaultData);

    const getData = useCallback(async (high_school_id: string, year: number) => {
        const url = new URL(TOUR_URL + "/internal/analytics/high_schools/students");
        url.searchParams.append("auth", userContext.authToken);
        url.searchParams.append("high_school_id", high_school_id);
        url.searchParams.append("year", year.toString());

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

        setData(JSON.parse(resText));
    }, [userContext.authToken]);

    React.useEffect(() => {
        getData(highSchoolID, year).catch((reason) => {
            console.error(reason);
        });
    }, []);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            {year} Mezun Bilgisi: {highSchoolName}
        </Text>
    </Container>

    const dataForGraph = Object.fromEntries(
        Object.entries(data).map(([department, values]) => [department, values.total_count])
    )

    const DepartmentGraphContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Mezunların Bilkent'deki Bölümleri
        </Text>
        <Space h="xs" />
        <DepartmentGraph data={dataForGraph} style={{ margin: '20px', maxHeight: '400px'}}/>
        <Space h="xs" />
    </Container>

    const dataForTable = Object.entries(data).map(([department, values]) => ({
        department,
        total_count: values.total_count,
        counts: {
            "50% scholarship": values["50% scholarship"],
            "100% scholarship": values["100% scholarship"]
        }
    }));

    const StudentTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Mezunların Bilkent'deki Bursları
        </Text>
        <Space h="xs" />
        <StudentTable data={dataForTable}/>
        <Space h="xs" />
    </Container>

    return <Modal.Root opened={opened} onClose={onClose} size={"100%"}>
        <Modal.Overlay />
        <Modal.Content style={{borderRadius: '20px', boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)'}}>
            <Modal.Body style={{maxHeight: "100vh"}}>
                <Space h="xl"/>
                <Group>
                    <Container style={{flex: '1', display: 'flex', justifyContent: 'center'}}>
                        <BackButton onBack={onClose}/>
                    </Container>
                    <Container style={{flex: '2', display: 'flex', justifyContent: 'center'}}>
                        {HeaderTextContainer}
                    </Container>
                    <Container style={{flex: '1', display: 'flex', justifyContent: 'center'}}>
                        {/* Empty container */}
                    </Container>
                </Group>

                <hr style={{border: '1px solid black'}}/>

                <ScrollArea.Autosize mah="75vh" mx="auto">
                    <Space h="xl"/>
                    {DepartmentGraphContainer}
                    <Space h="xl"/>
                    {StudentTableContainer}
                    <Space h="xl"/>
                </ScrollArea.Autosize>

            </Modal.Body>
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolStudentDetails;