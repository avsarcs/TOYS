import React from 'react';
import {TextInput, rem} from '@mantine/core';
import {IconSchool} from '@tabler/icons-react';

/**
 * Properties for name input.
 */
interface NameInputProps {
    onNameChange: (name: string) => void;
}

/**
 * Name input field for adding hig school.
 * @param onNameChange Function that sets the new name.
 */
const NameInput: React.FC<NameInputProps> = ({onNameChange}) => {
    return <TextInput
        label = "Lise İsmi"
        placeholder="Lise ismi girin."
        radius = "10"
        leftSection={<IconSchool style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(event) => {
            onNameChange(event.currentTarget.value);
        }}
    />
}

export default NameInput;