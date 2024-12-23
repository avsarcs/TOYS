import React from "react";
import {SimpleGrid} from '@mantine/core';
import NameInput from "./NameInput.tsx";
import CitySelector from "./CitySelector.tsx";
import PrioritySelector from "./PrioritySelector.tsx";
import RankingInput from "./RankingInput.tsx";

interface InputSelectorProps {
    cities: string[]; // List of cities to display in the dropdown menu.
    priorities: string[]; // List of priorities to display in the dropdown menu.
    currentName: string; // Current high school name.
    currentCity: string | null; // Current city.
    currentRanking: string; // Current ranking.
    currentPriority: string | null; // Current priority.
    setName: (search: string) => void; // Function to set the high school name.
    setSelectedCity: (selectedCity: string | null) => void; // Function to set the selected city.
    setSelectedRanking: (selectedRanking: string | null) => void; // Function to set the selected ranking.
    setSelectedPriority: (selectedPriority: string | null) => void; // Function to set the selected priority.
}

const InputSelector: React.FC<InputSelectorProps> = ({cities, priorities, currentName, currentCity, currentRanking, currentPriority, setName, setSelectedCity, setSelectedRanking, setSelectedPriority}) => {
    return <SimpleGrid cols={1}>
        <div><NameInput selectedName={currentName} onNameChange={setName}/></div>
        <div><CitySelector cities={cities} selectedCity={currentCity} setSelectedCity={setSelectedCity}/></div>
        <div><RankingInput selectedRanking={currentRanking} onRankingChange={setSelectedRanking}/></div>
        <div><PrioritySelector priorities={priorities} selectedPriority={currentPriority} setSelectedPriority={setSelectedPriority}/></div>
    </SimpleGrid>
}

export default InputSelector;