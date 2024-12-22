import React from 'react';
import {Button, Text} from '@mantine/core';
import {HighschoolData} from "../../../types/data.ts";

/**
 * Properties for see details button.
 */
interface DetailsButtonProps {
    openDetails: (highSchool: HighschoolData) => void; // Function that opens the details modal.
    highSchool: HighschoolData; // Name of the associated high school.
}

/**
 * Button for opening high school details modal.
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
        <Text>Detaylar</Text>
    </Button>
}

export default DetailsButton;