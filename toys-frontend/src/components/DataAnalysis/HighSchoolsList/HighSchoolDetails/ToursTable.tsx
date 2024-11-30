import React, { useState } from 'react';
import {Table, ScrollArea, UnstyledButton, Group, Text, Center, rem, Pagination, Space, Container} from '@mantine/core';
import {IconSelector, IconChevronDown, IconChevronUp, IconStarFilled, IconStarHalfFilled, IconStar} from '@tabler/icons-react';
import ReviewButton from "./ReviewButton.tsx";

function renderStars(rating: number | null, date: string, openDetails: (date: string) => void) {
    if(rating === null) {
        return <Text>Yok</Text>;
    }

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<IconStarFilled key={i} style={{ width: rem(16), height: rem(16) }} />);
        } else if (i - rating < 1) {
            stars.push(<IconStarHalfFilled key={i} style={{ width: rem(16), height: rem(16) }} />);
        } else {
            stars.push(<IconStar key={i} style={{ width: rem(16), height: rem(16) }} />);
        }
    }

    return <ReviewButton label={stars} openReview={openDetails} date={date} />;
}

interface RowData {
    date: string;
    attendance: number;
    type: string;
    reviewID: string;
    reviewRating: number | null;
    contact: string;
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
            if (sortBy === 'attendance' || sortBy === 'reviewRating') {
                return Number(b[sortBy]) - Number(a[sortBy]);
            } else if (sortBy === 'date') {
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);

                return new Date(yearB, monthB - 1, dayB).getTime() - new Date(yearA, monthA - 1, dayA).getTime();
            } else {
                return b[sortBy].localeCompare(a[sortBy]);
            }
        }

        if (sortBy === 'attendance' || sortBy === 'reviewRating') {
            return Number(a[sortBy]) - Number(b[sortBy]);
        } else if (sortBy === 'date') {
            const [dayA, monthA, yearA] = a.date.split('/').map(Number);
            const [dayB, monthB, yearB] = b.date.split('/').map(Number);
            return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
        } else {
            return a[sortBy].localeCompare(b[sortBy]);
        }
    })
}

interface ToursTableProps {
    data: RowData[];
    openDetails: (date: string) => void;
}

const ToursTable: React.FC<ToursTableProps> = ({data, openDetails}) => {
    const [sortBy, setSortBy] = useState<keyof RowData>('date');
    const [reverseSortDirection, setReverseSortDirection] = useState(true);
    const [sortedData, setSortedData] = useState(() => sortData(data, { sortBy: 'date', reversed: true }));
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
        <Table.Tr key={row.date}>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem"}}>{row.date}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.attendance}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.type}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{renderStars(row.reviewRating, row.date, openDetails)}</Table.Td>
            <Table.Td style={{textAlign: 'center', fontSize: "1rem" }}>{row.contact}</Table.Td>
        </Table.Tr>
    ));

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    return (
        <ScrollArea>
            <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" highlightOnHover={true}>
                <Table.Tbody>
                    <Table.Tr>
                        <Th
                            sorted={sortBy === 'date'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('date')}
                        >
                            <Text size={"xl"}>
                                Tarih
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'attendance'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('attendance')}
                        >
                            <Text size={"xl"}>
                                Katılımcı Sayısı
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'type'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('type')}
                        >
                            <Text size={"xl"}>
                                Tür
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'reviewRating'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('reviewRating')}
                        >
                            <Text size={"xl"}>
                                Değerlendirme
                            </Text>
                        </Th>
                        <Th
                            sorted={sortBy === 'contact'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('contact')}
                        >
                            <Text size={"xl"}>
                                İletişim
                            </Text>
                        </Th>
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
                                    Tur bulunamadı.
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

export default ToursTable;