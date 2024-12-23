import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea, LoadingOverlay} from '@mantine/core';
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

// Default data
const defaultData = {
    "tour_id": "",
    "score": 0,
    "for": "TOUR",
    "tour_date": "1970-01-01T00:00:00Z",
    "body": "Yükleniyor...",
    "guide": {},
    "guides": ["Yükleniyor..."],
    "contact": "Yükleniyor...",
};

interface HighSchoolTourReviewDetailsProps {
    tourID: string;
    highSchoolName: string;
    highSchoolID: string;
    opened: boolean;
    onClose: () => void;
    contact: string;
}

const HighSchoolTourReviewDetails: React.FC<HighSchoolTourReviewDetailsProps> = ({tourID, highSchoolName, highSchoolID, opened, onClose, contact}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(false);
    const [data, setData] = React.useState(defaultData);

    const getData = useCallback(async (high_school_id: string, tour_id: string, contact: string) => {
        setFetchedData(false);

        const url = new URL(TOUR_URL + "internal/analytics/high-schools/tour-" +
            "reviews");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("high_school_id", high_school_id);
        url.searchParams.append("tour_id", tour_id);

        console.log("Sent request for high school tour review details.");

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for high school tour review details.");

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = JSON.parse(resText);

        if(fetched.length === 0) {
            throw new Error("No high school found.");
        }

        fetched.contact = contact;
        fetched.guides = fetched.guide.fullname ? [fetched.guide.fullname] : [];

        setData(fetched);
        setFetchedData(true);
    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        getData(highSchoolID, tourID, contact).catch((reason) => {
            console.error(reason);
        });
    }, [opened]);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Tur Değerlendirmesi: {highSchoolName}
        </Text>
    </Container>

    const TourDetailsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TourDetails tour_date={data["tour_date"]} guides={data["guides"]} contact={data["contact"]} score={data["score"]}/>
        <Space h="xs" />
    </Container>

    const ReviewDetailsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <ReviewDetails body={data["body"]}/>
        <Space h="xs" />
    </Container>

    return <Modal.Root opened={opened} onClose={onClose} size={"100%"}>
        <Modal.Overlay />
        <Modal.Content style={{borderRadius: '20px', boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)'}}>
            {
                fetchedData
                    ?
                    <>
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

                            <hr style={{border: '1px solid rgba(0, 0, 0, 0.5)', borderRadius: '5px'}}/>

                            <ScrollArea.Autosize mah="75vh" mx="auto">
                                <Space h="xl"/>
                                {TourDetailsContainer}
                                <Space h="xl"/>
                                {ReviewDetailsContainer}
                                <Space h="xl"/>
                            </ScrollArea.Autosize>

                        </Modal.Body>
                    </>
                    :
                    <LoadingOverlay
                        visible={!fetchedData} zIndex={10}
                        overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
            }
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolTourReviewDetails;