import React from 'react';
import {TextInput, rem} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';

/**
 * Properties for search bar.
 */
interface SearchBarProps {
    onSearchChange: (search: string) => void;
}

/**
 * Search bar for filtering universities.
 * @param onSearchChange Function that sets the search query.
 */
const SearchBar: React.FC<SearchBarProps> = ({onSearchChange}) => {
    return <TextInput
        label = "Ünversite Arayın"
        placeholder="Üniversite veya şehir ismi girin."
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(event) => {
            onSearchChange(event.currentTarget.value);
        }}
    />
}

export default SearchBar;