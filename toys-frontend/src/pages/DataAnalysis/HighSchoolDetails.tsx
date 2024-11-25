import React from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import DetailsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/DetailsTable.tsx";
import ToursTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/ToursTable.tsx";
import StudentsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/StudentsTable.tsx";
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/BackButton.tsx";
import EditButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/EditButton.tsx";
import HighSchoolEdit from "./HighSchoolEdit.tsx";
import HighSchoolStudentDetails from "./HighSchoolStudentDetails.tsx";
import HighSchoolTourReviewDetails from "./HighSchoolTourReviewDetails.tsx";

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
const data = {
    "priority": 1, "ranking": 1, "city": "Ankara",
    "tours": [
        {
            "date": "18/11/2024",
            "attendance": 50,
            "type": "Tur",
            "reviewRating": 4,
            "reviewID": "12345",
            "contact": "can.tucer@ug.bilkent.edu.tr"
        },
        {
            "date": "25/11/2024",
            "attendance": 60,
            "type": "Tur",
            "reviewRating": null,
            "reviewID": "12346",
            "contact": "john.doe@example.com"
        },
        {
            "date": "02/12/2024",
            "attendance": 45,
            "type": "Tur",
            "reviewRating": 3,
            "reviewID": "12347",
            "contact": "jane.doe@example.com"
        }
    ],
    "students": [
        {"year": 2018, "count": 100,},
        {"year": 2019, "count": 120,},
        {"year": 2020, "count": 150,},
        {"year": 2021, "count": 130,},
        {"year": 2022, "count": 140,},
        {"year": 2023, "count": 160,},
        {"year": 2024, "count": 170,},
        {"year": 2025, "count": 180,},
        {"year": 2026, "count": 190,},
        {"year": 2027, "count": 200,},
        {"year": 2028, "count": 210,},
        {"year": 2029, "count": 220,},
        {"year": 2030, "count": 230,},
        {"year": 2031, "count": 240,},
        {"year": 2032, "count": 250,},
    ]
}

interface HighSchoolDetailsProps {
    opened: boolean;
    onClose: () => void;
    highSchool: any;
}

const HighSchoolDetails: React.FC<HighSchoolDetailsProps> = ({opened, onClose, highSchool}) => {
    const [editModalOpened, setEditModalOpened] = React.useState(false);
    const [studentDetailsModalOpened, setStudentDetailsModalOpened] = React.useState(false);
    const [studentDetailsModalYear, setStudentDetailsModalYear] = React.useState(0);
    const [tourReviewDetailsModalOpened, setTourReviewDetailsModalOpened] = React.useState(false);
    const [tourReviewDetailsModalDate, setTourReviewDetailsModalDate] = React.useState("");

    function editHighSchool() {
        setEditModalOpened(true);
    }

    function showStudentDetails(year: number) {
        setStudentDetailsModalOpened(true);
        setStudentDetailsModalYear(year);
    }

    function showTourReviewDetails(date: string) {
        setTourReviewDetailsModalOpened(true);
        setTourReviewDetailsModalDate(date);
    }

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            {highSchool}
        </Text>
    </Container>

    const DetailsTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <DetailsTable priority={data.priority} ranking={data.ranking} city={data.city}/>
        <Space h="xs" />
    </Container>

    const ToursTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Bu Okul İçin Düzenlenmiş Turlar
        </Text>
        <Space h="xs" />
        <ToursTable data={data["tours"]} openDetails={showTourReviewDetails}/>
        <Space h="xs" />
    </Container>

    const StudentsTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Bilkent'e Gelen Mezunlar
        </Text>
        <Space h="xs" />
        <StudentsTable data={data["students"]} openDetails={showStudentDetails}/>
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
                            <EditButton onEdit={editHighSchool}/>
                        </Container>
                    </Group>

                    <hr style={{border: '1px solid black'}}/>

                    <ScrollArea.Autosize mah="75vh" mx="auto">
                        <Space h="xl"/>
                        {DetailsTableContainer}
                        <Space h="xl"/>
                        {ToursTableContainer}
                        <Space h="xl"/>
                        {StudentsTableContainer}
                        <Space h="xl"/>
                    </ScrollArea.Autosize>

            </Modal.Body>
        </Modal.Content>
        {
            <HighSchoolEdit
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                currentName={highSchool}
                currentCity={data.city}
                currentPriority={data.priority.toString()}
            />
        }
        {
            <HighSchoolStudentDetails
                opened={studentDetailsModalOpened}
                onClose={() => setStudentDetailsModalOpened(false)}
                year={studentDetailsModalYear}
                name={highSchool}
            />
        }
        {
            <HighSchoolTourReviewDetails
                opened={tourReviewDetailsModalOpened}
                onClose={() => setTourReviewDetailsModalOpened(false)}
                tourDate={tourReviewDetailsModalDate}
                highSchoolName={highSchool}
            />
        }
    </Modal.Root>

}

export default HighSchoolDetails;