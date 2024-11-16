import React, { useState } from "react";
import { DashboardCategoryControlProps } from "../../types/designed.ts";
import { Text, FloatingIndicator, UnstyledButton, Group } from "@mantine/core";

const NotificationCategoryControl: React.FC<DashboardCategoryControlProps> = (props: DashboardCategoryControlProps) => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [buttonRefs, setButtonRefs] = useState<Record<number, HTMLButtonElement | null>>({});
  const [selectedCategory, setSelectedCategory] = useState(0);

  const setControlRef = (index: number) => (node: HTMLButtonElement) => {
    buttonRefs[index] = node;
    setButtonRefs(buttonRefs);
  };

  const controls = props.categories.map((item, index) => (
    <UnstyledButton
      className="z-10 data-[selected]:text-white p-2 pl-4 pr-4 pb-1 mb-1"
      bd="sm"
      key={index}
      ref={setControlRef(index)}
      onClick={() => { setSelectedCategory(index); props.setCategory(item.value); }}
      mod={{ selected: selectedCategory === index }}
    >
      <Text className="transition-color duration-200" size="lg" fw={500}>{item.label}</Text>
    </UnstyledButton>
  ));

  return (
    <Group ref={setRootRef} gap="0" className="w-fit border-2 border-b-1 border-gray-100 bg-gray-100 relative">
      {controls}

      <FloatingIndicator
        className="bg-blue-500 rounded-md"
        target={buttonRefs[selectedCategory]}
        parent={rootRef}
      />
    </Group>
  );
}

export default NotificationCategoryControl;