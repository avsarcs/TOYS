import React from 'react';
import { 
  Paper,
  Title,
  TextInput,
  Textarea,
  Stack,
  Text,
  Container
} from '@mantine/core';

import { GroupApplicationStageProps } from '../../types/designed';

export const NotesStage: React.FC<GroupApplicationStageProps> = ({
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
              value={applicationInfo["student_count"] == -1 ? "" : applicationInfo["student_count"]}
              onChange={(e) => setApplicationInfo((application) => ({
                ...application,
                "student_count": parseInt(e.target.value)
              }))}
              type="number"
              error={warnings["no_student_count"] ? "0'dan büyük bir sayı giriniz." : false}
              min={0}
            />

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

export default NotesStage;