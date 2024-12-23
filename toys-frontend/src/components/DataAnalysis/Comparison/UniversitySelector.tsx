import React from 'react';
import {rem, Select} from '@mantine/core';
import {notifications} from "@mantine/notifications";
import {IconBuildings} from "@tabler/icons-react";

/**
 * Properties for university selector dropdown menu.
 */
interface UniversitySelectorProps {
    universities: { name: string, id: string }[]; // List of universities to display in the dropdown menu.
    onUniversityChange: (selectedUniversity: { name: string, id: string } | null) => void; // Function that sets the selected university.
    currentUniversity: { name: string, id: string } | null; // Currently selected university.
}

/**
 * Dropdown menu for selecting a university.
 * @param universities List of universities to display in the dropdown menu.
 * @param onUniversityChange Function that sets the selected university.
 * @param currentUniversity Currently selected university.
 */
const UniversitySelector: React.FC<UniversitySelectorProps> = ({universities, onUniversityChange, currentUniversity}) => {
    if (currentUniversity && !universities.includes(currentUniversity) && currentUniversity["id"] != "") {
        notifications.show({
            color: "red",
            title: "Üniversite bulunamadı.",
            message: "Seçilen üniversite sistemde kayıtlı değil."
        });
    }
    return <Select
        value = {currentUniversity ? currentUniversity.id : null}
        label = "Üniversite Seçin"
        placeholder = "Seçmek için tıklayın."
        data = {universities.map((university) => ({ value: university.id, label: university.name }))}
        searchable
        nothingFoundMessage="Üniversite bulunamadı."
        allowDeselect = {false}
        radius = "10"
        leftSection={<IconBuildings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        required
        onChange={(selectedValue) => {
            const selectedUniversity = universities.find(university => university.id === selectedValue) || null;
            onUniversityChange(selectedUniversity);
        }}
    />;
}

export default UniversitySelector;