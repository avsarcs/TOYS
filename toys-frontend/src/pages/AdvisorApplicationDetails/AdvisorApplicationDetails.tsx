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
  IconPhone,
  IconBook2,
  IconBriefcase,
  IconFileDescription,
  IconUser
} from '@tabler/icons-react';
import { AdvisorApplication } from '../../types/designed';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const AdvisorApplicationDetails: React.FC = () => {
  const { application_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // fetch the actual application from the backend using the id
    console.log(application_id);
  }, []);

  const details: AdvisorApplication = {
    id: "99001122",
    high_school: "DOGA KOLEJI",
    fullname: "Linda Doe",
    phone: "+8889990000",
    major: "ECONOMICS",
    application_explanation: "I want to help guide new students through their academic journey and share my experiences to help them succeed.",
    experience: "4 events"
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
          onClick={() => navigate(-1)}
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2} ta="center" style={{ flex: 1 }}>
          Advisor Application Details
        </Title>
      </Group>

      {/* Main Content */}
      <Paper shadow="sm" radius="md" p="xl" withBorder>
        {/* Applicant Name */}
        <Group mb="lg" gap="xs">
          <IconUser size={18} />
          <Text fw={700} size="lg">{details.fullname}</Text>
        </Group>

        <Grid>
          {/* Left Column */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack>
              <Group gap="xs">
                <Text fw={500} >ID:</Text>
                <Text>{details.id}</Text>
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
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        {/* Additional Information */}
        <Stack gap="md">
          <div>
            <Group gap="xs" mb="xs">
              <IconFileDescription size={18} />
              <Text fw={500}>Why do you want to be an advisor?</Text>
            </Group>
            <Text ml={26}>
              {details.application_explanation}
            </Text>
          </div>

          <div>
            <Group gap="xs" mb="xs">
              <IconBriefcase size={18} />
              <Text fw={500}>Experience</Text>
              <Text ml={26}>
                {details.experience}
              </Text>
            </Group>

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

export default AdvisorApplicationDetails;