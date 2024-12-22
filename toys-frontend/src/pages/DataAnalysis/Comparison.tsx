import React, {useCallback, useContext} from "react";
import {Container, Space, Text} from '@mantine/core';
import ComparisonSelector from "../../components/DataAnalysis/Comparison/ComparisonSelector.tsx";
import ComparisonTable from "../../components/DataAnalysis/Comparison/ComparisonTable.tsx";
import ComparisonGraph from "../../components/DataAnalysis/Comparison/ComparisonGraph.tsx";
import {useLocation} from 'react-router-dom';
import {UserContext} from "../../context/UserContext.tsx";
import {notifications} from '@mantine/notifications';

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
const defaultUniversities: {name: string, id: string}[] = [
    { name: "Yükleniyor...", id: "1" },
];
const defaultBilkentDepartments = ["Yükleniyor..."];
const defaultOtherDepartments = ["Yükleniyor..."];
const defaultYears: string[] = ["Yükleniyor..."];
const defaultBilkentData = {
    "Yükleniyor...": [
        {title: "Yükleniyor...", min: "0", max: "1"},
        {title: "Yükleniyor....", min: "2", max: "3"},
    ],
}
const defaultOtherData = {
    "Yükleniyor...": [
        {title: "Yükleniyor...", min: "4", max: "5"},
        {title: "Yükleniyor....", min: "6", max: "7"},
    ]
}

const Comparison: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const otherUniversityID = params.get('otherUniversity');

    const [universities, setUniversities] = React.useState<{ name: string, id: string }[]>(defaultUniversities);
    const otherUniversity = universities.find(u => u.id === otherUniversityID) || null;

    const [bilkentDepartments, setBilkentDepartments] = React.useState<string[]>(defaultBilkentDepartments);
    const [otherDepartments, setOtherDepartments] = React.useState<string[]>(defaultOtherDepartments);
    const [years, setYears] = React.useState<string[]>(defaultYears);
    const [bilkentData, setBilkentData] = React.useState<{ [key: string]: { title: string, min: string, max: string }[] }>(defaultBilkentData);
    const [otherData, setOtherData] = React.useState<{ [key: string]: { title: string, min: string, max: string }[] }>(defaultOtherData);
    const [data, setData] = React.useState<{ [key: string]: { title: string, school1Name: string, school1Min: string, school1Max: string, school2Name: string, school2Min: string, school2Max: string }[] }>({});
    const [selectedBilkentDepartment, setSelectedBilkentDepartment] = React.useState<string | null>(null);
    const [selectedOtherUniversity, setSelectedOtherUniversity] = React.useState<{ name: string, id: string } | null>(otherUniversity);
    const [selectedOtherDepartment, setSelectedOtherDepartment] = React.useState<string | null>(null);
    const [shownWarning, setShownWarning] = React.useState(false);

    React.useEffect(() => {
        if(otherUniversityID != null && otherUniversity == null && !shownWarning) {
            notifications.show({
                color: "red",
                title: "Üniversite bulunamadı.",
                message: "Belirtilen üniversite bulunamadı. Lütfen tekrar seçim yapın.",
            });
            setShownWarning(true);
        }
    }, [otherUniversityID, otherUniversity]);

    const getUniversities = useCallback(async () => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/all-simple");
        url.searchParams.append("auth", await userContext.getAuthToken());

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("No university found.");
        }

        const uniqueFetched = fetched.filter((item: { id: string }, pos: number) => {
            return fetched.indexOf(item) == pos && item.id !== "bilkent";
        });

        setUniversities(uniqueFetched);
    }, [userContext.getAuthToken]);

    const getBilkentDepartments = useCallback(async () => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/departments");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", "bilkent");

        console.log("Sent request for Bilkent's departments.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for Bilkent's departments.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        const uniqueFetched = fetched.filter(function(item: string, pos: number) {
            return fetched.indexOf(item) == pos;
        })

        setBilkentDepartments(uniqueFetched);
    }, [userContext.getAuthToken]);

    const getOtherUniversityDepartments = useCallback(async (university_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/departments");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", university_id);

        console.log("Sent request for other's departments.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for other's departments.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        const uniqueFetched = fetched.filter(function(item: string, pos: number) {
            return fetched.indexOf(item) == pos;
        })

        setOtherDepartments(uniqueFetched);
    }, [userContext.getAuthToken]);

    const getBilkentData = useCallback(async (department_name: string, university_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/details");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", university_id);
        url.searchParams.append("department_name", department_name);

        console.log("Sent request for Bilkent's data.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for Bilkent's data.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        setBilkentData(fetched);
    }, [userContext.getAuthToken]);

    const getOtherData = useCallback(async (department_name: string, university_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/details");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", university_id);
        url.searchParams.append("department_name", department_name);

        console.log("Sent request for other's data.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for other's data.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = JSON.parse(resText)

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        setOtherData(fetched);
    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        if(otherUniversityID != null && otherUniversity == null && !shownWarning) {
            notifications.show({
                color: "red",
                title: "Üniversite bulunamadı.",
                message: "Belirtilen üniversite bulunamadı. Lütfen tekrar seçim yapın.",
            });
            setShownWarning(true);
        }
    }, [otherUniversityID, otherUniversity]);

    const getUniversities = useCallback(async () => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/all-simple");
        url.searchParams.append("auth", await userContext.getAuthToken());

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("No university found.");
        }

        const uniqueFetched = fetched.filter((item: { id: string }, pos: number) => {
            return fetched.indexOf(item) == pos && item.id !== "bilkent";
        });

        setUniversities(uniqueFetched);
    }, [userContext.getAuthToken]);

    const getBilkentDepartments = useCallback(async () => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/departments");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", "bilkent");

        console.log("Sent request for Bilkent's departments.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for Bilkent's departments.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        const uniqueFetched = fetched.filter(function(item: string, pos: number) {
            return fetched.indexOf(item) == pos;
        })

        setBilkentDepartments(uniqueFetched);
    }, [userContext.getAuthToken]);

    const getOtherUniversityDepartments = useCallback(async (university_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/departments");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", university_id);

        console.log("Sent request for other's departments.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for other's departments.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        const uniqueFetched = fetched.filter(function(item: string, pos: number) {
            return fetched.indexOf(item) == pos;
        })

        setOtherDepartments(uniqueFetched);
    }, [userContext.getAuthToken]);

    const getBilkentData = useCallback(async (department_name: string, university_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/details");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", university_id);
        url.searchParams.append("department_name", department_name);

        console.log("Sent request for Bilkent's data.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for Bilkent's data.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = (JSON.parse(resText));

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        setBilkentData(fetched);
    }, [userContext.getAuthToken]);

    const getOtherData = useCallback(async (department_name: string, university_id: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/universities/details");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("university_id", university_id);
        url.searchParams.append("department_name", department_name);

        console.log("Sent request for other's data.")

        const res = await fetch(url, {
            method: "GET",
        });

        console.log("Received response for other's data.")

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        const fetched = JSON.parse(resText)

        if(fetched.length === 0) {
            throw new Error("University not found.");
        }

        setOtherData(fetched);
    }, [userContext.getAuthToken]);

    // useEffect hook to watch for changes in the state variables
    React.useEffect(() => {
        getUniversities().catch((reason) => {
            console.error(reason);
        });
    }, []);
    React.useEffect(() => {
        getBilkentDepartments().catch((reason) => {
            console.error(reason);
        });
    }, []);
    React.useEffect(() => {
        if (selectedOtherUniversity) {
            setSelectedOtherDepartment(null)
            getOtherUniversityDepartments(selectedOtherUniversity.id).catch((reason) => {
                console.error(reason);
            });
        }
    }, [selectedOtherUniversity]);
    React.useEffect(() => {
        if (selectedBilkentDepartment) {
            getBilkentData(selectedBilkentDepartment, "bilkent").catch((reason) => {
                console.error(reason);
            });
        }
    }, [selectedBilkentDepartment]);
    React.useEffect(() => {
        if (selectedOtherDepartment && selectedOtherUniversity) {
            getOtherData(selectedOtherDepartment, selectedOtherUniversity.id).catch((reason) => {
                console.error(reason);
            });
        }

    }, [selectedOtherUniversity, selectedOtherDepartment]);
    React.useEffect(() => {
        console.log("Updating data.")
        const commonYears = Object.keys(bilkentData).filter(year => Object.keys(otherData).includes(year));
        setYears(commonYears);

        const combinedData: { [key: string]: { title: string, school1Name: string, school1Min: string, school1Max: string, school2Name: string, school2Min: string, school2Max: string }[] } = {};
        const school1Name = "Bilkent";
        const school2Name = selectedOtherUniversity ? selectedOtherUniversity["name"] : "-";
        const titles = [...new Set([...Object.values(bilkentData).flat().map(item => item.title), ...Object.values(otherData).flat().map(item => item.title)])];

        commonYears.forEach(year => {
            combinedData[year] = [];

            titles.forEach(title => {
                const school1Min = bilkentData[year].find(item => item.title === title)?.min || "-";
                const school1Max = bilkentData[year].find(item => item.title === title)?.max || "-";
                const school2Min = otherData[year].find(item => item.title === title)?.min || "-";
                const school2Max = otherData[year].find(item => item.title === title)?.max || "-";

                combinedData[year].push({
                    title: title === "N/A" ? "Ücretsiz" : title,
                    school1Name,
                    school1Min: school1Min.replace(/[.,]/g, ""),
                    school1Max: school1Max.replace(/[.,]/g, ""),
                    school2Name,
                    school2Min: school2Min.replace(/[.,]/g, ""),
                    school2Max: school2Max.replace(/[.,]/g, "")
                });
            });

            combinedData[year].sort((a, b) => {
                const aPercentage = parseInt(a.title.replace(/\D/g, ''));
                const bPercentage = parseInt(b.title.replace(/\D/g, ''));
                return aPercentage - bPercentage;
            });
        });

        setData(combinedData);
    }, [bilkentData, otherData]);

    const HeaderTextContainer = <div style={defaultHeaderStyle}>
        <Text style={{fontSize: 'xx-large'}}>
            Üniversite Karşılaştırma Sistemi
        </Text>
    </div>

    const ComparisonSelectorContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <ComparisonSelector
            universities={universities}
            bilkentDepartments={bilkentDepartments}
            otherDepartments={otherDepartments}
            setSelectedBilkentDepartment={setSelectedBilkentDepartment}
            setSelectedOtherUniversity={setSelectedOtherUniversity}
            setSelectedOtherDepartment={setSelectedOtherDepartment}
            selectedOtherUniversity={selectedOtherUniversity}
            selectedBilkentDepartment={selectedBilkentDepartment}
            selectedOtherDepartment={selectedOtherDepartment}
        />
        <Space h="xs" />
    </Container>

    const ComparisonTableContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Yıl Bazlı YKS Sıralamaları
        </Text>
        <Space h="xs" />
        <ComparisonTable years={years} data={data}/>
        <Space h="xs" />
    </Container>

    const ComparisonGraphContainer = <Container style={defaultContainerStyle} >
        <Space h="xs" />
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            YKS Tavan Sıralama Yıllık Karşılaştırma
        </Text>
        <Space h="xs" />
        <ComparisonGraph data={data} style={{ margin: '20px' }}/>
        <Space h="xs" />
    </Container>

    let ShownDataContainer: JSX.Element;

    if(selectedBilkentDepartment && selectedOtherUniversity && selectedOtherDepartment && Object.keys(data).length > 0) {
        ShownDataContainer = <div>
            {ComparisonTableContainer}
            <Space h="xl"/>
            {ComparisonGraphContainer}
        </div>
    }
    else if (selectedBilkentDepartment && selectedOtherUniversity && selectedOtherDepartment) {
        ShownDataContainer = <div>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>Lütfen bekleyin.</Text>
        </div>
    }
    else {
        ShownDataContainer = <div>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>Lütfen tüm alanları seçin.</Text>
        </div>
    }

    return <div style={{width: "100%", minHeight: '100vh'}} className={"w-full h-full"}>
        {HeaderTextContainer}
        <Space h="xl"/>
        {ComparisonSelectorContainer}
        <Space h="xl"/>
        <Space h="xl"/>
        {ShownDataContainer}
        <Space h="xl"/>
        <Space h="xl"/>
    </div>
}

export default Comparison;