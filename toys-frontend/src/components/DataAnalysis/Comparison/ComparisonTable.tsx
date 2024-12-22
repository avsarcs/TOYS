import React from "react";
import {Space, Table, Text, Container, Stack, Group} from '@mantine/core';
import YearSelector from "./YearSelector.tsx";

interface ComparisonNestedTableProps {
    school1Name: string;
    school1Min: string;
    school1Max: string;
    school2Name: string;
    school2Min: string;
    school2Max: string;
}

const ComparisonNestedTable: React.FC<ComparisonNestedTableProps> = ({school1Name, school1Min, school1Max, school2Name, school2Min, school2Max}) => {
    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>{school1Name}</Table.Th>
                <Table.Th>{school2Name}</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            <Table.Tr key={"rankings"}>
                <Table.Td>{(school1Min === "-" && (school1Max === "-" || school1Max === "Dolmadı")) ? "Yok" : school1Min + " - " + (school1Max === "Dolmadı" ? "Dolmadı" : school1Max)}</Table.Td>
                <Table.Td>{(school2Min === "-" && (school2Max === "-" || school2Max === "Dolmadı")) ? "Yok" : school2Min + " - " + (school2Max === "Dolmadı" ? "Dolmadı" : school2Max)}</Table.Td>
            </Table.Tr>
        </Table.Tbody>
    </Table>
}

interface ComparisonTableProps {
    years: string[];
    data: {[year: string]: {title: string, school1Name: string, school1Min: string, school1Max: string, school2Name: string, school2Min: string, school2Max: string}[]};
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({years, data}) => {
    const [selectedYear, setSelectedYear] = React.useState<string | null>(years[years.length-1]);

    return <Stack>
        <YearSelector
            years={years}
            setSelectedYear={setSelectedYear}
        />
        <Space h="xs" />
        <Group>
            {(data[selectedYear!]).map((row) => (
                <Container style={{ flex: '1'}}>
                    <Space h="xs" />
                    <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>{row.title}</Text>
                    <ComparisonNestedTable
                        school1Name={row.school1Name}
                        school1Min={row.school1Min}
                        school1Max={row.school1Max}
                        school2Name={row.school2Name}
                        school2Min={row.school2Min}
                        school2Max={row.school2Max}
                    />
                    <Space h="xs" />
                </Container>
            ))}
        </Group>
    </Stack>

}

export default ComparisonTable;