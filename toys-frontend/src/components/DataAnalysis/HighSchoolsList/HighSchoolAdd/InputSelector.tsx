import React from "react";
import {SimpleGrid} from '@mantine/core';
import NameInput from "./NameInput.tsx";
import CitySelector from "./CitySelector.tsx";
import RankingInput from "./RankingInput.tsx";
import PrioritySelector from "./PrioritySelector.tsx";

interface InputSelectorProps {
    cities: string[]; // List of cities to display in the dropdown menu.
    priorities: string[]; // List of priorities to display in the dropdown menu.
    setName: (search: string) => void; // Function to set the high school name.
    setSelectedCity: (selectedCity: string | null) => void; // Function to set the selected city.
    setSelectedRanking: (selectedRanking: string | null) => void; // Function to set the selected ranking.
    setSelectedPriority: (selectedPriority: string | null) => void; // Function to set the selected priority.
}

const InputSelector: React.FC<InputSelectorProps> = ({cities, priorities, setName, setSelectedCity, setSelectedRanking, setSelectedPriority}) => {
    return <SimpleGrid cols={1}>
        <div><NameInput onNameChange={setName}/></div>
        <div><CitySelector cities={cities} setSelectedCity={setSelectedCity}/></div>
        <div><RankingInput onRankingChange={setSelectedRanking}/></div>
        <div><PrioritySelector priorities={priorities} setSelectedPriority={setSelectedPriority}/></div>
    </SimpleGrid>
}

export default InputSelector;