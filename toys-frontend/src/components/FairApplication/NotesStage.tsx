import React from 'react';
import { 
  Paper,
  Title,
  TextInput,
  Textarea,
  Stack,
  Container
} from '@mantine/core';

import { FairApplicationProps } from '../../types/designed';

export const NotesStage: React.FC<FairApplicationProps> = ({
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

            <Textarea
              label="Fuarınızın adı nedir?"
              description="(Örneğin 'Üniversiteleri Tanıyın!' vs.)"
              placeholder="..."
              value={applicationInfo.applicant.notes}
              onChange={(e) => setApplicationInfo((application) => ({
                ...application,
                applicant: {
                  ...application.applicant,
                  notes: e.target.value
                }
              }))}
              minRows={4}
            />

            <Textarea
              label="Bize bırakmak istediğiniz başka notlar var mı?"
              description="(Örneğin özel ihtiyaç sahibi öğrenciler vs.)"
              placeholder="..."
              value={applicationInfo.applicant.notes}
              onChange={(e) => setApplicationInfo((application) => ({
                ...application,
                applicant: {
                  ...application.applicant,
                  notes: e.target.value
                }
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