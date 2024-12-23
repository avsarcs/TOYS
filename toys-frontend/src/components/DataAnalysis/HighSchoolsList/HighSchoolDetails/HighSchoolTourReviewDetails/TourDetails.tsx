import React from "react";
import {Text, SimpleGrid} from '@mantine/core';
import {
    IconCalendar,
    IconBrandSafari,
    IconUser,
    IconStar
} from "@tabler/icons-react";

interface TourDetailsProps {
    tour_date: string
    guides: string[]
    contact: string
    score: number
}

const TourDetails: React.FC<TourDetailsProps> = ({tour_date, guides, contact, score}) => {
    return <SimpleGrid cols={2} style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconUser/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{contact}</Text>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconBrandSafari/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{guides && guides.length > 0 ? guides.join(', ') : 'Yok'}</Text>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconCalendar/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{new Date(tour_date).toLocaleDateString('en-GB')}</Text>
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <IconStar/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{score+" / 5"}</Text>
        </div>
    </SimpleGrid>
}

export default TourDetails;