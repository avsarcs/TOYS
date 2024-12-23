import React from 'react';
import {
    Paper,
    Title,
    Textarea,
    Stack,
    Container,
    TextInput,
    Text,
    Alert
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconAlertCircle } from '@tabler/icons-react';
import { IndividualApplicationStageProps } from '../../types/designed';

export const IndividualNotesStage: React.FC<IndividualApplicationStageProps> = ({
    applicationInfo,
    setApplicationInfo,
    warnings
}) => {
    const showVisitorCountWarning = applicationInfo.visitor_count > 10;

    const handleVisitorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setApplicationInfo((application) => ({
            ...application,
            visitor_count: value
        }));
    };

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
                        
                        <div>
                            <TextInput
                                label="Grupta kaç öğrenci olması bekleniyor?"
                                withAsterisk
                                placeholder="Bir sayı girin..."
                                value={applicationInfo.visitor_count === -1 ? "" : applicationInfo.visitor_count}
                                onChange={handleVisitorCountChange}
                                type="number"
                                error={warnings["no_student_count"] ? "0'dan büyük bir sayı giriniz." : false}
                                min={0}
                            />
                            {showVisitorCountWarning && (
                                <Alert 
                                    icon={<IconAlertCircle size={16} />}
                                    color="red"
                                    variant="light"
                                    mt="xs"
                                >
                                    Bireysel tur başvurularında en fazla 10 kişi olabilir. 10 kişiden kalabalık gruplar için lütfen <Link to="/group-tour-application"><u>Grup Turu Başvurusu'nda</u></Link> bulunun
                                </Alert>
                            )}
                            <Text size="xs" mt="xs" c="dimmed">
                                (Bireysel tur başvurularında en fazla 10 kişi olabilir)
                            </Text>
                        </div>

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