import React from 'react';
import {Select, rem} from '@mantine/core';
import {IconBuildings} from '@tabler/icons-react';
import {City} from "../../../../../types/enum.ts";

/**
 * Properties for city selector dropdown menu.
 */
interface CitySelectorProps {
    selectedCity: City | null; // Selected city.
    setSelectedCity: (selectedCity: City | null) => void;
}

/**
 * Dropdown menu for selecting a city.
 * @param cities List of cities to display in the dropdown menu.
 * @param selectedCity Selected city.
 * @param setSelectedCity Function that sets the selected city.
 */
const CitySelector: React.FC<CitySelectorProps> = ({selectedCity, setSelectedCity}) => {
    return <Select
        label = "Bir Şehir Seçin"
        data = {Object.entries(City).map((city) => ({ value: city[0], label: city[1] }))}
        defaultValue = {selectedCity}
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