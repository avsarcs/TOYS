import React from 'react';
import {Button, Text} from '@mantine/core';
import {HighschoolData} from "../../../types/data.ts";

/**
 * Properties for see details button.
 */
interface DetailsButtonProps {
    openDetails: (highSchoolName: string, highSchoolID: string) => void; // Function that opens the details modal.
    highSchoolName: string; // Name of the associated high school.
    highSchoolID: string; // ID of the associated high school.
}

/**
 * Button for opening high school details modal.
 * @param openDetails Function that opens the details modal.
 * @param highSchool Name of the associated high school.
 */
const DetailsButton: React.FC<DetailsButtonProps> = ({openDetails, highSchoolName, highSchoolID}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            openDetails(highSchoolName, highSchoolID);
        }}
        style={{width: "60%"}}
    >
        <Text>Detaylar</Text>
    </Button>
}

export default DetailsButton;