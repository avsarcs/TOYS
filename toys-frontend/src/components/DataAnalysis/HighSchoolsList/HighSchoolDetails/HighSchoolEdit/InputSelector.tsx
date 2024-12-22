import React from "react";
import {SimpleGrid} from '@mantine/core';
import NameInput from "./NameInput.tsx";
import CitySelector from "./CitySelector.tsx";
import PrioritySelector from "./PrioritySelector.tsx";
import {City} from "../../../../../types/enum.ts";

interface InputSelectorProps {
    priorities: string[]; // List of priorities to display in the dropdown menu.
    currentName: string; // Current high school name.
    currentCity: City | null; // Current city.
    currentPriority: string | null; // Current priority.
    setName: (search: string) => void; // Function to set the high school name.
    setSelectedCity: (selectedCity: City | null) => void; // Function to set the selected city.
    setSelectedPriority: (selectedPriority: string | null) => void; // Function to set the selected priority.
}

const InputSelector: React.FC<InputSelectorProps> = ({priorities, currentName, currentCity, currentPriority, setName, setSelectedCity, setSelectedPriority}) => {
    return <SimpleGrid cols={1}>
        <div><NameInput selectedName={currentName} onNameChange={setName}/></div>
        <div><CitySelector selectedCity={currentCity} setSelectedCity={setSelectedCity}/></div>
        <div><PrioritySelector priorities={priorities} selectedPriority={currentPriority} setSelectedPriority={setSelectedPriority}/></div>
    </SimpleGrid>
}

export default InputSelector;