import React, { useContext, useState } from "react";
import { FairSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Space, Text } from "@mantine/core";
import { IconUserPlus, IconUsers } from "@tabler/icons-react";
import { UserContext } from "../../context/UserContext.tsx";
import {FairStatus, UserRole} from "../../types/enum.ts";
import ManageGuidesWindow from "./ManageGuidesWindow.tsx";
import {notifications} from "@mantine/notifications";

const VISITOR_PER_GUIDE = 60;

const GuideInformation: React.FC<FairSectionProps> = (props: FairSectionProps) => {
  const userContext = useContext(UserContext);
  const [manageGuidesOpen, setManageGuidesOpen] = useState(false);
  const userAssignedToFair = props.fair.guides.some((value) => value.id === userContext.user.id);

  const guideListText =
    props.fair.guides.length > 0
      ? props.fair.guides.map((value) => value.full_name).join(", ")
      : "Kimse";

  const guideListColor = props.fair.guides.length > 0 ? "dark" : "red";


  return (
    <>
      <Group p="lg" className="bg-gray-100" justify="space-between" align="flex-start">
        <Box>
          <Text size="md" fw={700}>
            Rehberler:
            <Text c={guideListColor} span>
              &nbsp;{guideListText}
            </Text>
          </Text>
          <Text size="md" fw={700}>
          userAssignedToFair ? "Bu turda bir rehbersiniz." :
          </Text>
          <Space h="sm" />
        </Box>
        <Box>
          {userContext.user.role === UserRole.COORDINATOR && props.fair.status === FairStatus.CONFIRMED && (
            <Button
              size="md"
              leftSection={<IconUsers />}
              onClick={() => setManageGuidesOpen(true)}
            >
              Rehberleri Yönet
            </Button>
          )}
        </Box>
      </Group>

      {/* Manage Guides Popup */}
      <ManageGuidesWindow
        opened={manageGuidesOpen}
        onClose={() => setManageGuidesOpen(false)}
        fair = {props.fair}
      />
    </>
  );
};

export default GuideInformation;
