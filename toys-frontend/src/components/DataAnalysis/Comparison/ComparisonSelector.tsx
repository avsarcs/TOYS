import React from "react";
import {SimpleGrid, Text} from '@mantine/core';
import UniversitySelector from "./UniversitySelector.tsx";
import DepartmentSelector from "./DepartmentSelector.tsx";

interface ComparisonSelectorProps {
    universities: { name: string, id: string }[]; // List of universities to display in the dropdown menu.
    bilkentDepartments: string[]; // List of Bilkent's departments to display in the dropdown menu.
    otherDepartments: string[]; // List of other university's departments to display in the dropdown menu.
    setSelectedBilkentDepartment: (department: string | null) => void; // Function to set the selected Bilkent department.
    setSelectedOtherUniversity: (university: { name: string, id: string } | null) => void; // Function to set the selected other university.
    setSelectedOtherDepartment: (department: string | null) => void; // Function to set the selected other department.
    selectedOtherUniversity: { name: string, id: string } | null; // Selected other university to display in the placeholder.
}

const ComparisonSelector: React.FC<ComparisonSelectorProps> = ({universities, bilkentDepartments, otherDepartments, setSelectedBilkentDepartment, setSelectedOtherUniversity, setSelectedOtherDepartment, selectedOtherUniversity}) => {
    return <SimpleGrid cols={3}>
        <Text style={{display: 'flex', justifyContent: 'center', alignItems: 'center',  fontSize: 'x-large'}}>Bilkent</Text>
        <div></div>
        <div><UniversitySelector universities={universities} onUniversityChange={setSelectedOtherUniversity} currentUniversity={selectedOtherUniversity}/></div>
        <div><DepartmentSelector departments={bilkentDepartments} selectedUniversity={"Bilkent"} onDepartmentChange={setSelectedBilkentDepartment}/></div>
        <div></div>
        <div><DepartmentSelector departments={selectedOtherUniversity ? otherDepartments : []} selectedUniversity={selectedOtherUniversity?.name ?? null} onDepartmentChange={setSelectedOtherDepartment}/></div>
    </SimpleGrid>
}

export default ComparisonSelector;