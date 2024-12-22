import React from 'react';
import {Button} from '@mantine/core';

/**
 * Properties for go to comparison button.
 */
interface ComparisonButtonProps {
    universityID: string; // ID of the associated university.
    comparisonPageLink?: string; // Link to the comparison page.
}

/**
 * Button for opening the comparison page.
 * @param university Name of the associated university.
 * @param comparisonPageLink Link to the comparison page.
 */
const ComparisonButton: React.FC<ComparisonButtonProps> = ({universityID, comparisonPageLink="/comparison"}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            window.open(`${comparisonPageLink}?otherUniversity=${encodeURIComponent(universityID)}`, '_blank');
        }}
        style={{width: "60%"}}
    >
        Karşılaştır
    </Button>
}

export default ComparisonButton;