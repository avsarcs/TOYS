import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea, Divider, Stack} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/BackButton.tsx";
import InputSelector from "../../components/DataAnalysis/HighSchoolsList/HighSchoolAdd/InputSelector.tsx";
import AddButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolAdd/AddButton.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {City} from "../../types/enum.ts";

// Default data
const defaultCities: string[] = ["Yükleniyor..."];
const priorities = ["1", "2", "3", "4", "5"];

interface HighSchoolAddProps {
    opened: boolean;
    onClose: () => void;
}

const HighSchoolAdd: React.FC<HighSchoolAddProps> = ({opened, onClose}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [selectedName, setSelectedName] = React.useState<string | null>(null);
    const [selectedCity, setSelectedCity] = React.useState<string | null>(null);
    const [selectedRanking, setSelectedRanking] = React.useState<string | null>(null);
    const [selectedPriority, setSelectedPriority] = React.useState<string | null>(null);
    const [cities, setCities] = React.useState(defaultCities);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    const handleAddButtonClick = useCallback(async () => {
        if (!selectedName || !selectedCity || !selectedRanking || !selectedPriority) {
            notifications.show({
                color: "red",
                title: "Tüm bilgiler verilmedi!",
                message: "Lise ekleyebilmek için lütfen tüm bilgileri doldurun."
            });
            return;
        }

        try {
            const url = new URL(TOUR_URL + "internal/analytics/high-schools/add");
            url.searchParams.append("auth",await userContext.getAuthToken());

            const res = await fetch(url, {
                method: "POST",
                headers: new Headers({"Content-Type": "application/json"}),
                body: JSON.stringify({
                    id: "",
                    name: selectedName,
                    location: selectedCity,
                    ranking: selectedRanking,
                    priority: selectedPriority
                })
            });

            if(res.ok) {
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
        catch (e) {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
            });
        }
    }, [selectedName, selectedCity, selectedRanking, selectedPriority, userContext.getAuthToken]);

    React.useEffect(() => {
        getCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text fw={700} style={{fontSize: 'xx-large', textAlign: 'center'}}>
            Yeni Bir Lise Ekleyin
        </Text>
    </Container>

    const InputSelectorContainer = <div style={{padding: '0 10%'}}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Lise Detaylarını Belirleyin
        </Text>
        <Space h="xs" />
        <InputSelector cities={cities} priorities={priorities} setName={setSelectedName} setSelectedCity={setSelectedCity} setSelectedRanking={setSelectedRanking} setSelectedPriority={setSelectedPriority}/>
        <Space h="xs" />
    </div>

    const AddButtonContainer = <div style={{padding: '0 10%', display: 'flex', justifyContent: 'center'}}>
        <Space h="xs"/>
        <AddButton addHighSchool={handleAddButtonClick}/>
        <Space h="xs"/>
    </div>

    return <Modal.Root opened={opened} onClose={onClose} size={"100%"}>
    <Modal.Overlay />
        <Modal.Content style={{borderRadius: '10px', boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)'}}>
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

                <Divider size="sm" className="border-gray-300"/>

                <ScrollArea.Autosize mah="75vh" mx="auto">
                    <Stack gap="0" bg="white">
                        <Space h="md"/>
                        {InputSelectorContainer}
                        <Space h="md"/>
                        {AddButtonContainer}
                        <Space h="xl"/>
                    </Stack>
                </ScrollArea.Autosize>

            </Modal.Body>
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolAdd;