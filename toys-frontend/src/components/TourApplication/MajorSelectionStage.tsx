import React from 'react';
import { Box, Stack, Title, Text, Autocomplete, Button, Group } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { IndividualApplicationStageProps } from '../../types/designed';
import { Department } from '../../types/enum';

const MajorSelectionStage: React.FC<IndividualApplicationStageProps> = ({
  applicationInfo,
  setApplicationInfo,
}) => {
  const majorDisplayNames = Object.values(Department);

  // Initialize with empty array instead of default majors
  React.useEffect(() => {
    if (!applicationInfo.requested_majors) {
      setApplicationInfo(prev => ({
        ...prev,
        requested_majors: []
      }));
    }
  }, []);

  const getEnumFromDisplay = (displayName: string): Department | undefined => {
    const enumKey = Object.entries(Department).find(([_, value]) => value === displayName)?.[0];
    return enumKey as Department | undefined;
  };

  const getDisplayFromEnum = (enumValue: keyof typeof Department): string => {
    return Department[enumValue];
  };

  const addMajor = () => {
    if (!applicationInfo.requested_majors) {
      setApplicationInfo(prev => ({
        ...prev,
        requested_majors: [''] // Start with one empty slot
      }));
      return;
    }

    if (applicationInfo.requested_majors.length >= 3) return;

    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: [...(prev.requested_majors || []), ''] // Add an empty slot
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

  const handleMajorSelect = (index: number, displayValue: string | null) => {
    if (!displayValue) {
      const newMajors = [...(applicationInfo.requested_majors || [])];
      newMajors[index] = ''; // Keep the empty slot instead of removing it
      setApplicationInfo(prev => ({
        ...prev,
        requested_majors: newMajors
      }));
      return;
    }
   
    const enumValue = getEnumFromDisplay(displayValue);
    if (!enumValue) return;
   
    const newMajors = [...(applicationInfo.requested_majors || [])];
    newMajors[index] = enumValue;
   
    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: newMajors
    }));
  };

  // Use actual majors from applicationInfo, no defaults
  const currentMajors = applicationInfo.requested_majors || [];

  return (
    <Box className="w-full max-w-md">
      <Stack gap="md" p="md">
        <Title order={2}>Rehber Bölüm Tercihi</Title>
        <Text size="sm" c="dimmed">
          Garanti vermemekle birlikte turunuz için seçtiğiniz bölümden bir rehber ayarlamaya çalışacağız.
          En az bir bölüm seçmeniz gerekmektedir.
        </Text>
        <Stack gap="md">
          {currentMajors.map((major, index) => (
            <Group key={index} gap="xs" align="flex-end">
              <Autocomplete
                className="flex-grow"
                label={`${index + 1}. Seçim`}
                value={major ? getDisplayFromEnum(major as keyof typeof Department) : ''}
                onChange={(value) => handleMajorSelect(index, value)}
                data={majorDisplayNames}
                classNames={{
                  input: 'bg-blue-50 border-0',
                  label: 'text-blue-500 font-medium mx-2'
                }}
                placeholder="Bölüm seçiniz"
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
        {currentMajors.length < 3 && (
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