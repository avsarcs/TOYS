import React from 'react';
import {NumberInput, rem} from '@mantine/core';
import {IconNotebook} from '@tabler/icons-react';

/**
 * Properties for ranking input.
 */
interface RankingInputProps {
    selectedRanking: string; // Selected ranking.
    onRankingChange: (ranking: string) => void;
}

/**
 * Ranking input field for editing high school.
 * @param selectedRanking Selected ranking.
 * @param onRankingChange Function that sets the new ranking.
 */
const RankingInput: React.FC<RankingInputProps> = ({selectedRanking, onRankingChange}) => {
    return <NumberInput
        label = "Lise LGS Sıralaması"
        defaultValue={selectedRanking === "" ? undefined : Number(selectedRanking)}
        placeholder="Lise LGS sıralamasını girin."
        radius = "10"
        leftSection={<IconNotebook style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(value) => onRankingChange(String(value))}
    />
}

export default RankingInput;