import React from 'react';
import { Box, Stack, Title, Text, Autocomplete, Button, Group } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { IndividualApplicationStageProps } from '../../types/designed';
import { Department } from '../../types/enum';

const MajorSelectionStage: React.FC<IndividualApplicationStageProps> = ({
  applicationInfo,
  setApplicationInfo,
}) => {
  const majorOptions = Object.values(Department);

  const addMajor = () => {
    if (!applicationInfo.requested_majors) {
      setApplicationInfo(prev => ({
        ...prev,
        requested_majors: ['']
      }));
      return;
    }

    if (applicationInfo.requested_majors.length >= 3) return;

    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: [...prev.requested_majors || [], '']
    }));
  };

  const removeMajor = (index: number) => {
    const newMajors = [...(applicationInfo.requested_majors || [])];
    newMajors.splice(index, 1);
    
    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: newMajors
    }));
  };

  const handleMajorSelect = (index: number, value: string | null) => {
    if (!Object.values(Department).includes(value as Department) && value !== null) return;
    
    const newMajors = [...(applicationInfo.requested_majors || [])];
    newMajors[index] = value as Department;

    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: newMajors
    }));
  };

  return (
    <Box className="w-full max-w-md">
      <Stack gap="md" p="md">
        <Title order={2}>Rehber Bölüm Tercihi</Title>
        <Text size="sm" c="dimmed">
          Garanti vermemekle birlikte turunuz için seçtiğiniz bölümden bir rehber ayarlamaya çalışacağız.
          (Bir tercihiniz yoksa bu aşamayı atlayabilirsiniz.)
        </Text>

        <Stack gap="md">
          {(applicationInfo.requested_majors || []).map((major, index) => (
            <Group key={index} gap="xs" align="flex-end">
              <Autocomplete
                className="flex-grow"
                label={`${index + 1}. Seçim`}
                value={major}
                onChange={(value) => handleMajorSelect(index, value)}
                data={majorOptions}
                classNames={{
                  input: 'bg-blue-50 border-0',
                  label: 'text-blue-500 font-medium mx-2'
                }}
                placeholder="Bölüm seçiniz"
                clearable
              />
              <Button 
                color="red" 
                variant="subtle" 
                onClick={() => removeMajor(index)}
                className="mb-1"
              >
                <IconX size={16} />
              </Button>
            </Group>
          ))}
        </Stack>

        {(!applicationInfo.requested_majors || applicationInfo.requested_majors.length < 3) && (
          <Button
            variant="light"
            leftSection={<IconPlus size={16} />}
            onClick={addMajor}
          >
            Seçim Ekle
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default MajorSelectionStage;