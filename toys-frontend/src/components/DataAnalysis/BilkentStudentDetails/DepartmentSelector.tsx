import React from 'react';
import { Select } from '@mantine/core';

/**
 * Properties for department selector dropdown menu.
 */
interface DepartmentSelectorProps {
    departments: string[]; // List of departments to display in the dropdown menu.
    onDepartmentChange: (selectedDepartment: string | null) => void;
}

/**
 * Dropdown menu for selecting a department.
 * @param departments List of departments to display in the dropdown menu.
 * @param onDepartmentChange Function that sets the selected department.
 */
const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({departments, onDepartmentChange}) => {
    return <Select
        label = "Bölüm Seçin"
        placeholder = {"İncelemek için bölüm seçin."}
        data = {departments.map((department) => ({ value: department, label: department }))}
        searchable
        nothingFoundMessage="Bölüm bulunamadı."
        allowDeselect = {false}
        radius = "10"
        required
        onChange={(selectedValue) => {
            onDepartmentChange(selectedValue);
        }}
    />;
}

export default DepartmentSelector;