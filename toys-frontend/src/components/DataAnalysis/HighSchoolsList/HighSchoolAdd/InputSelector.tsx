import React from "react";
import {SimpleGrid} from '@mantine/core';
import NameInput from "./NameInput.tsx";
import CitySelector from "./CitySelector.tsx";
import PrioritySelector from "./PrioritySelector.tsx";
import {City} from "../../../../types/enum.ts";

interface InputSelectorProps {
    priorities: string[]; // List of priorities to display in the dropdown menu.
    setName: (search: string) => void; // Function to set the high school name.
    setSelectedCity: (selectedCity: City | null) => void; // Function to set the selected city.
    setSelectedPriority: (selectedPriority: string | null) => void; // Function to set the selected priority.
}

const InputSelector: React.FC<InputSelectorProps> = ({priorities, setName, setSelectedCity, setSelectedPriority}) => {
    return <SimpleGrid cols={1}>
        <div><NameInput onNameChange={setName}/></div>
        <div><CitySelector setSelectedCity={setSelectedCity}/></div>
        <div><PrioritySelector priorities={priorities} setSelectedPriority={setSelectedPriority}/></div>
    </SimpleGrid>
}

export default InputSelector;