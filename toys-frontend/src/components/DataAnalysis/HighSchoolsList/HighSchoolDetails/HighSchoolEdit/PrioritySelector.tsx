import React from 'react';
import {Select, rem} from '@mantine/core';
import {IconLabelImportant} from '@tabler/icons-react';

/**
 * Properties for priority dropdown menu.
 */
interface PrioritySelectorProps {
    priorities: string[]; // List of priorities to display in the dropdown menu.
    selectedPriority: string | null; // Selected priority.
    setSelectedPriority: (selectedPriority: string | null) => void;
}

/**
 * Dropdown menu for selecting a city.
 * @param priorities List of priorities to display in the dropdown menu.
 * @param selectedPriority Selected priority.
 * @param setSelectedPriority Function that sets the selected priority.
 */
const PrioritySelector: React.FC<PrioritySelectorProps> = ({priorities, selectedPriority, setSelectedPriority}) => {
    return <Select
        label = "Öncelik Seçin"
        data = {priorities.map((priority) => ({ value: priority, label: priority }))}
        defaultValue = {selectedPriority || null}
        placeholder="Seçmek için tıklayın."
        radius = "10"
        leftSection={<IconLabelImportant style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(selectedValue) => {
            setSelectedPriority(selectedValue);
        }}
    />
}

export default PrioritySelector;