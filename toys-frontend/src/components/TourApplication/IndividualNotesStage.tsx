import React, { useState } from 'react';
import {
    Paper,
    Title,
    Textarea,
    Stack,
    Container,
    TextInput
} from '@mantine/core';

import { IndividualApplicationStageProps } from '../../types/designed';

export const IndividualNotesStage: React.FC<IndividualApplicationStageProps> = ({
    applicationInfo,
    setApplicationInfo,
    warnings
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
                        <TextInput
                            label="Grupta kaç öğrenci olması bekleniyor?"
                            withAsterisk
                            placeholder="Bir sayı girin..."
                            value={applicationInfo.visitor_count == -1 ? "" : applicationInfo.visitor_count}
                            onChange={(e) => setApplicationInfo((application) => ({
                                ...application,
                                visitor_count: parseInt(e.target.value)
                            }))}
                            type="number"
                            error={warnings["no_student_count"] ? "0'dan büyük bir sayı giriniz." : false}
                            min={0}
                        />
                        <Textarea
                            label="Bize bırakmak istediğiniz başka notlar var mı?"
                            description="(Örneğin özel ihtiyaç sahibi öğrenciler vs.)"
                            placeholder="..."
                            value={applicationInfo.applicant["notes"]}
                            onChange={(e) => {
                                setApplicationInfo((appInfo) => ({
                                    ...appInfo,
                                    applicant: {
                                        ...appInfo.applicant,
                                        notes: e.target.value
                                    }
                                }))
                            }}
                            minRows={4}
                        />
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
};

export default IndividualNotesStage;