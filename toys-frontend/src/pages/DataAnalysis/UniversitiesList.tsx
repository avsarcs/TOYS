import React, {useCallback, useContext} from "react";
import {Space, Container, Text} from '@mantine/core';
import UniversitiesTable from "../../components/DataAnalysis/UniversitiesList/UniversitiesTable.tsx";
import TableFilter from "../../components/DataAnalysis/UniversitiesList/TableFilter.tsx";
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
const defaultHeaderStyle = {
    backgroundColor: 'white',
    boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.5)',
    width: '100%', // Ensure the container takes the full width of its parent
    padding: '10px',
    display: 'flex',
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
};

//test data
const defaultCities = ["Yükleniyor..."];
const defaultUniversities = [
    {
        name: "Yükleniyor...",
        city: "Yükleniyor...",
        isRival: "true",
        id: ""
    }
];

const UniversitiesList: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [selectedSearch, setSearch] = React.useState<string>('');
    const [selectedCities, setSelectedCities] = React.useState<string[]>([]);
    const [cities, setCities] = React.useState<string[]>(defaultCities);
    const [universities, setUniversities] = React.useState<{name: string; city: string; isRival: string; id: string}[]>(defaultUniversities);

    const getCities = useCallback(async () => {
        const cityNames = Object.values(City);
        setCities(cityNames);
    }, []);

    const getUniversities = useCallback(async () => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/all");
        url.searchParams.append("auth", await userContext.getAuthToken());

        console.log("Sent request for universities list.");

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for universities list.");

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        if (res.status === 401) {
            notifications.show({
                color: "red",
                title: "Tekrar giriş yapmanız gerekiyor.",
                message: "Oturumun süresi dolmuş."
            });
        }

        const resText = await res.text();

        console.log(resText);

        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("No university found.");
        }

        setUniversities(fetched);
    }, [userContext.getAuthToken]);

    const updateRival = useCallback(async (isRival: boolean, universityID: string) => {
        try {
            const url = new URL(TOUR_URL + "internal/analytics/universities/set-rivalry");
            url.searchParams.append("auth", await userContext.getAuthToken());
            url.searchParams.append("university_id", universityID);
            url.searchParams.append("value_to_set", isRival ? "true" : "false");

            const res = await fetch(url, {
                method: "POST",
            });

            if(res.ok) {
                notifications.show({
                    color: "green",
                    title: "Rakiplik güncellendi!",
                    message: "Üniversite " + (isRival ? "rakip" : "rakip değil") + " olarak işaretlendi."
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
    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        getCities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    React.useEffect(() => {
        getUniversities().catch((reason) => {
            console.error(reason);
        });
    }, []);

    const HeaderTextContainer = <div style={defaultHeaderStyle}>
        <Text style={{fontSize: 'xx-large'}}>
            Üniversiteler Listesi
        </Text>
    </div>

    const TableFilterContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <TableFilter cities={cities} setSearch={setSearch} setSelectedCities={setSelectedCities}/>
        <Space h="xs" />
    </Container>

    const UniversitiesTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <UniversitiesTable data={universities} search={selectedSearch} cities={selectedCities} changeIsRival={updateRival}/>
        <Space h="xs" />
    </Container>


    return <div style={{width: "100%", minHeight: '100vh' }} className={"w-full h-full"}>
        {HeaderTextContainer}
        <Space h="xl"/>
        {TableFilterContainer}
        <Space h="xl"/>
        <Space h="xl"/>
        {UniversitiesTableContainer}
        <Space h="xl"/>
        <Space h="xl"/>
    </div>
}

export default UniversitiesList;