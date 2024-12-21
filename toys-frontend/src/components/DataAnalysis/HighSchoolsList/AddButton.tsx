import React from 'react';
import {Button, rem, Text} from '@mantine/core';
import {IconPlus} from '@tabler/icons-react';

/**
 * Properties for add high school button.
 */
interface AddButtonProps {
    addHighSchool: () => void; // Function that opens the details modal.
}

/**
 * Button for opening high school adding modal.
 * @param addHighSchool Function that opens the add high school modal.
 */
const AddButton: React.FC<AddButtonProps> = ({addHighSchool}) => {
    return <Button
        size="compact-md"
        color={"blue"}
        onClick={() => {
            addHighSchool();
        }}
        style={{width: "60%"}}
        leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
    >
        <Text>Lise Ekleyin</Text>
    </Button>
}

export default AddButton;