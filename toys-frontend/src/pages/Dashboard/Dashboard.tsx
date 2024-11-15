import { Box, Divider, Flex, Space, Title } from "@mantine/core";
import ElementList from "../../components/Dashboard/ElementList.tsx";
import ElementInfoBox from "../../components/Dashboard/ElementInfoBox.tsx";
import { useState } from "react";
import { DashboardElement } from "../../types/designed.ts";

const Dashboard: React.FC = () => {
  const [element, setElement] = useState<DashboardElement | null>(null);

  return (
    <Flex direction="column" h="100vh" className="overflow-y-clip">
      <Box className="flex-grow-0 flex-shrink-0">
        <Title p="xl" pb="" order={1} className="text-blue-700 font-bold font-main">
          Pano
        </Title>
        <Title order={3} pl="xl" className="text-gray-400 font-bold font-main">
          Önemli olan her şey bir yerde.
        </Title>
        <Space h="xl"/>
        <Divider className="border-gray-400"/>
      </Box>
      <Flex p="xl" direction="row" gap="xl" justify="space-between" className="flex-grow flex-shrink">
        <Box className="basis-1 flex-grow"><ElementList setElement={setElement}/></Box>
        <Box className="w-96 flex-shrink-0 flex-grow-0"><ElementInfoBox element={element}/></Box>
      </Flex>
    </Flex>
  );
}

export default Dashboard;