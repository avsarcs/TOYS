import React from 'react';
import {Select, rem} from '@mantine/core';
import {IconBuildings} from '@tabler/icons-react';

/**
 * Properties for city selector dropdown menu.
 */
interface CitySelectorProps {
    cities: string[]; // List of cities to display in the dropdown menu.
    setSelectedCity: (selectedCity: string | null) => void;
}

/**
 * Dropdown menu for selecting a city.
 * @param cities List of cities to display in the dropdown menu.
 * @param setSelectedCity Function that sets the selected city.
 */
const CitySelector: React.FC<CitySelectorProps> = ({cities, setSelectedCity}) => {
    return <Select
        label = "Bir Şehir Seçin"
        data = {cities.map((city) => ({ value: city, label: city }))}
        searchable = {true}
        placeholder="Şehir ismi girin."
        radius = "10"
        leftSection={<IconBuildings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(selectedValue) => {
            setSelectedCity(selectedValue);
        }}
    />
}

export default CitySelector;