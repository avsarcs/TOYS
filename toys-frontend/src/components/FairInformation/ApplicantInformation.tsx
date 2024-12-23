import React from "react";
import { FairSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Popover, Space, Text } from "@mantine/core";
import { parsePhoneNumber } from "libphonenumber-js/max";

const ApplicantInformation: React.FC<FairSectionProps> = (props: FairSectionProps) =>{
  return (
    <Box p="lg">
      <Group>
        <Text size="md" fw={700}>Başvuran Bilgileri: &nbsp;
          <Text span>{ props.fair.applicant ? props.fair.applicant.fullname : "N/A" }</Text>
        </Text>
        <Popover trapFocus>
          <Popover.Target>
            <Button size=""><span className="iconify solar--eye-linear text-xl"/>&nbsp;İletişim Bilgileri</Button>
          </Popover.Target>
          <Popover.Dropdown p="lg" className="shadow-lg">
            <Text size="md" fw={700}>
              Email: &nbsp;<Text span>{ props.fair.applicant ? props.fair.applicant.email : "N/A"}</Text> &nbsp;
              <Button><Text span className="iconify text-lg solar--clipboard-list-linear"/></Button>
            </Text>
            <Space h="sm"/>
            <Text size="md" fw={700}>
              Telefon No: &nbsp;
              <Text span>
                { parsePhoneNumber(props.fair.applicant ? props.fair.applicant.phone : "0000000000", "TR").formatInternational() }
              </Text> &nbsp;
              <Button><Text span className="iconify text-lg solar--clipboard-list-linear"/></Button>
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Group>
    </Box>
  )
}

export default ApplicantInformation;