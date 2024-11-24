import React, { useState } from 'react';
import {Table, ScrollArea, UnstyledButton, Group, Text, Center, rem, Pagination, Space, Container} from '@mantine/core';
import {IconSelector, IconChevronDown, IconChevronUp} from '@tabler/icons-react';
import DetailsButton from "./DetailsButton.tsx";

interface RowData {
    year: number;
    count: number;
}

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
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

function sortData(
    data: RowData[],
    payload: {sortBy: keyof RowData | null; reversed: boolean}
) {
    const { sortBy } = payload;

    if (!sortBy) {
        return data
    }

    return [...data].sort((a, b) => {
        if (payload.reversed) {
            return Number(b[sortBy]) - Number(a[sortBy]);
        }

        return Number(a[sortBy]) - Number(b[sortBy]);
    })
}

interface StudentsTableProps {
    data: RowData[];
    openDetails: (year: number) => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({data, openDetails}) => {
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const setSorting = (field: keyof RowData) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed}));
    };

    React.useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection}));
    }, [data, reverseSortDirection, sortBy]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);

    const rows = paginatedData.map((row) => (
        <Table.Tr key={row.year}>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem"}}>{row.year}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.count}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>
                <DetailsButton year={row.year} openDetails={openDetails} />
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
                            sorted={sortBy === 'year'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('year')}
                        >
                            <Text size={"xl"}>
                                Yıl
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'count'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('count')}
                        >
                            <Text size={"xl"}>
                                Öğrenci Sayısı
                            </Text>
                        </Th>
                        <Table.Th style={{padding: 0, textAlign: "center"}}>
                            <Group justify="space-between">
                                <Text fw={500} fz="sm">
                                    {""}
                                </Text>
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
                                    Öğrenci bulunamadı.
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

export default StudentsTable;