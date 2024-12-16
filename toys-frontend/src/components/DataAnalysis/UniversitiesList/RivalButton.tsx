import React from 'react';
import {Button} from '@mantine/core';

/**
 * Properties for add as rival button.
 */
interface RivalButtonProps {
    isRival: boolean; // Whether the university is a rival.
    setIsRival: (isRival: boolean, universityID: string) => void; // Function that sets the university as a rival or not.
    universityID: string; // ID of the associated university.
}

/**
 * Button for changing rivalry status of a university.
 * @param isRival Whether the university is a rival.
 * @param setIsRival Function that sets the university as a rival or not.
 * @param universityID ID of the associated university.
 */
const RivalButton: React.FC<RivalButtonProps> = ({isRival, setIsRival, universityID}) => {
    const [loading, setLoading] = React.useState(false);

    return <Button
        size="compact-md"
        color={isRival ? "red" : "blue"}
        onClick={() => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setIsRival(!isRival, universityID);
            }, 2000);
        }}
        loading={loading}
        style={{width: "60%"}}
    >
        {isRival ? "Rakiplikten Çıkar" : "Rakip Olarak Ekle"}
    </Button>
}

export default RivalButton;