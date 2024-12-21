import React from 'react';
import {Button, Text, rem} from '@mantine/core';
import {IconChevronLeft} from "@tabler/icons-react";

/**
 * Properties for go back button.
 */
interface BackButtonProps {
    onBack: () => void; // Function that closes the high school details modal.
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
        <Text>Geri</Text>
    </Button>
}

export default BackButton;