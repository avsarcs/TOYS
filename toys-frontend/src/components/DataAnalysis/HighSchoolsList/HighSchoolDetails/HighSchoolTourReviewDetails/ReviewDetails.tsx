import React from "react";
import {Text, Stack} from '@mantine/core';

interface ReviewDetailsProps {
    body: string
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({body}) => {
    return <Stack>
        <div>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>Yorum</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'large', margin: '16px'}}>{body}</Text>
        </div>
    </Stack>
}

export default ReviewDetails;