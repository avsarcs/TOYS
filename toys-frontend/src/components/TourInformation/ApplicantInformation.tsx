import React from "react";
import { TourSectionProps } from "../../types/designed.ts";
import { Box, Button, Group, Popover, Space, Text } from "@mantine/core";
import { parsePhoneNumber } from "libphonenumber-js/max";

const ApplicantInformation: React.FC<TourSectionProps> = (props: TourSectionProps) =>{
  return (
    <Box p="lg">
      <Text size="md" fw={700}>Katılımcı Sayısı: <Text span>{ props.tour.visitor_count }</Text></Text>
      <Group>
        <Text size="md" fw={700}>Başvuran Bilgileri:</Text>
        <Popover trapFocus>
          <Text span>John Doe</Text>
          <Popover.Target>
            <Button size=""><span className="iconify solar--eye-linear text-xl"/>&nbsp;İletişim Bilgileri</Button>
          </Popover.Target>
          <Popover.Dropdown p="lg" className="shadow-lg">
            <Text size="md" fw={700}>
              Email: &nbsp;<Text span>{ props.tour.applicant.email }</Text> &nbsp;
              <Button><Text span className="iconify text-lg solar--clipboard-list-linear"/></Button>
            </Text>
            <Space h="sm"/>
            <Text size="md" fw={700}>
              Telefon No: &nbsp;
              <Text span>
                { parsePhoneNumber(props.tour.applicant.phone, "TR").formatInternational() }
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