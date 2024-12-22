import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import DetailsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/DetailsTable.tsx";
import ToursTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/ToursTable.tsx";
import StudentsTable from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/StudentsTable.tsx";
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/BackButton.tsx";
import EditButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/EditButton.tsx";
import HighSchoolEdit from "./HighSchoolEdit.tsx";
import HighSchoolStudentDetails from "./HighSchoolStudentDetails.tsx";
import HighSchoolTourReviewDetails from "./HighSchoolTourReviewDetails.tsx";
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

// Default data
const defaultData = {
    "priority": 1, "ranking": 1, "city": "Yükleniyor...",
    "tours": [
        {
            "date": "1970-01-01T00:00:00Z",
            "attendance": 1,
            "type": "Yükleniyor...",
            "reviewRating": null,
            "reviewID": "",
            "contact": "Yükleniyor..."
        }
    ],
    "students": [
        {"year": 0, "count": 1}
    ]
}

interface HighSchoolDetailsProps {
    opened: boolean;
    onClose: () => void;
    highSchoolName: string;
    highSchoolID: string;
}

const HighSchoolDetails: React.FC<HighSchoolDetailsProps> = ({opened, onClose, highSchoolName, highSchoolID}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [editModalOpened, setEditModalOpened] = React.useState(false);
    const [studentDetailsModalOpened, setStudentDetailsModalOpened] = React.useState(false);
    const [studentDetailsModalYear, setStudentDetailsModalYear] = React.useState(0);
    const [tourReviewDetailsModalOpened, setTourReviewDetailsModalOpened] = React.useState(false);
    const [tourReviewDetailsModalID, setTourReviewDetailsModalID] = React.useState("");
    const [data, setData] = React.useState(defaultData);

    const getData = useCallback(async (high_school_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/high-schools/details");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("high_school_id", high_school_id);

        console.log("Sent request for high school details.");

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for high school details.");

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();

        if(resText.length === 0) {
            throw new Error("No high school found.");
        }

        setData(JSON.parse(resText));
    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        getData(highSchoolID).catch((reason) => {
            console.error(reason);
        });
    }, []);

    function editHighSchool() {
        setEditModalOpened(true);
    }

    function showStudentDetails(year: number) {
        setStudentDetailsModalOpened(true);
        setStudentDetailsModalYear(year);
    }

    function showTourReviewDetails(ID: string) {
        setTourReviewDetailsModalOpened(true);
        setTourReviewDetailsModalID(ID);
    }

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            {highSchoolName}
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

                <hr style={{border: '1px solid rgba(0, 0, 0, 0.5)', borderRadius: '5px'}}/>

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
        {editModalOpened && (
            <HighSchoolEdit
                opened={editModalOpened}
                highSchoolID={highSchoolID}
                onClose={() => setEditModalOpened(false)}
                currentName={highSchoolName}
                currentCity={data.city}
                currentRanking={data.ranking.toString()}
                currentPriority={data.priority.toString()}
            />
        )}
        {studentDetailsModalOpened && (
            <HighSchoolStudentDetails
                opened={studentDetailsModalOpened}
                onClose={() => setStudentDetailsModalOpened(false)}
                year={studentDetailsModalYear}
                highSchoolName={highSchoolName}
                highSchoolID={highSchoolID}
            />
        )}
        {tourReviewDetailsModalOpened && (
            <HighSchoolTourReviewDetails
                opened={tourReviewDetailsModalOpened}
                onClose={() => setTourReviewDetailsModalOpened(false)}
                tourID={tourReviewDetailsModalID}
                highSchoolName={highSchoolName}
                highSchoolID={highSchoolID}
            />
        )}
    </Modal.Root>

}

export default HighSchoolDetails;