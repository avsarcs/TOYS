import React from "react";
import {SimpleGrid} from '@mantine/core';
import SearchBar from "./SearchBar.tsx";
import CitySelector from "./CitySelector.tsx";

interface TableFilterProps {
    cities: string[]; // List of cities to display in the dropdown menu.
    setSearch: (search: string) => void; // Function to set the search query.
    setSelectedCities: (selectedCities: string[]) => void; // Function to set the selected city.
}

const TableFilter: React.FC<TableFilterProps> = ({cities, setSearch, setSelectedCities}) => {
    return <SimpleGrid cols={1}>
        <div><SearchBar onSearchChange={setSearch}/></div>
        <div><CitySelector cities={cities} setSelectedCities={setSelectedCities}/></div>
    </SimpleGrid>
}

export default TableFilter;