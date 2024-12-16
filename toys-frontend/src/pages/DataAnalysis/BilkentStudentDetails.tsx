import React, {useCallback, useContext} from "react";
import {Space, Container, Text, Group, Stack} from '@mantine/core';
import HighSchoolsGraph from "../../components/DataAnalysis/BilkentStudentDetails/HighSchoolsGraph.tsx";
import CitiesGraph from "../../components/DataAnalysis/BilkentStudentDetails/CitiesGraph.tsx";
import TopStudentsGraph from "../../components/DataAnalysis/BilkentStudentDetails/TopStudentsGraph.tsx";
import DepartmentSelector from "../../components/DataAnalysis/BilkentStudentDetails/DepartmentSelector.tsx";
import YearSelector from "../../components/DataAnalysis/BilkentStudentDetails/YearSelector.tsx";
import SearchBar from "../../components/DataAnalysis/BilkentStudentDetails/SearchBar.tsx";
import HighSchoolsTable from "../../components/DataAnalysis/BilkentStudentDetails/HighSchoolsTable.tsx";
import DepartmentRankingGraph from "../../components/DataAnalysis/BilkentStudentDetails/DepartmentRankingGraph.tsx";
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

//test data
const defaultHighSchools = {"İzmir Fen Lisesi": 500, "Ankara Fen Lisesi": 400, "İstanbul Erkek Lisesi": 300, "Kabataş Erkek Lisesi": 200, "Galatasaray Lisesi": 100, "Bornova Anadolu Lisesi": 50, "Kadıköy Anadolu Lisesi": 25};
const defaultCities = {"Ankara": 1000, "İstanbul": 800, "İzmir": 600, "Eskişehir": 400, "Adana": 200, "Antalya": 100, "Erzurum": 50, "Konya": 25};
const defaultRankings = {"2020": 1000, "2021": 800, "2022": 600, "2023": 400, "2024": 200};
const defaultDepartments = ["CS", "EE", "IE"];
const defaultYears = ["2018", "2019", "2020"];
const defaultDepartmentData = {"İzmir Fen Lisesi": {"%0 Burs": 40, "%50 Burs": 10, "%100 Burs": 100}, "Ankara Fen Lisesi": {"%0 Burs": 30, "%50 Burs": 20, "%100 Burs": 90}, "İstanbul Erkek Lisesi": {"%0 Burs": 20, "%50 Burs": 30, "%100 Burs": 80}, "Kabataş Erkek Lisesi": {"%0 Burs": 10, "%50 Burs": 40, "%100 Burs": 70}, "Galatasaray Lisesi": {"%0 Burs": 5, "%50 Burs": 50, "%100 Burs": 60}, "Bornova Anadolu Lisesi": {"%0 Burs": 2, "%50 Burs": 60, "%100 Burs": 50}, "Kadıköy Anadolu Lisesi": {"%0 Burs": 1, "%50 Burs": 70, "%100 Burs": 40}};
const defaultScholarshipData = {"2020": {"%0 Burs": 40, "%50 Burs": 10, "%100 Burs": 100}, "2021": {"%0 Burs": 30, "%50 Burs": 20, "%100 Burs": 90}, "2022": {"%0 Burs": 20, "%50 Burs": 30, "%100 Burs": 80}, "2023": {"%0 Burs": 10, "%50 Burs": 40, "%100 Burs": 70}, "2024": {"%0 Burs": 5, "%50 Burs": 50, "%100 Burs": 60}};

