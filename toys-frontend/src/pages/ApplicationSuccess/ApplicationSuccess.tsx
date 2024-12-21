import { Box, Title } from '@mantine/core';
import React from 'react';

import "./ApplicationSuccess.css"

export const ApplicationSuccess: React.FC = () => {
    return (
        <>
            <div className='application-success-container'>
                <br></br>
                <Title>Başvurunuzu aldık!</Title>
                <div>Size geri dönüş yapacağız. Bu sayfayı kapatabilirsiniz.</div>
                <br></br>
                <img src="/bilkent_drone.jpg" style={{ border: '10px solid black' }} />
            </div>
        </>
    );
};

export default ApplicationSuccess;
