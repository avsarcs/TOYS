import React from 'react';
import {Button, rem} from '@mantine/core';
import {IconChevronLeft} from "@tabler/icons-react";

/**
 * Properties for go back button.
 */
interface BackButtonProps {
    onBack: () => void; // Function that closes the add high school modal.
}

/**
 * Button for exiting the high school details modal.
 */
const BackButton: React.FC<BackButtonProps> = ({onBack}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            onBack();
        }}
        style={{width: "60%"}}
        leftSection={<IconChevronLeft style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
    >
        <text>Geri</text>
    </Button>
}

export default BackButton;