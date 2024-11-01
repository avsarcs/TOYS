import React from 'react';
import { Select } from '@mantine/core';

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
 * @param departments: list of departments to display in the dropdown menu.
 */
const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({departments, selectedUniversity, onDepartmentChange}) => {
    return <Select
        disabled = {selectedUniversity == null}
        label = "Bölüm Seçin"
        placeholder = {selectedUniversity ? "Department for " + selectedUniversity : "Önce bir üniversite seçin."}
        data = {departments.map((department) => ({ value: department, label: department }))}
        searchable
        allowDeselect = {false}
        radius = "10"
        required
        onChange={(selectedValue) => {
            onDepartmentChange(selectedValue);
        }}
    />;
}

export default DepartmentSelector;