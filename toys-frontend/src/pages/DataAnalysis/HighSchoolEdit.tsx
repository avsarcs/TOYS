import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Modal, Group, ScrollArea, LoadingOverlay, Divider, Stack} from '@mantine/core';
import BackButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/BackButton.tsx";
import InputSelector from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/InputSelector.tsx";
import EditButton from "../../components/DataAnalysis/HighSchoolsList/HighSchoolDetails/HighSchoolEdit/EditButton.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from "@mantine/notifications";
import {City} from "../../types/enum.ts";

// Default data
const defaultCities: string[] = ["Yükleniyor..."];
const priorities = ["1", "2", "3", "4", "5"];

interface HighSchoolEditProps {
    opened: boolean;
    highSchoolID: string;
    currentName: string;
    currentCity: string;
    currentRanking: string;
    currentPriority: string;
    onClose: () => void;
}

const HighSchoolEdit: React.FC<HighSchoolEditProps> = ({opened, highSchoolID, onClose, currentName, currentCity, currentRanking, currentPriority}) => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(true);
    const [selectedName, setSelectedName] = React.useState<string | null>(currentName);
    const [selectedCity, setSelectedCity] = React.useState<string | null>(currentCity);
    const [selectedRanking, setSelectedRanking] = React.useState<string | null>(currentRanking);
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
            setSelectedPriority(currentRanking)
            setSelectedPriority(currentPriority);
        }
    }, [opened, currentName, currentCity, currentRanking, currentPriority]);

    const handleEditButtonClick = useCallback(async () => {
        if (selectedName === currentName && selectedCity === currentCity && selectedRanking === currentRanking && selectedPriority === currentPriority) {
            notifications.show({
                color: "red",
                title: "Değişiklik yapılmadı!",
                message: "Liseyi düzenleyebilmek için lütfen bir değişiklik yapın."
            });
            return;
        }
        if (!selectedName || !selectedCity || !selectedRanking || !selectedPriority) {
            notifications.show({
                color: "red",
                title: "Tüm bilgiler verilmedi!",
                message: "Lise ekleyebilmek için lütfen tüm bilgileri doldurun."
            });
            return;
        }

        try {
            setFetchedData(false);

            const url = new URL(TOUR_URL + "internal/analytics/high-schools/edit");
            url.searchParams.append("auth", await userContext.getAuthToken());

            const res = await fetch(url, {
                method: "POST",
                headers: new Headers({"Content-Type": "application/json"}),
                body: JSON.stringify({
                    id: highSchoolID,
                    name: selectedName,
                    location: selectedCity,
                    ranking: selectedRanking,
                    priority: selectedPriority,
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

        setFetchedData(true);
    }, [highSchoolID, selectedName, selectedCity, selectedRanking, selectedPriority, userContext.getAuthToken]);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text fw={700} style={{fontSize: 'xx-large', textAlign: 'center'}}>
            Liseyi Düzenleyin: {currentName}
        </Text>
    </Container>

    const InputSelectorContainer = <div style={{padding: '0 10%'}}>
        <Space h="xs"/>
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Lise Detaylarını Belirleyin
        </Text>
        <Space h="xs"/>
        <InputSelector cities={cities} priorities={priorities} currentName={currentName} currentCity={currentCity}
                       currentRanking={currentRanking} currentPriority={currentPriority} setName={setSelectedName}
                       setSelectedCity={setSelectedCity} setSelectedRanking={setSelectedRanking}
                       setSelectedPriority={setSelectedPriority}/>
        <Space h="xs"/>
    </div>

    const EditButtonContainer = <div style={{padding: '0 10%', display: 'flex', justifyContent: 'center'}}>
        <Space h="xs"/>
        <EditButton editHighSchool={handleEditButtonClick}/>
        <Space h="xs"/>
    </div>

    return <Modal.Root opened={opened} onClose={onClose} size={"100%"}>
        <Modal.Overlay />
        <Modal.Content style={{borderRadius: '10px', boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.5)'}}>
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

                            <Divider size="sm" className="border-gray-300"/>

                            <ScrollArea.Autosize mah="75vh" mx="auto">
                                <Stack gap="0" bg="white">
                                    <Space h="md"/>
                                    {InputSelectorContainer}
                                    <Space h="md"/>
                                    {EditButtonContainer}
                                    <Space h="xl"/>
                                </Stack>
                            </ScrollArea.Autosize>

                        </Modal.Body>
                    </>
                    :
                    <LoadingOverlay
                        visible={!fetchedData} zIndex={10}
                        overlayProps={{blur: 1, color: "#444", opacity: 0.8}}/>
            }
        </Modal.Content>
    </Modal.Root>

}

export default HighSchoolEdit;