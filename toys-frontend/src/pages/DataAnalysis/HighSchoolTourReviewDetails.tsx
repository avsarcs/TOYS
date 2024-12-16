import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolTourReviewDetails/BackButton.tsx";
import TourDetails from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolTourReviewDetails/TourDetails.tsx";
import ReviewDetails from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolTourReviewDetails/ReviewDetails.tsx";
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
    "author": "Yükleniyor...",
    "email": "Yükleniyor...",
    "date": "00/00/0000",
    "guides": ["Yükleniyor..."],
    "review": "Yükleniyor...",
    "reviewRating": 0
};

interface HighSchoolTourReviewDetailsProps {
    tourID: string;
    highSchoolName: string;
    highSchoolID: string;
    opened: boolean;
    onClose: () => void;
}

const HighSchoolTourReviewDetails: React.FC<HighSchoolTourReviewDetailsProps> = ({tourID, highSchoolName, highSchoolID, opened, onClose}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [data, setData] = React.useState(defaultData);

    const getData = useCallback(async (high_school_id: string, tour_id: string) => {
        const url = new URL(TOUR_URL + "/internal/analytics/high_schools/students");
        url.searchParams.append("auth", userContext.authToken);
        url.searchParams.append("high_school_id", high_school_id);
        url.searchParams.append("tour_id", tour_id);

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
        getData(highSchoolID, tourID).catch((reason) => {
            console.error(reason);
        });
    }, []);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Tur Değerlendirmesi: {highSchoolName}
        </Text>
    </Container>

    const TourDetailsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TourDetails tourDate={data.date} authorEmail={data["email"]} authorName={data["author"]} guideNames={data["guides"]}/>
        <Space h="xs" />
    </Container>

    const ReviewDetailsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <ReviewDetails review={data["review"]} tourRating={data["reviewRating"]}/>
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
                    {TourDetailsContainer}
                    <Space h="xl"/>
                    {ReviewDetailsContainer}
                    <Space h="xl"/>
                </ScrollArea.Autosize>

            </Modal.Body>
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolTourReviewDetails;