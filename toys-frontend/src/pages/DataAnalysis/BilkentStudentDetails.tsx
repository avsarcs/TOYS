import React, {useCallback, useContext} from "react";
import {Space, Text, Group, Stack, Box, Title, Divider, LoadingOverlay} from '@mantine/core';
import HighSchoolsGraph from "../../components/DataAnalysis/BilkentStudentDetails/HighSchoolsGraph.tsx";
import CitiesGraph from "../../components/DataAnalysis/BilkentStudentDetails/CitiesGraph.tsx";
import TopStudentsGraph from "../../components/DataAnalysis/BilkentStudentDetails/TopStudentsGraph.tsx";
import DepartmentSelector from "../../components/DataAnalysis/BilkentStudentDetails/DepartmentSelector.tsx";
import YearSelector from "../../components/DataAnalysis/BilkentStudentDetails/YearSelector.tsx";
import SearchBar from "../../components/DataAnalysis/BilkentStudentDetails/SearchBar.tsx";
import HighSchoolsTable from "../../components/DataAnalysis/BilkentStudentDetails/HighSchoolsTable.tsx";
import DepartmentRankingGraph from "../../components/DataAnalysis/BilkentStudentDetails/DepartmentRankingGraph.tsx";
import {UserContext} from "../../context/UserContext.tsx";

// Default data
const defaultHighSchools = {"Yükleniyor...": 1};
const defaultCities = {"Yükleniyor...": 1};
const defaultRankings = {"Yükleniyor...": 1};
const defaultDepartments = ["Yükleniyor..."];
const defaultYears = ["Yükleniyor..."];
const defaultDepartmentData = {"Yükleniyor...": {"Yükleniyor...": 1}}
const defaultScholarshipData = {"Yükleniyor...": {"Yükleniyor...": 1}};

