import React, { useState } from 'react';
import {
    Paper,
    Title,
    Textarea,
    Stack,
    Container
} from '@mantine/core';

import { IndividualApplicationStageProps } from '../../types/designed';

export const IndividualNotesStage: React.FC<IndividualApplicationStageProps> = ({
    applicationInfo,
    setApplicationInfo
}) => {

    return (
        <Container size="sm">
            <Paper p="md">
                <form>
                    <Stack gap="lg">
                        <div>
                            <Title order={2} size="h4" c="#3366FF" mb="md">
                                Son Aşama...
                            </Title>
                        </div>
                        <Textarea
                            label="Bize bırakmak istediğiniz başka notlar var mı?"
                            description="(Örneğin özel ihtiyaç sahibi öğrenciler vs.)"
                            placeholder="..."
                            value={applicationInfo["applicant_notes"]}
                            onChange={(e) => setApplicationInfo((application) => ({
                                ...application,
                                "applicant_notes": e.target.value
                            }))}
                            minRows={4}
                        />
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default IndividualNotesStage;