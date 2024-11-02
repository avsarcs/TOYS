import React from 'react';
import { Select } from '@mantine/core';

/**
 * Properties for university selector dropdown menu.
 */
interface UniversitySelectorProps {
    universities: string[]; // List of universities to display in the dropdown menu.
    onUniversityChange: (selectedUniversity: string | null) => void;
}

/**
 * Dropdown menu for selecting a university.
 * @param universities: list of universities to display in the dropdown menu.
 */
const UniversitySelector: React.FC<UniversitySelectorProps> = ({universities, onUniversityChange}) => {
    return <Select
        label = "Üniversite Seçin"
        placeholder = "Seçmek için tıklayın."
        data = {universities.map((university) => ({ value: university, label: university }))}
        searchable
        allowDeselect = {false}
        radius = "10"
        required
        onChange={(selectedValue) => {
            onUniversityChange(selectedValue);
        }}
    />;
}

export default UniversitySelector;