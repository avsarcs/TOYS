import React from "react";
import { Box, Divider, Flex, Group, Space, Stack, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { Tour } from "../../types/designed.ts";
import { ApplicantRole, TourStatus, TourType } from "../../types/enum.ts";
import StatusInformation from "../../components/TourInformation/StatusInformation.tsx";
import GeneralInformation from "../../components/TourInformation/GeneralInformation.tsx";
import ApplicantInformation from "../../components/TourInformation/ApplicantInformation.tsx";
import GuideInformation from "../../components/TourInformation/GuideInformation.tsx";
import TimeInformation from "../../components/TourInformation/TimeInformation.tsx";

const mockdata : {
  0: Tour
} = {
  0: {
    type: TourType.INDIVIDUAL,
    highschool_name: "Ankara Fen Lisesi",
    guides: [ { id: 0, name: "Scarlett Johansson"} ],
    trainee_guides: [],
    requested_times: ["2024-09-30T09:00:00Z", "2024-09-30T11:00:00Z"],
    accepted_time: "2024-09-30T09:00:00Z",
    visitor_count: 1,
    status: TourStatus.APPROVED,
    notes: "",
    applicant: {
      fullname: "John Doe",
      role: ApplicantRole.STUDENT,
      email: "john.doe@gmail.com",
      phone: "0 (555) 555 55 55",
      notes: ""
    },
    actual_start_time: "",
    actual_end_time: "",
    classroom: "Mithat Çoruh Amfi"
  }
}

const TourPage: React.FC = () => {
  const params = useParams();
  const key = Number(params["tourId"]) as keyof typeof mockdata;

  if(params["tourId"] === undefined || mockdata[key] === undefined) {
    throw Error("TourInformation not found.");
  }

  const tour: Tour = mockdata[key];

  return (
    <Flex direction="column" mih="100vh" className="overflow-y-clip">
      <Box className="flex-grow-0 flex-shrink-0">
        <Group p="xl">
          <Box>
            <Title order={1} className="text-blue-700 font-bold font-main">
              Tur Bilgileri
            </Title>
            <Title order={3} className="text-gray-400 font-bold font-main">
              Kim, ne, nerede, ne zaman, nasıl?
            </Title>
          </Box>
        </Group>
        <Divider className="border-gray-400"/>
        <Space h="lg"/>
        <StatusInformation tour={tour}/>
        <Divider className="border-gray-300"/>
        <Stack gap="0" className="bg-gray-50">
          <GeneralInformation tour={tour}/>
          <Divider className="border-gray-200"/>
          <ApplicantInformation tour={tour}/>
          <Divider className="border-gray-200"/>
          <GuideInformation tour={tour}/>
          <Divider className="border-gray-200"/>
          <TimeInformation tour={tour}/>
        </Stack>
      </Box>
    </Flex>
  )
}

export default TourPage;