import React from 'react';
import { Box, Stack, Title, Text, Select, Button, Group } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { IndividualApplicationStageProps } from '../../types/designed';
import { Department } from '../../types/enum';

const MajorSelectionStage: React.FC<IndividualApplicationStageProps> = ({
  applicationInfo,
  setApplicationInfo,
  warnings
}) => {
  const showErrors = warnings?.no_major_selected;
  
  // Create data array for Select with proper value/label pairs
  const majorOptions = Object.entries(Department).map(([key, value]) => ({
    value: key,
    label: value
  }));

  // Handle adding a new major selection field
  const addMajor = () => {
    if (!applicationInfo.requested_majors) {
      setApplicationInfo(prev => ({
        ...prev,
        requested_majors: ['']
      }));
      return;
    }

    // Don't allow adding new fields if there are any empty selections
    if (applicationInfo.requested_majors.some(major => major === '')) {
      return;
    }

    if (applicationInfo.requested_majors.length >= 3) return;
    
    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: [...prev.requested_majors, '']
    }));
  };

  // Handle removing a major selection field
  const removeMajor = (index: number) => {
    const newMajors = [...applicationInfo.requested_majors];
    newMajors.splice(index, 1);
    
    // Ensure we always have at least one major field
    if (newMajors.length === 0) {
      newMajors.push('');
    }
    
    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: newMajors
    }));
  };

  // Handle major selection change
  const handleMajorChange = (value: string | null, index: number) => {
    const newMajors = [...applicationInfo.requested_majors];
    newMajors[index] = value || '';
    setApplicationInfo(prev => ({
      ...prev,
      requested_majors: newMajors
    }));
  };

  const isInputInvalid = (index: number) =>
    showErrors && (!applicationInfo.requested_majors[index] || applicationInfo.requested_majors[index] === '');

  const canAddMore = 
    applicationInfo.requested_majors.length < 3 && 
    !applicationInfo.requested_majors.some(major => major === '');

  return (
    <Box className="w-full max-w-md">
      <Stack gap="md" p="md">
        <Title order={2}>Rehber Bölüm Tercihi</Title>
        <Text size="sm" c="dimmed">
          Garanti vermemekle birlikte turunuz için seçtiğiniz bölümden bir rehber ayarlamaya çalışacağız.
          En az bir bölüm seçmeniz gerekmektedir.
        </Text>
        <Stack gap="md">
          {applicationInfo.requested_majors.map((major, index) => (
            <Group key={index} gap="xs" align="flex-end">
              <Select
                className="flex-grow"
                label={`${index + 1}. Seçim`}
                value={major}
                onChange={(value) => handleMajorChange(value, index)}
                data={majorOptions}
                searchable
                clearable
                classNames={{
                  input: `bg-blue-50 border-2 ${isInputInvalid(index) ? 'border-red-500' : 'border-transparent'}`,
                  label: 'text-blue-500 font-medium mx-2'
                }}
                placeholder="Bölüm seçiniz"
                error={isInputInvalid(index) && "Bu alan boş bırakılamaz"}
                required
              />
              {applicationInfo.requested_majors.length > 1 && (
                <Button
                  color="red"
                  variant="subtle"
                  onClick={() => removeMajor(index)}
                  className="mb-1"
                >
                  <IconX size={16} />
                </Button>
              )}
            </Group>
          ))}
        </Stack>
        {canAddMore && (
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