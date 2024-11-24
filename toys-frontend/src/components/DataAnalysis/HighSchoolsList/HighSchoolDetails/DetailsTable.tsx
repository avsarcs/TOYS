import React from "react";
import {Space, Text, Container, Group} from '@mantine/core';

interface DetailsTableProps {
    priority: number;
    ranking: number;
    city: string;
}

const DetailsTable: React.FC<DetailsTableProps> = ({priority, ranking, city}) => {
    return <Group>
        <Container style={{ flex: '1'}}>
            <Space h="xs" />
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>Öncelik</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>{priority}</Text>
            <Space h="xs" />
        </Container>
        <Container style={{ flex: '1'}}>
            <Space h="xs" />
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>LGS Sıralaması</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>{ranking}</Text>
            <Space h="xs" />
        </Container>
        <Container style={{ flex: '1'}}>
            <Space h="xs" />
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>Şehir</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>{city}</Text>
            <Space h="xs" />
        </Container>
    </Group>
}

export default DetailsTable;