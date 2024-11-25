import React from 'react';
import {Button} from '@mantine/core';

/**
 * Properties for see details button.
 */
interface DetailsButtonProps {
    openDetails: (year: number) => void; // Function that opens the student details modal.
    year: number; // Year to show details of.
}

/**
 * Button for opening high school student details modal.
 * @param openDetails Function that opens the student details modal.
 * @param year Year to show details of.
 */
const DetailsButton: React.FC<DetailsButtonProps> = ({openDetails, year}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            openDetails(year);
        }}
        style={{width: "60%"}}
    >
        <text>Detaylar</text>
    </Button>
}

export default DetailsButton;