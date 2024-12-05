import React from 'react';
import {Button} from '@mantine/core';

/**
 * Properties for see review button.
 */
interface ReviewButtonProps {
    label: any;
    openReview: (date: string) => void; // Function that opens the details modal.
    date: string; // Year to show details of.
}

/**
 * Button for opening high school tour review details modal.
 * @param label Label of the button.
 * @param openReview Function that opens the review modal.
 * @param date Date to show review of.
 */
const ReviewButton: React.FC<ReviewButtonProps> = ({label, openReview, date}) => {
    return <Button
        variant="subtle"
        size="compact-md"
        onClick={() => {
            openReview(date);
        }}
        style={{width: "60%"}}
    >
        {label}
    </Button>
}

export default ReviewButton;