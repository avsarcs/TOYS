import React from 'react';
import {Select} from '@mantine/core';

/**
 * Properties for year selector dropdown menu.
 */
interface YearSelectorProps {
    years: string[]; // List of years to display in the dropdown menu.
    onYearChange: (selectedYear: string | null) => void;
}

/**
 * Dropdown menu for selecting a year.
 * @param years List of years to display in the dropdown menu.
 * @param onYearChange Function that sets the selected year.
 */
const YearSelector: React.FC<YearSelectorProps> = ({years, onYearChange}) => {
    return <Select
        label = "Bir Yıl Seçin"
        defaultValue = {years[years.length-1]}
        data = {years.map((year) => ({ value: year, label: year }))}
        searchable = {false}
        allowDeselect = {false}
        radius = "10"
        required
        onChange={(selectedValue) => {
            onYearChange(selectedValue);
        }}
    />
}

export default YearSelector;