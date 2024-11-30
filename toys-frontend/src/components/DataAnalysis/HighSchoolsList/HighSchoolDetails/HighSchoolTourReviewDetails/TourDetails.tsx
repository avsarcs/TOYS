import React from "react";
import {Text, SimpleGrid} from '@mantine/core';
import {IconCalendar, IconBrandSafari, IconUser, IconMail} from "@tabler/icons-react";

interface TourDetailsProps {
    tourDate: string
    guideName: string
    authorName: string
    authorEmail: string
}

const TourDetails: React.FC<TourDetailsProps> = ({tourDate, guideName, authorName, authorEmail}) => {
    return <SimpleGrid cols={2} style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCalendar/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{tourDate}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBrandSafari/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{guideName}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconUser/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{authorName}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconMail/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{authorEmail}</Text>
        </div>
    </SimpleGrid>
}

export default TourDetails;