import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/BackButton.tsx";
import InputSelector from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/InputSelector.tsx";
import EditButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/EditButton.tsx";
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

// Default data
const defaultCities: string[] = ["Yükleniyor..."];
const priorities = ["1", "2", "3", "4", "5"];

interface HighSchoolEditProps {
    opened: boolean;
    highSchoolID: string;
    currentName: string;
    currentCity: City;
    currentPriority: string;
    onClose: () => void;
}

const HighSchoolEdit: React.FC<HighSchoolEditProps> = ({opened, highSchoolID, onClose, currentName, currentCity, currentPriority}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [selectedName, setSelectedName] = React.useState<string | null>(currentName);
    const [selectedCity, setSelectedCity] = React.useState<City | null>(currentCity);
    const [selectedPriority, setSelectedPriority] = React.useState<string | null>(currentPriority);
    const [cities, setCities] = React.useState(defaultCities);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    React.useEffect(() => {
        getCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    React.useEffect(() => {
        if (opened) {
            setSelectedName(currentName);
            setSelectedCity(currentCity);
            setSelectedPriority(currentPriority);
        }
    }, [opened, currentName, currentCity, currentPriority]);

    const handleEditButtonClick = useCallback(async () => {
        if (!selectedName || !selectedCity || !selectedPriority) {
            notifications.show({
                color: "red",
                title: "Tüm bilgiler verilmedi!",
                message: "Liseyi düzenleyebilmek için lütfen tüm bilgileri doldurun."
            });
            return;
        }
        if (selectedName === currentName && selectedCity === currentCity && selectedPriority === currentPriority) {
            notifications.show({
                color: "red",
                title: "Değişiklik yapılmadı!",
                message: "Liseyi düzenleyebilmek için lütfen bir değişiklik yapın."
            });
            return;
        }
        if (!selectedName || !selectedCity || !selectedPriority) {
            notifications.show({
                color: "red",
                title: "Tüm bilgiler verilmedi!",
                message: "Lise ekleyebilmek için lütfen tüm bilgileri doldurun."
            });
            return;
        }

        try {
            const url = new URL(TOUR_URL + "/internal/analytics/high-schools/add");
            url.searchParams.append("high_school_id", highSchoolID);
            url.searchParams.append("auth", userContext.authToken);
            url.searchParams.append("name", selectedName);
            url.searchParams.append("priority", selectedPriority);
            url.searchParams.append("city", selectedCity);

            const res = await fetch(url, {
                method: "POST",
            });

            if(res.ok) {
                const token = await res.text();

                if(token.length > 0) {
                    notifications.show({
                        color: "green",
                        title: "Lise eklendi!",
                        message: "Lise başarıyla eklendi. Sayfa yeniden yükleniyor."
                    });
                    window.location.reload();
                }
                else {
                    notifications.show({
                        color: "red",
                        title: "Hay aksi!",
                        message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
                    });
                }
            }
            else {
                notifications.show({
                    color: "red",
                    title: "Hay aksi!",
                    message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
                });
            }
        }
        catch (e) {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
            });
        }
    }, [highSchoolID, selectedName, selectedCity, selectedPriority, userContext.authToken]);

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