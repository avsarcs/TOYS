import React, {useCallback, useContext, useEffect, useState} from "react";
import { Box, Divider, Flex, Group, Space, Stack, Title, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { TourData } from "../../types/data.ts";
import StatusInformation from "../../components/TourInformation/StatusInformation.tsx";
import GeneralInformation from "../../components/TourInformation/GeneralInformation.tsx";
import ApplicantInformation from "../../components/TourInformation/ApplicantInformation.tsx";
import GuideInformation from "../../components/TourInformation/GuideInformation.tsx";
import TimeInformation from "../../components/TourInformation/TimeInformation.tsx";
import {UserContext} from "../../context/UserContext.tsx";
import {isObjectEmpty} from "../../lib/utils.tsx";

const TOUR_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/event/tour");

const TourPage: React.FC = () => {
  const userContext = useContext(UserContext);
  const [error, setError] = useState<Error | undefined>(undefined);
  const params = useParams();

  const [tour, setTour] = useState<TourData>({} as TourData);

  if(!params.tourId) throw new Error("Tour ID is required");

  const getTour = useCallback(async (tourId: string) => {
    const tourUrl = new URL(TOUR_URL);
    tourUrl.searchParams.append("tid", tourId);
    tourUrl.searchParams.append("auth", userContext.authToken);

    const res = await fetch(tourUrl, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const tourText = await res.text();
    if(tourText.length === 0) {
      throw new Error("Tour not found");
    }

    setTour(JSON.parse(tourText));
  }, [userContext.authToken]);

  useEffect(() => {
    getTour(params.tourId as string).catch((reason) => {
      setError(reason);
    });

    return () => {
      setTour({} as TourData);
    }
  }, [params.tourId, getTour]);

  if(error) {
    throw error;
  }

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
        {
          isObjectEmpty(tour)
            ? <Text p="lg">Detaylar alınıyor...</Text>
            :
            <>
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
            </>
        }
      </Box>
    </Flex>
  );
}

export default TourPage;