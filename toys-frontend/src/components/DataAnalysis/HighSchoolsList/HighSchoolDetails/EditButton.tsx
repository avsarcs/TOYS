import React from 'react';
import {Button, Text, rem} from '@mantine/core';
import {IconPencil} from "@tabler/icons-react";

/**
 * Properties for edit button.
 */
interface EditButtonProps {
    onEdit: () => void; // Function that opens the details modal.
}

/**
 * Button for exiting the high school details modal.
 */
const EditButton: React.FC<EditButtonProps> = ({onEdit}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            onEdit();
        }}
        style={{width: "60%"}}
        leftSection={<IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
    >
        <Text>Düzenle</Text>
    </Button>
}

export default EditButton;