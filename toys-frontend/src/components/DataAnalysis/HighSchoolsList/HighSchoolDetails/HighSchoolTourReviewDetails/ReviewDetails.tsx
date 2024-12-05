import React from "react";
import {Text, Stack, rem} from '@mantine/core';
import {IconStar, IconStarFilled, IconStarHalfFilled} from "@tabler/icons-react";

interface ReviewDetailsProps {
    tourRating: number
    review: string
}

function renderStars(rating: number | null) {
    if(rating === null) {
        return <Text>Yok</Text>;
    }

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<IconStarFilled key={i} style={{ width: rem(32), height: rem(32) }} />);
        } else if (i - rating < 1) {
            stars.push(<IconStarHalfFilled key={i} style={{ width: rem(32), height: rem(32) }} />);
        } else {
            stars.push(<IconStar key={i} style={{ width: rem(32), height: rem(32) }} />);
        }
    }

    return stars;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({tourRating, review}) => {
    return <Stack>
        <div>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>Puan</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>{renderStars(tourRating)}</Text>
        </div>
        <div>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}} fw={700}>Yorum</Text>
            <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 'large', margin: '16px'}}>{review}</Text>
        </div>
    </Stack>
}


export default ReviewDetails;