import React from 'react';
import {Button} from '@mantine/core';

/**
 * Properties for see details button.
 */
interface DetailsButtonProps {
    openDetails: (highSchool: string) => void; // Function that opens the details modal.
    highSchool: string; // Name of the associated high school.
}

/**
 * Dropdown menu for selecting a year.
 * @param openDetails Function that opens the details modal.
 * @param highSchool Name of the associated high school.
 */
const DetailsButton: React.FC<DetailsButtonProps> = ({openDetails, highSchool}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            openDetails(highSchool);
        }}
        style={{width: "60%"}}
    >
        <text>Detaylar</text>
    </Button>
}

export default DetailsButton;