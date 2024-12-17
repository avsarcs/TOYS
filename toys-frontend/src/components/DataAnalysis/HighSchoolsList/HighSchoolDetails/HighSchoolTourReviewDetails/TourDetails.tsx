import React from "react";
import {Text, SimpleGrid} from '@mantine/core';
import {IconCalendar, IconBrandSafari, IconUser, IconMail} from "@tabler/icons-react";

interface TourDetailsProps {
    tourDate: string
    guideNames: string[]
    authorName: string
    authorEmail: string
}

const TourDetails: React.FC<TourDetailsProps> = ({tourDate, guideNames, authorName, authorEmail}) => {
    return <SimpleGrid cols={2} style={{ justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCalendar/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{new Date(tourDate).toLocaleDateString('en-GB')}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconBrandSafari/>
            <Text style={{
                fontSize: 'x-large',
                marginLeft: '8px'
            }}>{guideNames.join(', ')}</Text>
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