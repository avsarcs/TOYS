import React, { useState } from 'react';
import {Table, ScrollArea, UnstyledButton, Group, Text, Center, rem, Pagination, Space, Container} from '@mantine/core';
import {IconSelector, IconChevronDown, IconChevronUp} from '@tabler/icons-react';

interface RowData {
    highSchool: string;
    [scholarship: string]: string | number;
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

function filterData(data: RowData[], search: string) {
    const query = normalizeString(search.trim());
    return data.filter((item) =>
        normalizeString(item["highSchool"]).includes(query)
    );
}

function sortData(
    data: RowData[],
    payload: {sortBy: keyof RowData | null; reversed: boolean; search: string}
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return filterData(data, payload.search);
    }

    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return Number(b[sortBy]) - Number(a[sortBy]);

            }
            return Number(a[sortBy]) - Number(b[sortBy]);
        }),
        payload.search,
    );
}

interface HighSchoolsTableProps {
    data: RowData[];
    search: string;
}

const HighSchoolsTable: React.FC<HighSchoolsTableProps> = ({data, search}) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search}));
    };

    React.useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search}));
    }, [data, reverseSortDirection, search, sortBy]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const rows = paginatedData.map((row) => (
        <Table.Tr key={row.highSchool}>
            {Object.keys(row).map((key) => (
                <Table.Td key={key} style={{textAlign: 'center', fontSize: "1rem"}}>{row[key]}</Table.Td>
            ))}
        </Table.Tr>
    ));

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    return (
        <ScrollArea>
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" highlightOnHover={true}>
                <Table.Tbody>
                    <Table.Tr>
                        {Object.keys(data[0]).map((key) => (
                        <Th
                            key={key}
                            sorted={sortBy === key}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting(key)}
                        >
                            <Text size={"xl"}>
                                {key === "highSchool" ? "Lise" : key.charAt(0).toUpperCase() + key.slice(1)}
                            </Text>
                        </Th>
                        ))}
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

