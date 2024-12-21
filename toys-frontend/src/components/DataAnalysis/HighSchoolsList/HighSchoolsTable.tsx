import React, { useState } from 'react';
import {
    Table,
    ScrollArea,
    UnstyledButton,
    Text,
    rem,
    Pagination,
    Space,
    Container,
} from '@mantine/core';
import {IconSelector, IconChevronDown, IconChevronUp} from '@tabler/icons-react';
import DetailsButton from "./DetailsButton.tsx";
import AddButton from "./AddButton.tsx";

interface RowData {
    highSchool: string;
    city: string;
    ranking: string;
    priority: string;
    id: string;
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

function normalizeString(str: string) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i')
        .replace(/İ/g, 'i')
        .toLowerCase();
}

function Th({children, reversed, sorted, onSort}: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th style={{padding: 0, textAlign: "center"}}>
            <UnstyledButton onClick={onSort}>
                <Text span inline fw={500} fz="sm">
                    {children}
                    &nbsp;&nbsp;
                    <Icon className="inline align-baseline" style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                </Text>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: HighschoolData[], search: string, cities: string[]) {
    const query = normalizeString(search.trim());
    return data.filter((item) =>
        normalizeString(item["name"]).includes(query) &&
        (cities.length === 0 || cities.includes(item["location"]))
    );
}

function sortData(
    data: HighschoolData[],
    payload: {sortBy: keyof HighschoolData | null; reversed: boolean; search: string; cities: string[]}
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search, payload.cities);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                if(sortBy === 'ranking' || sortBy === 'priority') {
                    return Number(b[sortBy]) - Number(a[sortBy]);
                }
                else {
                    return b[sortBy].localeCompare(a[sortBy]);
                }
            }

            if(sortBy === 'ranking' || sortBy === 'priority') {
                return Number(a[sortBy]) - Number(b[sortBy]);
            }
            else {
                return a[sortBy].localeCompare(b[sortBy]);
            }
        }),
        payload.search,
        payload.cities
    );
}

interface HighSchoolsTableProps {
    data: HighschoolData[];
    search: string;
    cities: string[];
    openDetails: (highSchoolName: string, higSchoolID: string) => void;
    addHighSchool: () => void;
}

const HighSchoolsTable: React.FC<HighSchoolsTableProps> = ({data, search, cities, openDetails, addHighSchool}) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof HighschoolData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const setSorting = (field: keyof HighschoolData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search, cities }));
    };

    React.useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search, cities }));
    }, [data, reverseSortDirection, search, cities, sortBy]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const rows = paginatedData.map((row) => (
        <Table.Tr key={row.id}>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem"}}>{row.name}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.location}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.ranking}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.priority}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>
                <DetailsButton openDetails={openDetails} highSchoolName={row.highSchool} highSchoolID={row.id}/>
            </Table.Td>
        </Table.Tr>
    ));

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    return (
        <ScrollArea>
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" highlightOnHover={true}>
                <Table.Tbody>
                    <Table.Tr>
                        <Th
                            sorted={sortBy === 'name'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('name')}
                        >
                            <Text span size={"xl"}>
                                Lise
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'location'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('location')}
                        >
                            <Text span size={"xl"}>
                                Şehir
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'ranking'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('ranking')}
                        >
                            <Text span size={"xl"}>
                                LGS Sıralaması
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'priority'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('priority')}
                        >
                            <Text span size={"xl"}>
                                Tur Önceliği
                            </Text>
                        </Th>
                        <Table.Th style={{padding: 0, textAlign: "center"}}>
                            <AddButton addHighSchool={addHighSchool}/>
                        </Table.Th>
                    </Table.Tr>
                </Table.Tbody>
                <Table.Tbody h="md"></Table.Tbody>
                <Table.Tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={Object.keys(data[0]).length}>
                                <Text span fw={500} ta="center">
                                    Lise bulunamadı.
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
            <Space h="xl"/>
            <Container style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                <Pagination total={totalPages} value={currentPage} onChange={setCurrentPage} />
            </Container>
        </ScrollArea>
    );
}

export default HighSchoolsTable;

