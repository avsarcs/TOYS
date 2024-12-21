import { Box, Title } from '@mantine/core';
import React from 'react';

import "./ApplicationSuccess.css"

export const ApplicationSuccess: React.FC = () => {
    return (
        <>
            <div className='application-success-container'>
                <Title>Başvurunuzu aldık!</Title>
                <div>Size geri dönüş yapacağız.</div>
                <Title className='text-red-600' size="h1">KODUNUZU NOT ALIN!</Title> <Title>zurtzart</Title>
                <div className='mb-3'>Başvurunuzda değişiklik yapmak istemeniz durumunda bu kodu temin etmeniz gerekmektedir. 
                </div>
                <img src="/bilkent_drone.jpg" />
            </div>
        </>
    );
};

export default ApplicationSuccess;
