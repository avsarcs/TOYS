import React from 'react';
import {rem, Select} from '@mantine/core';
import {IconBook2} from "@tabler/icons-react";

/**
 * Properties for department selector dropdown menu.
 */
interface DepartmentSelectorProps {
    departments: string[]; // List of departments to display in the dropdown menu.
    selectedUniversity: string | null; // Selected university to display in the placeholder.
    onDepartmentChange: (selectedDepartment: string | null) => void;
}

/**
 * Dropdown menu for selecting a department.
 * @param departments List of departments to display in the dropdown menu.
 * @param selectedUniversity Selected university to display in the placeholder.
 * @param onDepartmentChange Function that sets the selected department.
 */
const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({departments, selectedUniversity, onDepartmentChange}) => {
    return <Select
        disabled = {selectedUniversity == null}
        label = "Bölüm Seçin"
        placeholder = {selectedUniversity ? selectedUniversity + " için bölüm seçin." : "Önce bir üniversite seçin."}
        data = {departments != null ? departments.map((department) => ({ value: department, label: department })) : []}
        searchable
        nothingFoundMessage="Bölüm bulunamadı."
        allowDeselect = {false}
        radius = "10"
        leftSection={<IconBook2 style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        required
        onChange={(selectedValue) => {
            onDepartmentChange(selectedValue);
        }}
    />;
}

export default DepartmentSelector;