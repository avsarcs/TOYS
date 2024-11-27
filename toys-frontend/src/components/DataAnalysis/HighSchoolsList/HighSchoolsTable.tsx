import React, { useState } from 'react';
import {Table, ScrollArea, UnstyledButton, Group, Text, Center, rem, Pagination, Space, Container} from '@mantine/core';
import {IconSelector, IconChevronDown, IconChevronUp} from '@tabler/icons-react';
import DetailsButton from "./DetailsButton.tsx";
import AddButton from "./AddButton.tsx";

interface RowData {
    highSchool: string;
    city: string;
    ranking: string;
    priority: string;
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
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: RowData[], search: string, cities: string[]) {
    const query = normalizeString(search.trim());
    return data.filter((item) =>
        normalizeString(item["highSchool"]).includes(query) &&
        (cities.length === 0 || cities.includes(item["city"]))
    );
}

function sortData(
    data: RowData[],
    payload: {sortBy: keyof RowData | null; reversed: boolean; search: string; cities: string[]}
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
    data: RowData[];
    search: string;
    cities: string[];
    openDetails: (highSchool: string) => void;
    addHighSchool: () => void;
}

const HighSchoolsTable: React.FC<HighSchoolsTableProps> = ({data, search, cities, openDetails, addHighSchool}) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const setSorting = (field: keyof RowData) => {
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
        <Table.Tr key={row.highSchool}>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem"}}>{row.highSchool}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.city}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.ranking}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.priority}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>
                <DetailsButton openDetails={openDetails} highSchool={row.highSchool}/>
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
                            sorted={sortBy === 'highSchool'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('highSchool')}
                        >
                            <Text size={"xl"}>
                                Lise
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'city'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('city')}
                        >
                            <Text size={"xl"}>
                                Şehir
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'ranking'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('ranking')}
                        >
                            <Text size={"xl"}>
                                LGS Sıralaması
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'priority'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('priority')}
                        >
                            <Text size={"xl"}>
                                Tur Önceliği
                            </Text>
                        </Th>
                        <Table.Th style={{padding: 0, textAlign: "center"}}>
                            <Group justify="center">
                                <AddButton addHighSchool={addHighSchool}/>
                            </Group>
                        </Table.Th>
                    </Table.Tr>
                </Table.Tbody>
                <Space h="md"/>
                <Table.Tbody>
                    {rows.length > 0 ? (
                        rows
                    ) : (
                        <Table.Tr>
                            <Table.Td colSpan={Object.keys(data[0]).length}>
                                <Text fw={500} ta="center">
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

