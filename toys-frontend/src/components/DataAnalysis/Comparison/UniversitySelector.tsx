import React from 'react';
import { Select } from '@mantine/core';

/**
 * Properties for university selector dropdown menu.
 */
interface UniversitySelectorProps {
    universities: string[]; // List of universities to display in the dropdown menu.
    onUniversityChange: (selectedUniversity: string | null) => void; // Function that sets the selected university.
    currentUniversity: string | null; // Currently selected university.
}

/**
 * Dropdown menu for selecting a university.
 * @param universities List of universities to display in the dropdown menu.
 * @param onUniversityChange Function that sets the selected university.
 * @param currentUniversity Currently selected university.
 */
const UniversitySelector: React.FC<UniversitySelectorProps> = ({universities, onUniversityChange, currentUniversity}) => {
    if (currentUniversity && !universities.includes(currentUniversity)) {
        alert("Üniversite bulunamadı.");
    }

    return <Select
        value = {currentUniversity}
        label = "Üniversite Seçin"
        placeholder = "Seçmek için tıklayın."
        data = {universities.map((university) => ({ value: university, label: university }))}
        searchable
        nothingFoundMessage="Üniversite bulunamadı."
        allowDeselect = {false}
        radius = "10"
        required
        onChange={(selectedValue) => {
            onUniversityChange(selectedValue);
        }}
    />;
}

export default UniversitySelector;