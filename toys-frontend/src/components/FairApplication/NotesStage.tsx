import React from 'react';
import { 
  Paper,
  Title,
  Textarea,
  Stack,
  Container
} from '@mantine/core';

// Import the model and types
import { FairApplicationModel } from '../../types/designed';
import { Dispatch, SetStateAction } from 'react';

// Define the props for the component
interface NotesStageProps {
  applicationInfo: FairApplicationModel;
  setApplicationInfo: Dispatch<SetStateAction<FairApplicationModel>>;
}

export const NotesStage: React.FC<NotesStageProps> = ({
  applicationInfo,
  setApplicationInfo,
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
              value={applicationInfo.fair_name}
              onChange={(e) => setApplicationInfo((application) => ({
                ...application,
                fair_name: e.target.value,
              }))}
              minRows={1}
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
                  notes: e.target.value,
                },
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
