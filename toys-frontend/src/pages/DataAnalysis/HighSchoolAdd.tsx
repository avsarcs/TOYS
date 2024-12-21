import React, {useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/BackButton.tsx";
import InputSelector from "../../components/DataAnalysis/HighSchoolsList/HighSchoolAdd/InputSelector.tsx";
import AddButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolAdd/AddButton.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {City} from "../../types/enum.ts";

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

const priorities = ["1", "2", "3", "4", "5"];

interface HighSchoolAddProps {
    opened: boolean;
    onClose: () => void;
}

const HIGHSCHOOL_ADD_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/analytics/high-schools/add");
const HighSchoolAdd: React.FC<HighSchoolAddProps> = ({opened, onClose}) => {
    const userContext = useContext(UserContext);
    const [selectedName, setSelectedName] = React.useState<string | null>(null);
    const [selectedCity, setSelectedCity] = React.useState<City | null>(null);
    const [selectedPriority, setSelectedPriority] = React.useState<string | null>(null);

    const handleAddButtonClick = async () => {
        if (!selectedName || !selectedCity || !selectedPriority) {
            alert("Lütfen tüm detayları doldurun.");
            return;
        }

        const addUrl = new URL(HIGHSCHOOL_ADD_URL);
        addUrl.searchParams.append("auth", userContext.authToken);

        const addRes = await fetch(addUrl, {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({
                id: "",
                name: selectedName,
                location: selectedCity,
                priority: selectedPriority,
                ranking: -1,
            })
        });

        if(addRes.ok) {
            notifications.show({
                color: "green",
                title: "İşlem başarılı.",
                message: "Lise eklendi."
            });
        }
        else {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Tekrar deneyin veya site yöneticisine durumu haber edin."
            });
        }

        window.location.reload();
    };

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Yeni Bir Lise Ekleyin
        </Text>
    </Container>

    const InputSelectorContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Lise Detaylarını Belirleyin
        </Text>
        <Space h="xs" />
        <InputSelector priorities={priorities} setName={setSelectedName} setSelectedCity={setSelectedCity} setSelectedPriority={setSelectedPriority}/>
        <Space h="xs" />
    </Container>

    const AddButtonContainer = <Container style={{display: 'flex', justifyContent: 'center'}}>
        <Space h="xs" />
        <AddButton addHighSchool={handleAddButtonClick}/>
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
                    {InputSelectorContainer}
                    <Space h="xl"/>
                    {AddButtonContainer}
                    <Space h="xl"/>
                </ScrollArea.Autosize>

            </Modal.Body>
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolAdd;