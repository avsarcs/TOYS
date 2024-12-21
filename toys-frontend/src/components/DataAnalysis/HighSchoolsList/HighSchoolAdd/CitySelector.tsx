import React from 'react';
import {Select, rem} from '@mantine/core';
import {IconBuildings} from '@tabler/icons-react';
import {City} from "../../../../types/enum.ts";

/**
 * Properties for city selector dropdown menu.
 */
interface CitySelectorProps {
    setSelectedCity: (selectedCity: City | null) => void;
}

/**
 * Dropdown menu for selecting a city.
 * @param cities List of cities to display in the dropdown menu.
 * @param setSelectedCity Function that sets the selected city.
 */
const CitySelector: React.FC<CitySelectorProps> = ({setSelectedCity}) => {
    return <Select
        label = "Bir Şehir Seçin"
        data = {Object.entries(City).map(entry => ({value: entry[0], label: entry[1]}))}
        searchable = {true}
        placeholder="Şehir ismi girin."
        radius = "10"
        leftSection={<IconBuildings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(selectedValue) => {
            setSelectedCity(selectedValue as City);
        }}
    />
}

export default CitySelector;