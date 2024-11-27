import React from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolTourReviewDetails/BackButton.tsx";
import TourDetails from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolTourReviewDetails/TourDetails.tsx";
import ReviewDetails from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolTourReviewDetails/ReviewDetails.tsx";

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
    "author": "Can Tücer",
    "email": "can.tucer@ug.bilkent.edu.tr",
    "date": "18/11/2024",
    "guide": "Leslie Knope",
    "review": "Bilkent Üniversitesi'ni ziyaret ettim ve çok beğendim. Öğrenciler çok yardımsever ve ilgiliydi. Kampüs çok büyük ve güzel. Eğitim kalitesi de oldukça yüksek. Kesinlikle tavsiye ederim. Herkesin bu üniversiteyi görmesini öneririm. Harika bir deneyimdi.",
    "reviewRating": 4
};

interface HighSchoolTourReviewDetailsProps {
    tourDate: string
    highSchoolName: string
    opened: boolean;
    onClose: () => void;
}

const HighSchoolTourReviewDetails: React.FC<HighSchoolTourReviewDetailsProps> = ({tourDate, highSchoolName, opened, onClose}) => {

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Tur Değerlendirmesi: {highSchoolName}
        </Text>
    </Container>

    const TourDetailsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TourDetails tourDate={tourDate} authorEmail={data["email"]} authorName={data["author"]} guideName={data["guide"]}/>
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