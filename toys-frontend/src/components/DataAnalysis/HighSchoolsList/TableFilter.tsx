import React from "react";
import {SimpleGrid} from '@mantine/core';
import SearchBar from "./SearchBar.tsx";
import CitySelector from "./CitySelector.tsx";
import {City} from "../../../types/enum.ts";

interface TableFilterProps {
    setSearch: (search: string) => void; // Function to set the search query.
    setSelectedCities: (selectedCities: City[]) => void; // Function to set the selected city.
}

const TableFilter: React.FC<TableFilterProps> = ({setSearch, setSelectedCities}) => {
    return <SimpleGrid cols={1}>
        <div><SearchBar onSearchChange={setSearch}/></div>
        <div><CitySelector setSelectedCities={setSelectedCities}/></div>
    </SimpleGrid>
}

export default TableFilter;