const BilkentStudentDetails: React.FC = () => {
    const userContext = useContext(UserContext);
    const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);

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
        const url = new URL(TOUR_URL + "/internal/analytics/students/all");
        url.searchParams.append("auth", userContext.authToken);

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
        setCities(response["cities"]);
        setRankings(response["rankings"]);
        setDepartments(response["departments"]);

    }, [userContext.authToken]);

    const getYearsAndScholarshipData = useCallback(async (department: string) => {
        const url = new URL(TOUR_URL + "/internal/analytics/students/all");
        url.searchParams.append("auth", userContext.authToken);
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
        setScholarshipData(response["rankings"]);
    }, [userContext.authToken]);

    const getDepartmentData = useCallback(async (department: string, year: string) => {
        const url = new URL(TOUR_URL + "/internal/analytics/students/all");
        url.searchParams.append("auth", userContext.authToken);
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
    }, [userContext.authToken]);

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
    }, [selectedDepartment]);

    // useEffect hook to watch for changes in the state variables
    React.useEffect(() => {
        if(selectedDepartment && selectedYear)
            getDepartmentData(selectedDepartment, selectedYear).catch((reason) => {
                console.error(reason);
            });
    }, [selectedDepartment, selectedYear]);

    const HeaderTextContainer = <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
        <Text style={{fontSize: 'xx-large'}}>
            Bilkent Öğrenci Verisi
        </Text>
    </Container>

    const GraphsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs" />
        <Stack>
            <Group>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontSize: 'x-large', display: 'flex', justifyContent: 'center' }}>
                        Öğrencilerin Liseleri
                    </Text>
                    <Space h="xs" />
                    <HighSchoolsGraph data={highSchools} style={{ margin: '20px', maxHeight: '400px' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Text style={{ fontSize: 'x-large', display: 'flex', justifyContent: 'center' }}>
                        Öğrencilerin Şehirleri
                    </Text>
                    <Space h="xs" />
                    <CitiesGraph data={cities} style={{ margin: '20px', maxHeight: '400px'}}/>
                </div>
            </Group>
            <Space h="xl"/>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    İlk 10 Liseden Gelen Öğrenciler
                </Text>
                <Space h="xs" />
                <TopStudentsGraph data={rankings} style={{ margin: '20px', maxHeight: '400px'}}/>
            </div>
        </Stack>
        <Space h="xs" />
    </Container>

    const dataForTable = (data: Record<string, Record<string, number>>)=> {
        return Object.entries(data).map(([highSchool, scholarships]) => ({
            highSchool,
            ...scholarships
        }));
    };

    let ShownDataContainer: JSX.Element;

    if(selectedDepartment) {
        ShownDataContainer = <Stack>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    {selectedDepartment} İçin YKS Tavan Sıralama
                </Text>
                <Space h="xs"/>
                <DepartmentRankingGraph data={scholarshipData} style={{margin: '20px', maxHeight: '400px'}}/>
            </div>
            <Space h="xs"/>
            <div>
                <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
                    {selectedDepartment} Öğrencilerinin Liseleri
                </Text>
                <Space h="xs"/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '75px', marginRight: '75px' }}>
                    <div style={{ flex: 0.75, marginRight: '10px' }}>
                        <SearchBar onSearchChange={setSelectedSearch}/>
                    </div>
                    <div style={{ flex: 0.25, marginLeft: '10px' }}>
                        <YearSelector years={years} onYearChange={setSelectedYear}/>
                    </div>
                </div>
                <Space h="md"/>
                <HighSchoolsTable data={dataForTable(departmentData)} search={selectedSearch}/>
            </div>
        </Stack>
    }
    else {
        ShownDataContainer = <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>İncelemek için bölüm seçin.</Text>
    }

    const DepartmentDetailsContainer = <Container style={defaultContainerStyle}>
        <Space h="xs"/>
        <Text style={{fontSize: 'x-large', display: "flex", justifyContent: "center"}}>
            Bölüm Bazlı Veriler
        </Text>
        <div style={{marginLeft: '75px', marginRight: '75px'}}>
            <DepartmentSelector departments={departments} onDepartmentChange={setSelectedDepartment}/>
        </div>
        <Space h="xl"/>
        <Space h="xl"/>
        {ShownDataContainer}
        <Space h="xs"/>
    </Container>


    return <div style={{width: "100%", minHeight: '100vh'}} className={"w-full h-full"}>
        <Space h="xl"/>
        {HeaderTextContainer}
        <hr style={{border: '1px solid black'}}/>
        <Space h="xl"/>
        {GraphsContainer}
        <Space h="xl"/>
        {DepartmentDetailsContainer}
        <Space h="xl"/>
        <Space h="xl"/>
    </div>

}

export default BilkentStudentDetails;