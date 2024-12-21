import React from 'react';
import {Button, Text, rem} from '@mantine/core';
import {IconPencil} from '@tabler/icons-react';

/**
 * Properties for add high school button.
 */
interface EditButtonProps {
    editHighSchool: () => void; // Function that opens the details modal.
}

/**
 * Button for opening high school editing modal.
 * @param editHighSchool Function that opens the edit high school modal.
 */
const EditButton: React.FC<EditButtonProps> = ({editHighSchool}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            editHighSchool();
        }}
        style={{width: "60%"}}
        leftSection={<IconPencil style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
    >
        <Text>Liseyi Düzenle</Text>
    </Button>
}

export default EditButton;