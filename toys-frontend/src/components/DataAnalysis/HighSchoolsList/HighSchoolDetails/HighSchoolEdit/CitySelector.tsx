import React from 'react';
import {Select, rem} from '@mantine/core';
import {IconBuildings} from '@tabler/icons-react';

/**
 * Properties for city selector dropdown menu.
 */
interface CitySelectorProps {
    cities: string[]; // List of cities to display in the dropdown menu.
    selectedCity: string | null; // Selected city.
    setSelectedCity: (selectedCity: string | null) => void;
}

/**
 * Dropdown menu for selecting a city.
 * @param cities List of cities to display in the dropdown menu.
 * @param selectedCity Selected city.
 * @param setSelectedCity Function that sets the selected city.
 */
const CitySelector: React.FC<CitySelectorProps> = ({cities, selectedCity, setSelectedCity}) => {
    const [searchValue, setSearchValue] = React.useState('');

    const setNormalizedSearchValue = (value: string) => {
        setSearchValue(value.replace(/(^|\s)\S/g, l => l.toLocaleUpperCase('tr-TR')));
    }

    return <Select
        label = "Bir Şehir Seçin"
        data = {cities.map((city) => ({ value: city, label: city }))}
        defaultValue = {selectedCity ? selectedCity.split(' ')[0] : ''}
        searchable = {true}
        searchValue={searchValue}
        onSearchChange={setNormalizedSearchValue}
        placeholder="Şehir ismi girin."
        radius = "10"
        leftSection={<IconBuildings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(selectedValue) => {
            setSelectedCity(selectedValue);
        }}
    />
}

export default CitySelector;