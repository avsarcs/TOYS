import React from 'react';
import {Button} from '@mantine/core';

/**
 * Properties for add as rival button.
 */
interface RivalButtonProps {
    isRival: boolean; // Whether the university is a rival.
    setIsRival: (isRival: boolean) => void; // Function that sets the university as a rival or not.
}

/**
 * Dropdown menu for selecting a year.
 * @param isRival Whether the university is a rival.
 * @param setIsRival Function that sets the university as a rival or not.
 */
const RivalButton: React.FC<RivalButtonProps> = ({isRival, setIsRival}) => {
    const [loading, setLoading] = React.useState(false);

    return <Button
        size="compact-md"
        color={isRival ? "red" : "blue"}
        onClick={() => {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setIsRival(!isRival);
            }, 2000);
        }}
        loading={loading}
        style={{width: "60%"}}
    >
        {isRival ? "Rakiplikten Çıkar" : "Rakip Olarak Ekle"}
    </Button>
}

export default RivalButton;