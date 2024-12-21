import React, {useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/BackButton.tsx";
import InputSelector from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/InputSelector.tsx";
import EditButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/EditButton.tsx";
import {notifications} from "@mantine/notifications";
import {UserContext} from "../../context/UserContext.tsx";
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

interface HighSchoolEditProps {
    opened: boolean;
    currentName: string;
    currentCity: City;
    currentPriority: string;
    onClose: () => void;
}

const HIGHSCHOOL_EDIT_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/analytics/high-schools/edit");
const HighSchoolEdit: React.FC<HighSchoolEditProps> = ({opened, onClose, currentName, currentCity, currentPriority}) => {
    const userContext = useContext(UserContext);
    const [selectedName, setSelectedName] = React.useState<string | null>(currentName);
    const [selectedCity, setSelectedCity] = React.useState<City | null>(currentCity);
    const [selectedPriority, setSelectedPriority] = React.useState<string | null>(currentPriority);

    React.useEffect(() => {
        if (opened) {
            setSelectedName(currentName);
            setSelectedCity(currentCity);
            setSelectedPriority(currentPriority);
        }
    }, [opened, currentName, currentCity, currentPriority]);

    const handleEditButtonClick = async () => {
        console.log(selectedName)
        console.log(selectedCity)
        console.log(selectedPriority)
        if (!selectedName || !selectedCity || !selectedPriority) {
            alert("Lütfen tüm detayları doldurun.");
            return;
        }
        if (selectedName === currentName && selectedCity === currentCity && selectedPriority === currentPriority) {
            alert("Lütfen düzenlemek için bir değişiklik yapın.");
            return;
        }

        const editUrl = new URL(HIGHSCHOOL_EDIT_URL);
        editUrl.searchParams.append("auth", userContext.authToken);

        const editRes = await fetch(editUrl, {
            method: "POST",
            headers: new Headers({"Content-Type": "application/json"}),
            body: JSON.stringify({
                id: "",
                name: selectedName,
                location: selectedCity,
                priority: currentPriority,
                ranking: -1,
            })
        });

        if(editRes.ok) {
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

        //window.location.reload();
    };

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Liseyi Düzenleyin: {currentName}
        </Text>
    </Container>

    const InputSelectorContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Lise Detaylarını Belirleyin
        </Text>
        <Space h="xs" />
        <InputSelector priorities={priorities} currentName={currentName} currentCity={currentCity} currentPriority={currentPriority} setName={setSelectedName} setSelectedCity={setSelectedCity} setSelectedPriority={setSelectedPriority}/>
        <Space h="xs" />
    </Container>

    const EditButtonContainer = <Container style={{display: 'flex', justifyContent: 'center'}}>
        <Space h="xs" />
        <EditButton editHighSchool={handleEditButtonClick}/>
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
                    {EditButtonContainer}
                    <Space h="xl"/>
                </ScrollArea.Autosize>

            </Modal.Body>
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolEdit;