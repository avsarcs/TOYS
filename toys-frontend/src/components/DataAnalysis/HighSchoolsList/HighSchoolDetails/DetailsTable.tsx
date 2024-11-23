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
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>Öncelik</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>{priority}</Text>
            <Space h="xs" />
        </Container>
        <Container style={{ flex: '1'}}>
            <Space h="xs" />
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>LGS Sıralaması</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>{ranking}</Text>
            <Space h="xs" />
        </Container>
        <Container style={{ flex: '1'}}>
            <Space h="xs" />
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>Şehir</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>{city}</Text>
            <Space h="xs" />
        </Container>
    </Group>
}

export default DetailsTable;