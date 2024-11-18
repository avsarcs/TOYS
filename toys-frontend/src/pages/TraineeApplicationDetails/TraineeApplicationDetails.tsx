import { 
  Paper, 
  Title, 
  Group, 
  Button, 
  Text, 
  Stack,
  Grid,
  ActionIcon,
  Container,
  Divider
} from '@mantine/core';
import {
  IconArrowLeft,
  IconSchool,
  IconMail,
  IconPhone,
  IconBook2,
  IconCalendar,
  IconWorld,
  IconHelpCircle,
  IconTarget
} from '@tabler/icons-react';
import { TraineeApplication } from '../../types/designed';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const TraineeApplicationDetails : React.FC = () => {

    const { application_id } = useParams()

    useEffect(() => {
        // fetch the actual application from the backend using the id
        console.log(application_id)
    }, [])

  const navigate = useNavigate()

  const details: TraineeApplication = {
    fullname: "Liam Johnson",
    id: "99001122",
    high_school: "DOGA KOLEJI",
    email: "liam.johnson@example.com",
    phone: "+8889990000",
    major: "ECONOMICS",
    current_semester: 8,
    next_semester_exchange: true,
    how_did_you_hear: "On the university noticeboard",
    why_apply: "To learn in a diverse academic environment"
  };

  return (
    <Container size="md" p="md">
      {/* Header */}
      <Group mb="lg" justify="flex-start" align="center">
        <ActionIcon 
          variant="subtle" 
          color="blue" 
          size="lg"
          aria-label="Back"
        >
          <IconArrowLeft onClick={(() => { navigate(-1) })} size={20} />
        </ActionIcon>
        <Title order={2} ta="center" style={{ flex: 1 }}>
          Trainee Guide Application Details
        </Title>
      </Group>

      {/* Main Content */}
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        <Grid>
          {/* Left Column */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Title order={3}>{details.fullname}</Title>
              <Group gap="xs">
                <Text fw={500} w={80}>ID:</Text>
                <Text>{details.id}</Text>
              </Group>
              <Group gap="xs">
                <IconMail size={18} />
                <Text>{details.email}</Text>
              </Group>
              <Group gap="xs">
                <IconPhone size={18} />
                <Text>{details.phone}</Text>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Right Column */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Group gap="xs">
                <IconSchool size={18} />
                <Text fw={500} w={100}>High School:</Text>
                <Text>{details.high_school}</Text>
              </Group>
              <Group gap="xs">
                <IconBook2 size={18} />
                <Text fw={500} w={100}>Major:</Text>
                <Text>{details.major}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={18} />
                <Text fw={500} w={100}>Semester:</Text>
                <Text>{details.current_semester}</Text>
              </Group>
              <Group gap="xs">
                <IconWorld size={18} />
                <Text fw={500} w={100}>Next Semester Exchange:</Text>
                <Text>{details.next_semester_exchange ? 'Yes' : 'No'}</Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        {/* Additional Information */}
        <Stack gap="md">
          <div>
            <Group gap="xs" mb="xs">
              <IconHelpCircle size={18} />
              <Text fw={500}>How did you hear about us?</Text>
            </Group>
            <Text ml={26}>
              {details.how_did_you_hear}
            </Text>
          </div>

          <div>
            <Group gap="xs" mb="xs">
              <IconTarget size={18} />
              <Text fw={500}>Why do you want to apply?</Text>
            </Group>
            <Text ml={26}>
              {details.why_apply}
            </Text>
          </div>
        </Stack>

        {/* Action Buttons */}
        <Group mt="xl" justify="flex-start">
          <Button color="green">Approve</Button>
          <Button color="red">Reject</Button>
        </Group>
      </Paper>
    </Container>
  );
};

export default TraineeApplicationDetails;