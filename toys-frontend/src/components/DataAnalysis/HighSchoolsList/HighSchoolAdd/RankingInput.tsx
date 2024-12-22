import React from 'react';
import {NumberInput, rem} from '@mantine/core';
import {IconNotebook} from '@tabler/icons-react';

/**
 * Properties for ranking input.
 */
interface RankingInputProps {
    onRankingChange: (ranking: string) => void;
}

/**
 * Ranking input field for adding high school.
 * @param onRankingChange Function that sets the new ranking.
 */
const RankingInput: React.FC<RankingInputProps> = ({onRankingChange}) => {
    return <NumberInput
        label = "Lise LGS Sıralaması"
        placeholder="Lise LGS sıralamasını girin."
        radius = "10"
        leftSection={<IconNotebook style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        onChange={(value) => onRankingChange(String(value))}
    />
}

export default RankingInput;