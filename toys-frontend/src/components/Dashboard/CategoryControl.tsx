import React, { useState } from "react";
import { DashboardCategoryControlProps } from "../../types/designed.ts";
import {Text, FloatingIndicator, UnstyledButton, Box, Stack, Paper} from "@mantine/core";

const CategoryControl: React.FC<DashboardCategoryControlProps> = (props: DashboardCategoryControlProps) => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [buttonRefs, setButtonRefs] = useState<Record<number, HTMLButtonElement | null>>({});
  const [selectedCategory, setSelectedCategory] = useState(0);

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    buttonRefs[index] = node;
    setButtonRefs(buttonRefs);
  };

  const controls = props.categories.map((item, index) => (
    <Box className="flex-shrink-0 flex-grow-0 basis-1/3 border-gray-300 rounded-lg shadow-sm text-center" key={index}>
      <UnstyledButton
        className="data-[selected]:text-white w-full"
        key={index}
        ref={setControlRef(index)}
        onClick={() => { setSelectedCategory(index); props.setCategory(item.value); }}
        mod={{ selected: selectedCategory === index }}
      >
        <Paper withBorder shadow="md" p="sm">
          <Text className="relative z-50 transition-color duration-200" size="lg" fw={500}>{item.label}</Text>
        </Paper>
      </UnstyledButton>
    </Box>
  ));

  return (
    <Stack ref={setRootRef} gap="0" className="relative max-w-fit border-gray-100 bg-gray-100">
      {controls}

      <FloatingIndicator
        className="-z-5 bg-blue-500 rounded-md border-2 border-blue-700 shadow-md"
        target={buttonRefs[selectedCategory]}
        parent={rootRef}
      />
    </Stack>
  );
}

export default CategoryControl;