const BilkentStudentDetails: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

    const [fetchedData, setFetchedData] = React.useState(false);
    const [selectedDepartment, setSelectedDepartment] = React.useState<string | null>(null);
    const [selectedSearch, setSelectedSearch] = React.useState<string>('');
    const [cities, setCities] = React.useState<Record<string, number>>(defaultCities);
    const [highSchools, setHighSchools] = React.useState<Record<string, number>>(defaultHighSchools);
    const [rankings, setRankings] = React.useState<Record<string, number>>(defaultRankings);
    const [departments, setDepartments] = React.useState<string[]>(defaultDepartments);
    const [years, setYears] = React.useState<string[]>(defaultYears);
    const [departmentData, setDepartmentData] = React.useState<Record<string, Record<string, number>>>(defaultDepartmentData);
    const [scholarshipData, setScholarshipData] = React.useState<Record<string, Record<string, number>>>(defaultScholarshipData);
    const [selectedYear, setSelectedYear] = React.useState<string | null>(years[years.length-1]);

    const getHighSchoolsAndCitiesAndRankingsAndDepartments = useCallback(async () => {
        setFetchedData(false);

        const url = new URL(TOUR_URL + "internal/analytics/students/all");
        url.searchParams.append("auth", await userContext.getAuthToken());

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No data found.");
        }

        const response = JSON.parse(resText);
        setHighSchools(response["high_schools"]);

        const fetchedCities = response["cities"];
        delete fetchedCities["Toplam"]

        setCities(fetchedCities);

        setRankings(response["rankings"]);

        const fetchedDepartments = response["departments"];
        const uniqueDepartments = fetchedDepartments.filter(function(item: string, pos: number) {
            return fetchedDepartments.indexOf(item) == pos;
        })
        setDepartments(uniqueDepartments);
        setFetchedData(true);
    }, [userContext.getAuthToken]);

    const getYearsAndScholarshipData = useCallback(async (department: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/students/departments");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("department", department);

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No data found.");
        }

        const response = JSON.parse(resText);
        setYears(response["years"]);
        setScholarshipData(Object.fromEntries(Object.entries(response["rankings"]).map(([year, scholarships]) => {
            const sortedScholarships = Object.fromEntries(Object.entries(scholarships as Record<string, number>).sort(([a], [b]) => {
                const order: Record<string, number> = {"%0 Burs": 0, "%50 Burs": 1, "%100 Burs": 2};
                return order[a] - order[b];
            }));
            return [year, sortedScholarships];
        })));
    }, [userContext.getAuthToken]);

    const getDepartmentData = useCallback(async (department: string, year: string) => {
        const url = new URL(TOUR_URL + "internal/analytics/students/department_high_schools");
        url.searchParams.append("auth", await userContext.getAuthToken());
        url.searchParams.append("department", department);
        url.searchParams.append("year", year);

        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error("Response not OK.");
        }

        const resText = await res.text();
        if(resText.length === 0) {
            throw new Error("No data found.");
        }

        setDepartmentData((JSON.parse(resText))["students"]);
    }, [userContext.getAuthToken]);

    React.useEffect(() => {
        getHighSchoolsAndCitiesAndRankingsAndDepartments().catch((reason) => {
            console.error(reason);
        });
    }, []);

    React.useEffect(() => {
        if(selectedDepartment)
            getYearsAndScholarshipData(selectedDepartment).catch((reason) => {
                console.error(reason);
            });
        setSelectedYear(null);
    }, [selectedDepartment]);

    // useEffect hook to watch for changes in the state variables
    React.useEffect(() => {
        if(selectedDepartment && selectedYear != null && selectedYear !== "Yükleniyor...")
            getDepartmentData(selectedDepartment, selectedYear).catch((reason) => {
                console.error(reason);
            });
    }, [selectedDepartment, selectedYear]);

    const GraphsContainer = <div style={{ padding: '0 20%' }}>
        <Space h="xs" />
        <Stack>
            <Group>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text fw={700} style={{ fontSize: 'x-large', display: 'flex', justifyContent: 'center' }}>
                        Öğrencilerin Liseleri (Son 5 Yıl)
                    </Text>
                    <Space h="xs" />
                    <HighSchoolsGraph data={highSchools} style={{ margin: '20px', maxHeight: '400px' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text fw={700} style={{ fontSize: 'x-large', display: 'flex', justifyContent: 'center' }}>
                        Öğrencilerin Şehirleri (Son 5 Yıl)
                    </Text>
                    <Space h="xs" />
                    <CitiesGraph data={cities} style={{ margin: '20px', maxHeight: '400px'}}/>
                </div>
            </Group>
            <Space h="xl"/>
            <div>
                <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    İlk 10 Liseden Gelen Öğrenciler (Son 5 Yıl)
                </Text>
                <Space h="xs" />
                <TopStudentsGraph data={rankings} style={{ margin: '20px', maxHeight: '400px'}}/>
            </div>
        </Stack>
        <Space h="xs" />
    </div>

    const dataForTable = (data: Record<string, Record<string, number>>)=> {
        const uniqueScholarships = new Set<string>();
        Object.values(data).forEach(scholarships => {
            Object.keys(scholarships).forEach(scholarship => uniqueScholarships.add(scholarship));
        });

        return Object.entries(data).map(([highSchool, scholarships]) => {
            const completeScholarships = Array.from(uniqueScholarships).reduce((acc, scholarship) => {
                acc[scholarship] = scholarships[scholarship] || 0;
                return acc;
            }, {} as Record<string, number>);
            return {
            highSchool,
                ...completeScholarships
            };
        });
    };

    let ShownDataContainer: JSX.Element;

    if(selectedDepartment) {
        ShownDataContainer = <Stack>
            <div>
                <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    {selectedDepartment} İçin YKS Tavan Sıralama
                </Text>
                <Space h="xs"/>
                <DepartmentRankingGraph data={scholarshipData} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Space h="xs"/>
            <div>
                <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    {selectedDepartment} Öğrencilerinin Liseleri
                </Text>
                <Space h="xs"/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '75px', marginRight: '75px' }}>
                    <div style={{ flex: 0.75, marginRight: '10px' }}>
                        <SearchBar onSearchChange={setSelectedSearch}/>
                    </div>
                    <div style={{ flex: 0.25, marginLeft: '10px' }}>
                        <YearSelector years={years} onYearChange={setSelectedYear} selectedYear={selectedYear}/>
                    </div>
                </div>
                <Space h="md"/>
                {selectedYear === null || selectedYear === "Yükleniyor..." ? (
                    <Text style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'large' }}>
                        Lütfen yıl seçin.
                    </Text>
                ) : (
                <HighSchoolsTable data={dataForTable(departmentData)} search={selectedSearch}/>
                )}
            </div>
        </Stack>
    }
    else {
        ShownDataContainer = <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>İncelemek için bölüm seçin.</Text>
    }

    const DepartmentDetailsContainer = <div style={{ padding: '0 20%' }}>
        <Space h="xs"/>
        <Text fw={700} style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Bölüm Bazlı Veriler
        </Text>
        <div style={{marginLeft: '75px', marginRight: '75px'}}>
            <DepartmentSelector departments={departments} onDepartmentChange={setSelectedDepartment}/>
        </div>
        <Space h="xl"/>
        <Space h="xl"/>
        {ShownDataContainer}
        <Space h="xs"/>
    </div>


    return <div style={{width: "100%", minHeight: '100vh'}} className={"w-full h-full"}>
        {
            fetchedData
                ?
                <>
                    <Box className="flex-grow-0 flex-shrink-0">
                        <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
                            Bilkent Öğrenci Verisi
                        </Title>
                        <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
                            Mevcut öğrencilerin istatistikleri.
                        </Title>
                        <Space h="xl"/>
                        <Divider className="border-gray-400"/>
                    </Box>
                    <Stack gap="0" bg="white">
                        <Space h="md"/>
                        {GraphsContainer}
                        <Space h="md"/>
                        <Divider size="sm" className="border-gray-300"/>
                        <Space h="md"/>
                        {DepartmentDetailsContainer}
                        <Space h="xl"/>
                    </Stack>
                </>
                :
                <LoadingOverlay
                    visible={!fetchedData} zIndex={10}
                    overlayProps={{blur: 1, color: "#444", opacity: 0.8}}/>
        }
    </div>

}

export default BilkentStudentDetails;