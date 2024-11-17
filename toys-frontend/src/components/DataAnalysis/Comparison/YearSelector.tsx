import React from 'react';
import {Select} from '@mantine/core';

/**
 * Properties for year selector dropdown menu.
 */
interface YearSelectorProps {
    years: string[]; // List of years to display in the dropdown menu.
    setSelectedYear: (selectedYear: string | null) => void;
}

/**
 * Dropdown menu for selecting a year.
 * @param years List of years to display in the dropdown menu.
 * @param setSelectedYear Function that sets the selected year.
 */
const YearSelector: React.FC<YearSelectorProps> = ({years, setSelectedYear}) => {
    return <Select
        label = "Bir Yıl Seçin"
        defaultValue = {years[years.length-1]}
        data = {years.map((year) => ({ value: year, label: year }))}
        searchable = {false}
        allowDeselect = {false}
        radius = "10"
        required
        onChange={(selectedValue) => {
            setSelectedYear(selectedValue);
        }}
    />
}

export default YearSelector;